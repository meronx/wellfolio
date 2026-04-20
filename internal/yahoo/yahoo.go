package yahoo

import (
"encoding/json"
"fmt"
"io"
"net/http"
"net/url"
"sort"
"time"

"github.com/meronx/wellfolio/internal/models"
)

const (
chartURL            = "https://query1.finance.yahoo.com/v8/finance/chart/%s?range=1d&interval=1d"
searchURL           = "https://query2.finance.yahoo.com/v1/finance/search?q=%s&quotesCount=10&newsCount=0"
histURL             = "https://query2.finance.yahoo.com/v8/finance/chart/%s?range=%s&interval=%s&events=div&includeAdjustedClose=true"
assetProfileURL     = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/%s?modules=assetProfile"
divHistoryPeriod    = "5y"
divHistoryInterval  = "1mo"
)

var httpClient = &http.Client{Timeout: 15 * time.Second}

// yahooChartResponse matches the relevant fields from the Yahoo Finance v8 chart API.
type yahooChartResponse struct {
Chart struct {
Result []struct {
Meta struct {
Currency             string  `json:"currency"`
Symbol               string  `json:"symbol"`
ExchangeName         string  `json:"exchangeName"`
ShortName            string  `json:"shortName"`
LongName             string  `json:"longName"`
RegularMarketPrice   float64 `json:"regularMarketPrice"`
PreviousClose        float64 `json:"previousClose"`
RegularMarketDayHigh float64 `json:"regularMarketDayHigh"`
RegularMarketDayLow  float64 `json:"regularMarketDayLow"`
RegularMarketVolume  int64   `json:"regularMarketVolume"`
MarketCap            float64 `json:"marketCap"`
FiftyTwoWeekHigh     float64 `json:"fiftyTwoWeekHigh"`
FiftyTwoWeekLow      float64 `json:"fiftyTwoWeekLow"`
} `json:"meta"`
} `json:"result"`
Error *struct {
Code        string `json:"code"`
Description string `json:"description"`
} `json:"error"`
} `json:"chart"`
}

// yahooHistoricalResponse matches the v8 chart API for historical OHLC + events.
type yahooHistoricalResponse struct {
Chart struct {
Result []struct {
Meta struct {
Currency string `json:"currency"`
Symbol   string `json:"symbol"`
} `json:"meta"`
Timestamp []int64 `json:"timestamp"`
Events    struct {
Dividends map[string]struct {
Amount float64 `json:"amount"`
Date   int64   `json:"date"`
} `json:"dividends"`
} `json:"events"`
Indicators struct {
Quote []struct {
Open   []*float64 `json:"open"`
High   []*float64 `json:"high"`
Low    []*float64 `json:"low"`
Close  []*float64 `json:"close"`
Volume []*int64   `json:"volume"`
} `json:"quote"`
} `json:"indicators"`
} `json:"result"`
Error *struct {
Code        string `json:"code"`
Description string `json:"description"`
} `json:"error"`
} `json:"chart"`
}

// yahooSearchResponse matches the relevant fields from the Yahoo Finance search API.
type yahooSearchResponse struct {
Quotes []struct {
Symbol    string `json:"symbol"`
ShortName string `json:"shortname"`
LongName  string `json:"longname"`
Exchange  string `json:"exchange"`
QuoteType string `json:"quoteType"`
} `json:"quotes"`
}

// yahooQuoteSummaryResponse matches the Yahoo Finance v10 quoteSummary assetProfile module.
type yahooQuoteSummaryResponse struct {
QuoteSummary struct {
Result []struct {
AssetProfile struct {
Sector              string `json:"sector"`
Industry            string `json:"industry"`
Country             string `json:"country"`
Website             string `json:"website"`
LongBusinessSummary string `json:"longBusinessSummary"`
} `json:"assetProfile"`
} `json:"result"`
Error *struct {
Code        string `json:"code"`
Description string `json:"description"`
} `json:"error"`
} `json:"quoteSummary"`
}

func doGet(rawURL string) ([]byte, error) {
req, err := http.NewRequest(http.MethodGet, rawURL, nil)
if err != nil {
return nil, err
}
req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; Wellfolio/1.0)")
req.Header.Set("Accept", "application/json")

resp, err := httpClient.Do(req)
if err != nil {
return nil, err
}
defer resp.Body.Close()

if resp.StatusCode != http.StatusOK {
return nil, fmt.Errorf("yahoo finance returned status %d", resp.StatusCode)
}
return io.ReadAll(resp.Body)
}

// GetQuote fetches a real-time quote for the given symbol.
func GetQuote(symbol string) (*models.Quote, error) {
body, err := doGet(fmt.Sprintf(chartURL, url.PathEscape(symbol)))
if err != nil {
return nil, err
}

var parsed yahooChartResponse
if err := json.Unmarshal(body, &parsed); err != nil {
return nil, err
}
if parsed.Chart.Error != nil {
return nil, fmt.Errorf("yahoo finance error: %s – %s",
parsed.Chart.Error.Code, parsed.Chart.Error.Description)
}
if len(parsed.Chart.Result) == 0 {
return nil, fmt.Errorf("no data returned for symbol %s", symbol)
}

meta := parsed.Chart.Result[0].Meta
change := meta.RegularMarketPrice - meta.PreviousClose
changePct := 0.0
if meta.PreviousClose != 0 {
changePct = change / meta.PreviousClose * 100
}

name := meta.LongName
if name == "" {
name = meta.ShortName
}

return &models.Quote{
Symbol:           meta.Symbol,
ShortName:        meta.ShortName,
LongName:         name,
Price:            meta.RegularMarketPrice,
PreviousClose:    meta.PreviousClose,
Change:           change,
ChangePct:        changePct,
DayHigh:          meta.RegularMarketDayHigh,
DayLow:           meta.RegularMarketDayLow,
Volume:           meta.RegularMarketVolume,
MarketCap:        meta.MarketCap,
FiftyTwoWeekHigh: meta.FiftyTwoWeekHigh,
FiftyTwoWeekLow:  meta.FiftyTwoWeekLow,
Currency:         meta.Currency,
Exchange:         meta.ExchangeName,
}, nil
}

