package api

import (
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/meronx/wellfolio/internal/models"
	"github.com/meronx/wellfolio/internal/yahoo"
	"gorm.io/gorm"
)

// Handlers holds the database reference for all handlers.
type Handlers struct {
	db *gorm.DB
}

func NewHandlers(db *gorm.DB) *Handlers {
	return &Handlers{db: db}
}

// ──────────────────────────────────────────────────────────────
// Transactions
// ──────────────────────────────────────────────────────────────

func (h *Handlers) ListTransactions(c *gin.Context) {
	var txns []models.Transaction
	q := h.db.Order("date desc, id desc")

	if sym := c.Query("symbol"); sym != "" {
		q = q.Where("symbol = ?", strings.ToUpper(sym))
	}
	if typ := c.Query("type"); typ != "" {
		q = q.Where("type = ?", typ)
	}

	if err := q.Find(&txns).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, txns)
}

func (h *Handlers) CreateTransaction(c *gin.Context) {
	var txn models.Transaction
	if err := c.ShouldBindJSON(&txn); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	txn.Symbol = strings.ToUpper(txn.Symbol)
	if txn.Date.IsZero() {
		txn.Date = time.Now()
	}

	if err := h.db.Create(&txn).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, txn)
}

func (h *Handlers) UpdateTransaction(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var existing models.Transaction
	if err := h.db.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "transaction not found"})
		return
	}

	if err := c.ShouldBindJSON(&existing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	existing.ID = uint(id)
	existing.Symbol = strings.ToUpper(existing.Symbol)

	if err := h.db.Save(&existing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, existing)
}

func (h *Handlers) DeleteTransaction(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.db.Delete(&models.Transaction{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

// ──────────────────────────────────────────────────────────────
// Portfolio calculation
// ──────────────────────────────────────────────────────────────

// buildHoldings computes current holdings from all transactions.
func buildHoldings(txns []models.Transaction) (map[string]*holdingAccum, float64, float64, float64, float64, float64) {
	type costLayer struct {
		qty  float64
		cost float64
	}
	accums := map[string]*holdingAccum{}
	var cashBalance, totalInterest, totalTaxes, totalFees float64

	// Sort by date ascending for correct FIFO/average cost calculation
	sort.Slice(txns, func(i, j int) bool {
		return txns[i].Date.Before(txns[j].Date)
	})

	for _, t := range txns {
		totalFees += t.Fees

		switch t.Type {
		case models.TypeDeposit:
			cashBalance += t.Amount

		case models.TypeWithdrawal:
			cashBalance -= t.Amount

		case models.TypeInterestEarning:
			cashBalance += t.Amount
			totalInterest += t.Amount

		case models.TypeTax:
			cashBalance -= t.Amount
			totalTaxes += t.Amount

		case models.TypeBuy:
			a := getOrCreateAccum(accums, t.Symbol)
			if t.Name != "" && a.name == "" {
				a.name = t.Name
			}
			cost := t.Quantity*t.Price + t.Fees
			a.quantity += t.Quantity
			a.totalCost += cost
			cashBalance -= cost
			if t.Currency != "" {
				a.currency = t.Currency
			}

		case models.TypeSell:
			a := getOrCreateAccum(accums, t.Symbol)
			if a.quantity > 0 {
				avgCost := a.totalCost / a.quantity
				costOfSold := t.Quantity * avgCost
				proceeds := t.Quantity*t.Price - t.Fees
				a.realizedGain += proceeds - costOfSold
				a.totalCost -= costOfSold
				a.quantity -= t.Quantity
				if a.quantity < 0 {
					a.quantity = 0
				}
				cashBalance += proceeds
			}

		case models.TypeSplit:
			a := getOrCreateAccum(accums, t.Symbol)
			// Quantity field holds the split ratio (e.g. 2 for a 2-for-1 split)
			if t.Quantity > 0 {
				a.quantity *= t.Quantity
				// cost basis stays the same; average cost per share drops
			}

		case models.TypeDividend:
			a := getOrCreateAccum(accums, t.Symbol)
			a.dividends += t.Amount
			cashBalance += t.Amount
		}
	}

	return accums, cashBalance, totalInterest, totalTaxes, totalFees, 0
}

type holdingAccum struct {
	symbol       string
	name         string
	currency     string
	quantity     float64
	totalCost    float64
	realizedGain float64
	dividends    float64
}

func getOrCreateAccum(m map[string]*holdingAccum, symbol string) *holdingAccum {
	if a, ok := m[symbol]; ok {
		return a
	}
	a := &holdingAccum{symbol: symbol, currency: "USD"}
	m[symbol] = a
	return a
}

func (h *Handlers) GetPortfolio(c *gin.Context) {
	var txns []models.Transaction
	if err := h.db.Find(&txns).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	accums, cashBalance, totalInterest, totalTaxes, totalFees, _ := buildHoldings(txns)

	var holdings []models.Holding
	var totalCost, totalValue, totalUnrealized, totalRealized, totalDividends float64
	var totalDayChange float64

	for _, a := range accums {
		if a.quantity <= 0 {
			// Still count realized gains from closed positions
			totalRealized += a.realizedGain
			totalDividends += a.dividends
			continue
		}

		h := models.Holding{
			Symbol:       a.symbol,
			Name:         a.name,
			Quantity:     a.quantity,
			TotalCost:    a.totalCost,
			RealizedGain: a.realizedGain,
			Dividends:    a.dividends,
			Currency:     a.currency,
		}
		if a.quantity > 0 {
			h.AverageCost = a.totalCost / a.quantity
		}

		// Fetch live price from Yahoo Finance
		if q, err := yahoo.GetQuote(a.symbol); err == nil {
			if h.Name == "" {
				h.Name = q.LongName
			}
			h.CurrentPrice = q.Price
			h.PreviousClose = q.PreviousClose
			h.DayChange = (q.Price - q.PreviousClose) * a.quantity
			h.DayChangePct = q.ChangePct
			h.MarketCap = q.MarketCap
			h.Volume = q.Volume
			h.FiftyTwoWeekHigh = q.FiftyTwoWeekHigh
			h.FiftyTwoWeekLow = q.FiftyTwoWeekLow
			h.Currency = q.Currency
		}

		h.CurrentValue = h.Quantity * h.CurrentPrice
		h.UnrealizedGain = h.CurrentValue - h.TotalCost
		if h.TotalCost != 0 {
			h.UnrealizedGainPct = h.UnrealizedGain / h.TotalCost * 100
		}

		totalCost += h.TotalCost
		totalValue += h.CurrentValue
		totalUnrealized += h.UnrealizedGain
		totalRealized += h.RealizedGain
		totalDividends += h.Dividends
		totalDayChange += h.DayChange

		holdings = append(holdings, h)
	}

	// Sort holdings by current value descending
	sort.Slice(holdings, func(i, j int) bool {
		return holdings[i].CurrentValue > holdings[j].CurrentValue
	})

	// Compute portfolio weight
	for i := range holdings {
		if totalValue > 0 {
			holdings[i].Weight = holdings[i].CurrentValue / totalValue * 100
		}
	}

	grandTotal := totalValue + cashBalance
	dayChangePct := 0.0
	if grandTotal-totalDayChange > 0 {
		dayChangePct = totalDayChange / (grandTotal - totalDayChange) * 100
	}

	portfolio := models.Portfolio{
		Holdings:               holdings,
		TotalValue:             totalValue,
		TotalCost:              totalCost,
		TotalUnrealizedGain:    totalUnrealized,
		TotalRealizedGain:      totalRealized,
		TotalDividends:         totalDividends,
		TotalInterest:          totalInterest,
		TotalFees:              totalFees,
		TotalTaxes:             totalTaxes,
		CashBalance:            cashBalance,
		DayChange:              totalDayChange,
		DayChangePct:           dayChangePct,
	}
	if totalCost > 0 {
		portfolio.TotalUnrealizedGainPct = totalUnrealized / totalCost * 100
	}

	c.JSON(http.StatusOK, portfolio)
}

// ──────────────────────────────────────────────────────────────
// Yahoo Finance endpoints
// ──────────────────────────────────────────────────────────────

func (h *Handlers) GetQuote(c *gin.Context) {
	symbol := strings.ToUpper(c.Param("symbol"))
	quote, err := yahoo.GetQuote(symbol)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, quote)
}

func (h *Handlers) SearchSymbol(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "q parameter required"})
		return
	}
	results, err := yahoo.SearchSymbol(query)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, results)
}

