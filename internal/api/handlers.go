package api

import (
"encoding/csv"
"encoding/json"
"fmt"
"io"
"math"
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

// txnPayload is a wire-format struct that accepts dates as plain "YYYY-MM-DD" strings
// so that we avoid time.Time's strict RFC3339-only JSON unmarshalling.
type txnPayload struct {
ID          uint    `json:"id"`
PortfolioID uint    `json:"portfolio_id"`
Date        string  `json:"date"`
Type        string  `json:"type"`
Symbol      string  `json:"symbol"`
Name        string  `json:"name"`
Quantity    float64 `json:"quantity"`
Price       float64 `json:"price"`
Fees        float64 `json:"fees"`
Amount      float64 `json:"amount"`
Currency    string  `json:"currency"`
Notes       string  `json:"notes"`
}

// parseFlexDate accepts "YYYY-MM-DD", RFC3339, or "YYYY-MM-DDTHH:MM:SSZ".
func parseFlexDate(s string) (time.Time, error) {
for _, layout := range []string{"2006-01-02", time.RFC3339, "2006-01-02T15:04:05Z"} {
if t, err := time.Parse(layout, s); err == nil {
// Normalise date-only values to noon UTC so they survive TZ conversions.
if layout == "2006-01-02" {
return time.Date(t.Year(), t.Month(), t.Day(), 12, 0, 0, 0, time.UTC), nil
}
return t, nil
}
}
return time.Time{}, fmt.Errorf("unsupported date format: %q", s)
}

// bindTxnPayload reads the request body and returns a populated models.Transaction.
func bindTxnPayload(c *gin.Context) (models.Transaction, error) {
body, err := io.ReadAll(c.Request.Body)
if err != nil {
return models.Transaction{}, err
}
var p txnPayload
if err := json.Unmarshal(body, &p); err != nil {
return models.Transaction{}, err
}
txn := models.Transaction{
ID:          p.ID,
PortfolioID: p.PortfolioID,
Type:        p.Type,
Symbol:      p.Symbol,
Name:        p.Name,
Quantity:    p.Quantity,
Price:       p.Price,
Fees:        p.Fees,
Amount:      p.Amount,
Currency:    p.Currency,
Notes:       p.Notes,
}
if p.Date != "" {
if t, err := parseFlexDate(p.Date); err == nil {
txn.Date = t
}
}
return txn, nil
}

// portfolioID extracts the portfolio_id from query params, defaulting to 1.
func portfolioID(c *gin.Context) uint {
if raw := c.Query("portfolio_id"); raw != "" {
if id, err := strconv.Atoi(raw); err == nil && id > 0 {
return uint(id)
}
}
return 1
}

// ──────────────────────────────────────────────────────────────
// Portfolio Management
// ──────────────────────────────────────────────────────────────

func (h *Handlers) ListPortfolios(c *gin.Context) {
var portfolios []models.PortfolioModel
if err := h.db.Order("id asc").Find(&portfolios).Error; err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}
c.JSON(http.StatusOK, portfolios)
}

func (h *Handlers) CreatePortfolio(c *gin.Context) {
var body struct {
Name string `json:"name"`
}
if err := c.ShouldBindJSON(&body); err != nil || strings.TrimSpace(body.Name) == "" {
c.JSON(http.StatusBadRequest, gin.H{"error": "name required"})
return
}
p := models.PortfolioModel{Name: strings.TrimSpace(body.Name)}
if err := h.db.Create(&p).Error; err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}
c.JSON(http.StatusCreated, p)
}

func (h *Handlers) UpdatePortfolio(c *gin.Context) {
id, err := strconv.Atoi(c.Param("id"))
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
return
}
var body struct {
Name string `json:"name"`
}
if err := c.ShouldBindJSON(&body); err != nil || strings.TrimSpace(body.Name) == "" {
c.JSON(http.StatusBadRequest, gin.H{"error": "name required"})
return
}
if err := h.db.Model(&models.PortfolioModel{}).Where("id = ?", id).Update("name", strings.TrimSpace(body.Name)).Error; err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}
var p models.PortfolioModel
h.db.First(&p, id)
c.JSON(http.StatusOK, p)
}

