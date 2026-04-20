package yahoo

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/meronx/wellfolio/internal/models"
)

const (
	chartURL  = "https://query1.finance.yahoo.com/v8/finance/chart/%s?range=1d&interval=1d"
	searchURL = "https://query2.finance.yahoo.com/v1/finance/search?q=%s&quotesCount=10&newsCount=0"
)

var httpClient = &http.Client{Timeout: 10 * time.Second}

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
