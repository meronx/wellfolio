package models

import "time"

// Transaction types
const (
	TypeBuy             = "buy"
	TypeSell            = "sell"
	TypeSplit           = "split"
	TypeDividend        = "dividend"
	TypeInterestEarning = "interest_earning"
	TypeTax             = "tax"
	TypeWithdrawal      = "withdrawal"
	TypeDeposit         = "deposit"
)

// Transaction represents a financial transaction
type Transaction struct {
	ID        uint      `json:"id"         gorm:"primaryKey;autoIncrement"`
	Date      time.Time `json:"date"`
	Type      string    `json:"type"       gorm:"not null"`
	Symbol    string    `json:"symbol"`
	Name      string    `json:"name"`
	Quantity  float64   `json:"quantity"`
	Price     float64   `json:"price"`
	Fees      float64   `json:"fees"`
	Amount    float64   `json:"amount"`
	Currency  string    `json:"currency"   gorm:"default:'USD'"`
	Notes     string    `json:"notes"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Holding represents the current state of a single stock position
type Holding struct {
	Symbol          string  `json:"symbol"`
	Name            string  `json:"name"`
	Quantity        float64 `json:"quantity"`
	AverageCost     float64 `json:"average_cost"`
	TotalCost       float64 `json:"total_cost"`
	RealizedGain    float64 `json:"realized_gain"`
	Dividends       float64 `json:"dividends"`
	CurrentPrice    float64 `json:"current_price"`
	PreviousClose   float64 `json:"previous_close"`
	CurrentValue    float64 `json:"current_value"`
	UnrealizedGain  float64 `json:"unrealized_gain"`
	UnrealizedGainPct float64 `json:"unrealized_gain_pct"`
	DayChange       float64 `json:"day_change"`
	DayChangePct    float64 `json:"day_change_pct"`
	Currency        string  `json:"currency"`
	MarketCap       float64 `json:"market_cap"`
	Volume          int64   `json:"volume"`
	FiftyTwoWeekHigh float64 `json:"fifty_two_week_high"`
	FiftyTwoWeekLow  float64 `json:"fifty_two_week_low"`
	Weight          float64 `json:"weight"` // portfolio allocation %
}

// Portfolio is the aggregated view of all holdings and cash
type Portfolio struct {
	Holdings         []Holding `json:"holdings"`
	TotalValue       float64   `json:"total_value"`
	TotalCost        float64   `json:"total_cost"`
	TotalUnrealizedGain    float64   `json:"total_unrealized_gain"`
	TotalUnrealizedGainPct float64   `json:"total_unrealized_gain_pct"`
	TotalRealizedGain float64  `json:"total_realized_gain"`
	TotalDividends   float64   `json:"total_dividends"`
	TotalInterest    float64   `json:"total_interest"`
	TotalFees        float64   `json:"total_fees"`
	TotalTaxes       float64   `json:"total_taxes"`
	CashBalance      float64   `json:"cash_balance"`
	DayChange        float64   `json:"day_change"`
	DayChangePct     float64   `json:"day_change_pct"`
}

// Quote is a real-time price quote from Yahoo Finance
type Quote struct {
	Symbol          string  `json:"symbol"`
	ShortName       string  `json:"short_name"`
	LongName        string  `json:"long_name"`
	Price           float64 `json:"price"`
	PreviousClose   float64 `json:"previous_close"`
	Change          float64 `json:"change"`
	ChangePct       float64 `json:"change_pct"`
	DayHigh         float64 `json:"day_high"`
	DayLow          float64 `json:"day_low"`
	Volume          int64   `json:"volume"`
	MarketCap       float64 `json:"market_cap"`
	FiftyTwoWeekHigh float64 `json:"fifty_two_week_high"`
	FiftyTwoWeekLow  float64 `json:"fifty_two_week_low"`
	Currency        string  `json:"currency"`
	Exchange        string  `json:"exchange"`
}

// SearchResult represents a stock search hit
type SearchResult struct {
	Symbol    string `json:"symbol"`
	ShortName string `json:"short_name"`
	LongName  string `json:"long_name"`
	Exchange  string `json:"exchange"`
	QuoteType string `json:"quote_type"`
}

// TimeSeriesPoint is a single data point for a historical chart
type TimeSeriesPoint struct {
	Date  string  `json:"date"`
	Value float64 `json:"value"`
}