func (h *Handlers) DeletePortfolio(c *gin.Context) {
id, err := strconv.Atoi(c.Param("id"))
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
return
}
var count int64
h.db.Model(&models.PortfolioModel{}).Count(&count)
if count <= 1 {
c.JSON(http.StatusBadRequest, gin.H{"error": "cannot delete the last portfolio"})
return
}
h.db.Where("portfolio_id = ?", id).Delete(&models.Transaction{})
if err := h.db.Delete(&models.PortfolioModel{}, id).Error; err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}
c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

// ──────────────────────────────────────────────────────────────
// App Settings (persisted in docker volume via DB)
// ──────────────────────────────────────────────────────────────

func (h *Handlers) GetSettings(c *gin.Context) {
var rows []models.AppSetting
h.db.Find(&rows)
result := map[string]string{}
for _, s := range rows {
result[s.Key] = s.Value
}
c.JSON(http.StatusOK, result)
}

func (h *Handlers) UpdateSettings(c *gin.Context) {
var body map[string]interface{}
if err := c.ShouldBindJSON(&body); err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
for k, v := range body {
h.db.Save(&models.AppSetting{Key: k, Value: fmt.Sprintf("%v", v)})
}
c.JSON(http.StatusOK, body)
}

// ──────────────────────────────────────────────────────────────
// Transactions CRUD
// ──────────────────────────────────────────────────────────────

func (h *Handlers) ListTransactions(c *gin.Context) {
var txns []models.Transaction
pid := portfolioID(c)
q := h.db.Where("portfolio_id = ?", pid).Order("date desc, id desc")

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
txn, err := bindTxnPayload(c)
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
txn.Symbol = strings.ToUpper(txn.Symbol)
if txn.Date.IsZero() {
txn.Date = time.Now()
}
if txn.PortfolioID == 0 {
txn.PortfolioID = portfolioID(c)
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

updated, err := bindTxnPayload(c)
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}
updated.ID = uint(id)
// Preserve portfolio association
if updated.PortfolioID == 0 {
updated.PortfolioID = existing.PortfolioID
}
updated.Symbol = strings.ToUpper(updated.Symbol)
// Keep original date if not supplied
if updated.Date.IsZero() {
updated.Date = existing.Date
}

if err := h.db.Save(&updated).Error; err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}
c.JSON(http.StatusOK, updated)
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
// CSV Export / Import
// ──────────────────────────────────────────────────────────────

var csvHeader = []string{"date", "type", "symbol", "name", "quantity", "price", "amount", "fees", "currency", "notes"}

func (h *Handlers) ExportCSV(c *gin.Context) {
var txns []models.Transaction
pid := portfolioID(c)
if err := h.db.Where("portfolio_id = ?", pid).Order("date asc, id asc").Find(&txns).Error; err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}

c.Header("Content-Type", "text/csv; charset=utf-8")
c.Header("Content-Disposition", `attachment; filename="wellfolio_transactions.csv"`)

w := csv.NewWriter(c.Writer)
_ = w.Write(csvHeader)
for _, t := range txns {
_ = w.Write([]string{
t.Date.UTC().Format("2006-01-02"),
t.Type,
t.Symbol,
t.Name,
strconv.FormatFloat(t.Quantity, 'f', -1, 64),
strconv.FormatFloat(t.Price, 'f', -1, 64),
strconv.FormatFloat(t.Amount, 'f', -1, 64),
strconv.FormatFloat(t.Fees, 'f', -1, 64),
t.Currency,
t.Notes,
})
}
w.Flush()
}

func (h *Handlers) ImportCSV(c *gin.Context) {
pid := portfolioID(c)
file, _, err := c.Request.FormFile("file")
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "file field required"})
return
}
defer file.Close()

r := csv.NewReader(file)
r.TrimLeadingSpace = true