// GetHistory fetches historical OHLC data from Yahoo Finance.
// period: "1mo","3mo","6mo","1y","2y","5y"  interval: "1d","1wk","1mo"
func GetHistory(symbol, period, interval string) ([]models.OHLCPoint, error) {
rawURL := fmt.Sprintf(histURL, url.PathEscape(symbol), period, interval)
body, err := doGet(rawURL)
if err != nil {
return nil, err
}

var parsed yahooHistoricalResponse
if err := json.Unmarshal(body, &parsed); err != nil {
return nil, err
}
if parsed.Chart.Error != nil {
return nil, fmt.Errorf("yahoo finance error: %s – %s",
parsed.Chart.Error.Code, parsed.Chart.Error.Description)
}
if len(parsed.Chart.Result) == 0 {
return nil, fmt.Errorf("no historical data for %s", symbol)
}

result := parsed.Chart.Result[0]
if len(result.Indicators.Quote) == 0 || len(result.Timestamp) == 0 {
return nil, fmt.Errorf("empty price data for %s", symbol)
}

q := result.Indicators.Quote[0]
points := make([]models.OHLCPoint, 0, len(result.Timestamp))
for i, ts := range result.Timestamp {
if i >= len(q.Close) || q.Close[i] == nil {
continue
}
var open, high, low float64
var vol int64
if i < len(q.Open) && q.Open[i] != nil {
open = *q.Open[i]
}
if i < len(q.High) && q.High[i] != nil {
high = *q.High[i]
}
if i < len(q.Low) && q.Low[i] != nil {
low = *q.Low[i]
}
if i < len(q.Volume) && q.Volume[i] != nil {
vol = *q.Volume[i]
}
points = append(points, models.OHLCPoint{
Date:   time.Unix(ts, 0).UTC().Format("2006-01-02"),
Open:   open,
High:   high,
Low:    low,
Close:  *q.Close[i],
Volume: vol,
})
}
return points, nil
}

// YahooDividendEvent is a dividend payment from Yahoo Finance.
type YahooDividendEvent struct {
Symbol string
Date   time.Time
Amount float64
}

// GetDividendHistory fetches historical dividend events from Yahoo Finance for a symbol.
func GetDividendHistory(symbol string) ([]YahooDividendEvent, error) {
rawURL := fmt.Sprintf(histURL, url.PathEscape(symbol), divHistoryPeriod, divHistoryInterval)
body, err := doGet(rawURL)
if err != nil {
return nil, err
}

var parsed yahooHistoricalResponse
if err := json.Unmarshal(body, &parsed); err != nil {
return nil, err
}
if parsed.Chart.Error != nil {
return nil, fmt.Errorf("yahoo finance error: %s – %s",
parsed.Chart.Error.Code, parsed.Chart.Error.Description)
}
if len(parsed.Chart.Result) == 0 {
return nil, nil
}

events := parsed.Chart.Result[0].Events.Dividends
result := make([]YahooDividendEvent, 0, len(events))
for _, div := range events {
result = append(result, YahooDividendEvent{
Symbol: symbol,
Date:   time.Unix(div.Date, 0).UTC(),
Amount: div.Amount,
})
}
sort.Slice(result, func(i, j int) bool {
return result[i].Date.Before(result[j].Date)
})
return result, nil
}

// SearchSymbol searches Yahoo Finance for matching tickers.
func SearchSymbol(query string) ([]models.SearchResult, error) {
body, err := doGet(fmt.Sprintf(searchURL, url.QueryEscape(query)))
if err != nil {
return nil, err
}

var parsed yahooSearchResponse
if err := json.Unmarshal(body, &parsed); err != nil {
return nil, err
}

results := make([]models.SearchResult, 0, len(parsed.Quotes))
for _, q := range parsed.Quotes {
name := q.LongName
if name == "" {
name = q.ShortName
}
results = append(results, models.SearchResult{
Symbol:    q.Symbol,
ShortName: q.ShortName,
LongName:  name,
Exchange:  q.Exchange,
QuoteType: q.QuoteType,
})
}
return results, nil
}

// GetAssetProfile fetches sector, industry and country information from Yahoo Finance.
func GetAssetProfile(symbol string) (*models.AssetProfile, error) {
rawURL := fmt.Sprintf(assetProfileURL, url.PathEscape(symbol))
body, err := doGet(rawURL)
if err != nil {
return nil, err
}

var parsed yahooQuoteSummaryResponse
if err := json.Unmarshal(body, &parsed); err != nil {
return nil, err
}
if parsed.QuoteSummary.Error != nil {
return nil, fmt.Errorf("yahoo finance error: %s – %s",
parsed.QuoteSummary.Error.Code, parsed.QuoteSummary.Error.Description)
}
if len(parsed.QuoteSummary.Result) == 0 {
return nil, fmt.Errorf("no asset profile for symbol %s", symbol)
}

ap := parsed.QuoteSummary.Result[0].AssetProfile
return &models.AssetProfile{
Symbol:      symbol,
Sector:      ap.Sector,
Industry:    ap.Industry,
Country:     ap.Country,
Website:     ap.Website,
Description: ap.LongBusinessSummary,
}, nil
}
