package api

import (
"github.com/gin-gonic/gin"
"gorm.io/gorm"
)

// SetupRoutes registers all API routes on the provided engine.
func SetupRoutes(r *gin.Engine, db *gorm.DB) {
h := NewHandlers(db)

api := r.Group("/api")
{
// Portfolio management
api.GET("/portfolios", h.ListPortfolios)
api.POST("/portfolios", h.CreatePortfolio)
api.PUT("/portfolios/:id", h.UpdatePortfolio)
api.DELETE("/portfolios/:id", h.DeletePortfolio)

// Server-side settings (persisted in docker volume via DB)
api.GET("/settings", h.GetSettings)
api.PUT("/settings", h.UpdateSettings)

// Portfolio data (filtered by portfolio_id query param)
api.GET("/portfolio", h.GetPortfolio)
api.GET("/charts", h.GetChartData)

// Transactions CRUD
api.GET("/transactions", h.ListTransactions)
api.POST("/transactions", h.CreateTransaction)
api.PUT("/transactions/:id", h.UpdateTransaction)
api.DELETE("/transactions/:id", h.DeleteTransaction)

// CSV import / export
api.GET("/export", h.ExportCSV)
api.GET("/transactions/export", h.ExportCSV)
api.POST("/import", h.ImportCSV)
api.POST("/transactions/import", h.ImportCSV)

// Yahoo Finance
api.GET("/quote/:symbol", h.GetQuote)
api.GET("/search", h.SearchSymbol)
api.GET("/history/:symbol", h.GetStockHistory)
api.GET("/asset-profile/:symbol", h.GetAssetProfile)

// Dividend calendar (both paths for compatibility)
api.GET("/dividend-calendar", h.GetDividendCalendar)
api.GET("/dividends/calendar", h.GetDividendCalendar)
}
}