records, err := r.ReadAll()
if err != nil {
c.JSON(http.StatusBadRequest, gin.H{"error": "invalid CSV: " + err.Error()})
return
}
if len(records) < 2 {
c.JSON(http.StatusBadRequest, gin.H{"error": "CSV has no data rows"})
return
}

// Skip header row
var imported, skipped int
for _, row := range records[1:] {
if len(row) < 9 {
skipped++
continue
}

dateStr := strings.TrimSpace(row[0])
txnType := strings.TrimSpace(row[1])
symbol  := strings.ToUpper(strings.TrimSpace(row[2]))
name    := strings.TrimSpace(row[3])

qty, _    := strconv.ParseFloat(strings.TrimSpace(row[4]), 64)
price, _  := strconv.ParseFloat(strings.TrimSpace(row[5]), 64)
amount, _ := strconv.ParseFloat(strings.TrimSpace(row[6]), 64)
fees, _   := strconv.ParseFloat(strings.TrimSpace(row[7]), 64)
currency  := strings.TrimSpace(row[8])
var notes string
if len(row) > 9 {
notes = strings.TrimSpace(row[9])
}

date, err := time.Parse("2006-01-02", dateStr)
if err != nil {
date, err = time.Parse("2006-01-02T15:04:05Z", dateStr)
if err != nil {
skipped++
continue
}
}
date = time.Date(date.Year(), date.Month(), date.Day(), 12, 0, 0, 0, time.UTC)

validTypes := map[string]bool{
"buy": true, "sell": true, "split": true, "dividend": true,
"interest_earning": true, "tax": true, "withdrawal": true, "deposit": true,
}
if !validTypes[txnType] {
skipped++
continue
}
if currency == "" {
currency = "USD"
}

txn := models.Transaction{
PortfolioID: pid,
Date:        date,
Type:        txnType,
Symbol:      symbol,
Name:        name,
Quantity:    qty,
Price:       price,
Amount:      amount,
Fees:        fees,
Currency:    currency,
Notes:       notes,
}
if err := h.db.Create(&txn).Error; err == nil {
imported++
} else {
skipped++
}
}

c.JSON(http.StatusOK, gin.H{
"imported": imported,
"skipped":  skipped,
})
}

// ──────────────────────────────────────────────────────────────
// Portfolio calculation
// ──────────────────────────────────────────────────────────────

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

func buildHoldings(txns []models.Transaction) (accums map[string]*holdingAccum, cashBalance, totalInterest, totalTaxes, totalFees, totalDeposited, totalWithdrawn float64) {
accums = map[string]*holdingAccum{}

sort.Slice(txns, func(i, j int) bool {
return txns[i].Date.Before(txns[j].Date)
})

for _, t := range txns {
totalFees += t.Fees

switch t.Type {
case models.TypeDeposit:
cashBalance += t.Amount
totalDeposited += t.Amount

case models.TypeWithdrawal:
cashBalance -= t.Amount
totalWithdrawn += t.Amount

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
if t.Quantity > 0 {
a.quantity *= t.Quantity
}

case models.TypeDividend:
a := getOrCreateAccum(accums, t.Symbol)
a.dividends += t.Amount
cashBalance += t.Amount
}
}

return
}

func (h *Handlers) GetPortfolio(c *gin.Context) {
var txns []models.Transaction
pid := portfolioID(c)
if err := h.db.Where("portfolio_id = ?", pid).Find(&txns).Error; err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}

accums, cashBalance, totalInterest, totalTaxes, totalFees, totalDeposited, totalWithdrawn := buildHoldings(txns)

var holdings []models.Holding
var totalCost, totalValue, totalUnrealized, totalRealized, totalDividends float64
var totalDayChange float64