// ──────────────────────────────────────────────────────────────
// Chart data
// ──────────────────────────────────────────────────────────────

func (h *Handlers) GetChartData(c *gin.Context) {
	var txns []models.Transaction
	if err := h.db.Order("date asc").Find(&txns).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Cumulative invested capital over time
	var invested []models.TimeSeriesPoint
	var runningInvested float64
	for _, t := range txns {
		switch t.Type {
		case models.TypeDeposit:
			runningInvested += t.Amount
		case models.TypeWithdrawal:
			runningInvested -= t.Amount
		case models.TypeBuy:
			runningInvested += t.Quantity*t.Price + t.Fees
		case models.TypeSell:
			runningInvested -= t.Quantity*t.Price - t.Fees
		}
		invested = append(invested, models.TimeSeriesPoint{
			Date:  t.Date.Format("2006-01-02"),
			Value: runningInvested,
		})
	}

	// Monthly dividends
	monthlyDividends := map[string]float64{}
	for _, t := range txns {
		if t.Type == models.TypeDividend {
			key := t.Date.Format("2006-01")
			monthlyDividends[key] += t.Amount
		}
	}

	// Sort dividend keys
	divKeys := make([]string, 0, len(monthlyDividends))
	for k := range monthlyDividends {
		divKeys = append(divKeys, k)
	}
	sort.Strings(divKeys)
	dividends := make([]models.TimeSeriesPoint, 0, len(divKeys))
	for _, k := range divKeys {
		dividends = append(dividends, models.TimeSeriesPoint{Date: k, Value: monthlyDividends[k]})
	}

	c.JSON(http.StatusOK, gin.H{
		"invested":  invested,
		"dividends": dividends,
	})
}