for _, a := range accums {
if a.quantity <= 0 {
totalRealized += a.realizedGain
totalDividends += a.dividends
continue
}

hld := models.Holding{
Symbol:       a.symbol,
Name:         a.name,
Quantity:     a.quantity,
TotalCost:    a.totalCost,
RealizedGain: a.realizedGain,
Dividends:    a.dividends,
Currency:     a.currency,
}
if a.quantity > 0 {
hld.AverageCost = a.totalCost / a.quantity
}

if q, err := yahoo.GetQuote(a.symbol); err == nil {
if hld.Name == "" {
hld.Name = q.LongName
}
hld.CurrentPrice = q.Price
hld.PreviousClose = q.PreviousClose
hld.DayChange = (q.Price - q.PreviousClose) * a.quantity
hld.DayChangePct = q.ChangePct
hld.MarketCap = q.MarketCap
hld.Volume = q.Volume
hld.FiftyTwoWeekHigh = q.FiftyTwoWeekHigh
hld.FiftyTwoWeekLow = q.FiftyTwoWeekLow
hld.Currency = q.Currency
}

hld.CurrentValue = hld.Quantity * hld.CurrentPrice
hld.UnrealizedGain = hld.CurrentValue - hld.TotalCost
if hld.TotalCost != 0 {
hld.UnrealizedGainPct = hld.UnrealizedGain / hld.TotalCost * 100
}

totalCost += hld.TotalCost
totalValue += hld.CurrentValue
totalUnrealized += hld.UnrealizedGain
totalRealized += hld.RealizedGain
totalDividends += hld.Dividends
totalDayChange += hld.DayChange

holdings = append(holdings, hld)
}

sort.Slice(holdings, func(i, j int) bool {
return holdings[i].CurrentValue > holdings[j].CurrentValue
})

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
TotalDeposited:         totalDeposited,
TotalWithdrawn:         totalWithdrawn,
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

// Return camelCase keys matching the frontend expectations.
// Also merge in asset profile (sector/country/industry) when available.
resp := gin.H{
"symbol":           quote.Symbol,
"name":             quote.LongName,
"price":            quote.Price,
"change":           quote.Change,
"changePercent":    quote.ChangePct,
"currency":         quote.Currency,
"exchange":         quote.Exchange,
"marketCap":        quote.MarketCap,
"volume":           quote.Volume,
"fiftyTwoWeekHigh": quote.FiftyTwoWeekHigh,
"fiftyTwoWeekLow":  quote.FiftyTwoWeekLow,
}

if profile, pErr := yahoo.GetAssetProfile(symbol); pErr == nil && profile != nil {
resp["sector"]      = profile.Sector
resp["industry"]    = profile.Industry
resp["country"]     = profile.Country
resp["description"] = profile.Description
}

c.JSON(http.StatusOK, resp)
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
// Normalize to camelCase with `name` field for the frontend
type searchItem struct {
Symbol string `json:"symbol"`
Name   string `json:"name"`
}
out := make([]searchItem, 0, len(results))
for _, r := range results {
name := r.LongName
if name == "" {
name = r.ShortName
}
out = append(out, searchItem{Symbol: r.Symbol, Name: name})
}
c.JSON(http.StatusOK, out)
}

// GetAssetProfile returns sector/industry/country info for a symbol from Yahoo Finance.
func (h *Handlers) GetAssetProfile(c *gin.Context) {
symbol := strings.ToUpper(c.Param("symbol"))
profile, err := yahoo.GetAssetProfile(symbol)
if err != nil {
c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
return
}
c.JSON(http.StatusOK, profile)
}

// GetHoldingDetail returns detailed financials and analyst recommendations for a symbol.
func (h *Handlers) GetHoldingDetail(c *gin.Context) {
symbol := strings.ToUpper(c.Param("symbol"))
detail, err := yahoo.GetHoldingDetail(symbol)
if err != nil {
c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
return
}
c.JSON(http.StatusOK, detail)
}

// GetStockHistory returns OHLC + volume data for a symbol.
// Query params: period (default "1y"), interval (default "1d")
func (h *Handlers) GetStockHistory(c *gin.Context) {
symbol   := strings.ToUpper(c.Param("symbol"))
period   := c.DefaultQuery("period", "1y")
interval := c.DefaultQuery("interval", "1d")

validPeriods := map[string]bool{
"1mo": true, "3mo": true, "6mo": true,
"1y": true, "2y": true, "5y": true, "ytd": true,
}
validIntervals := map[string]bool{
"1d": true, "1wk": true, "1mo": true,
}
if !validPeriods[period] {
period = "1y"
}
if !validIntervals[interval] {
interval = "1d"
}

points, err := yahoo.GetHistory(symbol, period, interval)
if err != nil {
c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
return
}
c.JSON(http.StatusOK, points)
}

// ──────────────────────────────────────────────────────────────
// Chart data
// ──────────────────────────────────────────────────────────────

func (h *Handlers) GetChartData(c *gin.Context) {
var txns []models.Transaction
pid := portfolioID(c)
if err := h.db.Where("portfolio_id = ?", pid).Order("date asc").Find(&txns).Error; err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}

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

monthlyDividends := map[string]float64{}
typeTotals := map[string]float64{}
for _, t := range txns {
if t.Type == models.TypeDividend {
key := t.Date.Format("2006-01")
monthlyDividends[key] += t.Amount
}
switch t.Type {
case models.TypeBuy:
typeTotals["buy"] += t.Quantity * t.Price
case models.TypeSell:
typeTotals["sell"] += t.Quantity * t.Price
case models.TypeDividend:
typeTotals["dividend"] += t.Amount
case models.TypeInterestEarning:
typeTotals["interest_earning"] += t.Amount
case models.TypeTax:
typeTotals["tax"] += t.Amount
case models.TypeDeposit:
typeTotals["deposit"] += t.Amount
case models.TypeWithdrawal:
typeTotals["withdrawal"] += t.Amount
}
}

divKeys := make([]string, 0, len(monthlyDividends))
for k := range monthlyDividends {
divKeys = append(divKeys, k)
}
sort.Strings(divKeys)
dividends := make([]models.TimeSeriesPoint, 0, len(divKeys))
for _, k := range divKeys {
dividends = append(dividends, models.TimeSeriesPoint{Date: k, Value: monthlyDividends[k]})
}

type typeSummaryItem struct {
Type  string  `json:"type"`
Total float64 `json:"total"`
}
var typeSummary []typeSummaryItem
for typ, total := range typeTotals {
typeSummary = append(typeSummary, typeSummaryItem{Type: typ, Total: total})
}
sort.Slice(typeSummary, func(i, j int) bool {
return typeSummary[i].Total > typeSummary[j].Total
})

c.JSON(http.StatusOK, gin.H{
"invested":    invested,
"dividends":   dividends,
"typeSummary": typeSummary,
})
}

// ──────────────────────────────────────────────────────────────
// Dividend Calendar
// ──────────────────────────────────────────────────────────────

func (h *Handlers) GetDividendCalendar(c *gin.Context) {
var txns []models.Transaction
pid := portfolioID(c)
if err := h.db.Where("portfolio_id = ?", pid).Order("date asc").Find(&txns).Error; err != nil {
c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
return
}

now := time.Now().UTC()

// Find the oldest buy transaction date — dividends before this date are not relevant
var oldestBuyDate time.Time
for _, t := range txns {
if t.Type == models.TypeBuy && (oldestBuyDate.IsZero() || t.Date.Before(oldestBuyDate)) {
oldestBuyDate = t.Date
}
}

// Collect holding names, quantity, and currency from portfolio
accums, _, _, _, _, _, _ := buildHoldings(txns)
holdingNames    := map[string]string{}
holdingQty      := map[string]float64{}
holdingCurrency := map[string]string{}
for sym, a := range accums {
if a.quantity > 0 {
holdingNames[sym]    = a.name
holdingQty[sym]      = a.quantity
holdingCurrency[sym] = a.currency
}
}

// Collect paid dividends from our own transactions (month-level dedup key)
type divKey struct{ sym, month string }
paid := map[divKey]bool{}
for _, t := range txns {
if t.Type == models.TypeDividend && t.Symbol != "" {
k := divKey{t.Symbol, t.Date.Format("2006-01")}
paid[k] = true
}
}

var entries []models.DividendCalendarEntry

// Add our own historical dividend transactions as "paid" (has_transaction = true)
for _, t := range txns {
if t.Type != models.TypeDividend || t.Symbol == "" {
continue
}
// Skip if before oldest buy date (data integrity guard)
if !oldestBuyDate.IsZero() && t.Date.Before(oldestBuyDate) {
continue
}
aps := 0.0
qty := holdingQty[t.Symbol]
if qty > 0 {
aps = t.Amount / qty
}
cur := t.Currency
if cur == "" {
cur = holdingCurrency[t.Symbol]
}
entries = append(entries, models.DividendCalendarEntry{
Date:           t.Date.UTC().Format("2006-01-02"),
Symbol:         t.Symbol,
Name:           holdingNames[t.Symbol],
AmountPerShare: aps,
TotalAmount:    t.Amount,
Shares:         qty,
EntryType:      "paid",
Source:         "transaction",
HasTransaction:  true,
Currency:       cur,
})
}

// For each active holding, fetch Yahoo Finance dividend history to get per-share amounts
// and forecast upcoming dividends
for sym, qty := range holdingQty {
if qty <= 0 {
continue
}
divHistory, err := yahoo.GetDividendHistory(sym)
if err != nil || len(divHistory) == 0 {
continue
}
cur := holdingCurrency[sym]

// Add historical Yahoo dividends not already covered by our transactions
for _, ev := range divHistory {
if ev.Date.After(now) {
continue
}
// Skip events before oldest buy date
if !oldestBuyDate.IsZero() && ev.Date.Before(oldestBuyDate) {
continue
}
k := divKey{sym, ev.Date.Format("2006-01")}
if paid[k] {
continue // already have our own transaction
}
entries = append(entries, models.DividendCalendarEntry{
Date:           ev.Date.Format("2006-01-02"),
Symbol:         sym,
Name:           holdingNames[sym],
AmountPerShare: ev.Amount,
TotalAmount:    ev.Amount * qty,
Shares:         qty,
EntryType:      "paid",
Source:         "yahoo",
HasTransaction:  false,
Currency:       cur,
})
paid[k] = true
}

// Forecast upcoming dividends
freq, avgAmt, lastDate := inferFrequency(divHistory)
if freq == 0 || avgAmt == 0 {
continue
}

horizonMonths := 13
forecasted := 0
for i := 1; forecasted < horizonMonths; i++ {
nextDate := lastDate.AddDate(0, freq*i, 0)
if nextDate.Before(now.AddDate(0, -1, 0)) {
continue
}
if nextDate.After(now.AddDate(1, 1, 0)) {
break
}
entryType := "upcoming"
if nextDate.After(now) {
entryType = "forecast"
}
entries = append(entries, models.DividendCalendarEntry{
Date:           nextDate.Format("2006-01-02"),
Symbol:         sym,
Name:           holdingNames[sym],
AmountPerShare: avgAmt,
TotalAmount:    avgAmt * qty,
Shares:         qty,
EntryType:      entryType,
Frequency:      freqLabel(freq),
Source:         "forecast",
HasTransaction:  false,
Currency:       cur,
})
forecasted++
}
}

sort.Slice(entries, func(i, j int) bool {
return entries[i].Date < entries[j].Date
})

// Build response structure for frontend
// Group entries into months for the calendar grid
type calendarMonth struct {
Year   int                            `json:"year"`
Month  int                            `json:"month"`
Events []models.DividendCalendarEntry `json:"events"`
}

monthMap := map[string]*calendarMonth{}
for _, e := range entries {
d, _ := time.Parse("2006-01-02", e.Date)
key := fmt.Sprintf("%d-%02d", d.Year(), d.Month())
if _, ok := monthMap[key]; !ok {
monthMap[key] = &calendarMonth{Year: d.Year(), Month: int(d.Month())}
}
monthMap[key].Events = append(monthMap[key].Events, e)
}
monthKeys := make([]string, 0, len(monthMap))
for k := range monthMap {
monthKeys = append(monthKeys, k)
}
sort.Strings(monthKeys)
months := make([]*calendarMonth, 0, len(monthKeys))
for _, k := range monthKeys {
months = append(months, monthMap[k])
}

// Upcoming entries (future date, sorted)
var upcoming []models.DividendCalendarEntry
for _, e := range entries {
d, _ := time.Parse("2006-01-02", e.Date)
if d.After(now) {
upcoming = append(upcoming, e)
}
}

// Annual totals
annualTotals := map[int]float64{}
for _, e := range entries {
if e.EntryType == "paid" {
d, _ := time.Parse("2006-01-02", e.Date)
annualTotals[d.Year()] += e.TotalAmount
}
}
type annualItem struct {
Year  int     `json:"year"`
Total float64 `json:"total"`
}
annualKeys := make([]int, 0, len(annualTotals))
for yr := range annualTotals {
annualKeys = append(annualKeys, yr)
}
sort.Ints(annualKeys)
annual := make([]annualItem, 0, len(annualKeys))
for _, yr := range annualKeys {
annual = append(annual, annualItem{Year: yr, Total: annualTotals[yr]})
}

// Summary metrics
var totalDividends, totalDivLast12, annualForecast float64
twelveMonthsAgo := now.AddDate(-1, 0, 0)
for _, e := range entries {
if e.EntryType == "paid" {
totalDividends += e.TotalAmount
d, _ := time.Parse("2006-01-02", e.Date)
if d.After(twelveMonthsAgo) {
totalDivLast12 += e.TotalAmount
}
}
}
for _, e := range upcoming {
if e.EntryType == "forecast" {
annualForecast += e.TotalAmount
}
}

// Compute invested capital for yield calculation
accums2, _, _, _, _, _, _ := buildHoldings(txns)
var investedCapital float64
for _, a := range accums2 {
investedCapital += a.totalCost
}

yieldOnCost := 0.0
personalYieldPA := 0.0
if investedCapital > 0 {
yieldOnCost = totalDividends / investedCapital
personalYieldPA = totalDivLast12 / investedCapital
}

c.JSON(http.StatusOK, gin.H{
"months":              months,
"upcoming":            upcoming,
"annual":              annual,
"totalDividends":      totalDividends,
"totalDividendsLast12": totalDivLast12,
"annualForecast":      annualForecast,
"yieldOnCost":         yieldOnCost,
"personalYieldPA":     personalYieldPA,
})
}

// inferFrequency analyses historical dividend events to guess the payment cadence.
// Returns months between payments, average per-share amount, and last payment date.
func inferFrequency(events []yahoo.YahooDividendEvent) (freqMonths int, avgAmount float64, lastDate time.Time) {
if len(events) == 0 {
return
}
lastDate = events[len(events)-1].Date

// Use recent 8 events at most
recent := events
if len(recent) > 8 {
recent = events[len(events)-8:]
}

sum := 0.0
for _, e := range recent {
sum += e.Amount
}
avgAmount = sum / float64(len(recent))

if len(recent) < 2 {
freqMonths = 3 // default quarterly
return
}

// Calculate average gap in months
totalMonths := 0.0
for i := 1; i < len(recent); i++ {
diff := recent[i].Date.Sub(recent[i-1].Date)
totalMonths += diff.Hours() / (24 * 30.4375)
}
avgMonths := totalMonths / float64(len(recent)-1)
rawFreq := math.Round(avgMonths)

switch {
case rawFreq <= 1.5:
freqMonths = 1
case rawFreq <= 2.5:
freqMonths = 2
case rawFreq <= 4:
freqMonths = 3
case rawFreq <= 7:
freqMonths = 6
default:
freqMonths = 12
}
return
}

func freqLabel(months int) string {
switch months {
case 1:
return "monthly"
case 2:
return "bi-monthly"
case 3:
return "quarterly"
case 6:
return "semi-annual"
case 12:
return "annual"
default:
return fmt.Sprintf("every %d months", months)
}
}
