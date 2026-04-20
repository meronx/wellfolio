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
// Portfolio
api.GET("/portfolio", h.GetPortfolio)
api.GET("/charts", h.GetChartData)

// Transactions CRUD
api.GET("/transactions", h.ListTransactions)
api.POST("/transactions", h.CreateTransaction)
api.PUT("/transactions/:id", h.UpdateTransaction)
api.DELETE("/transactions/:id", h.DeleteTransaction)

// CSV import / export
api.GET("/transactions/export", h.ExportCSV)
api.POST("/transactions/import", h.ImportCSV)

// Yahoo Finance
api.GET("/quote/:symbol", h.GetQuote)
api.GET("/search", h.SearchSymbol)
api.GET("/history/:symbol", h.GetStockHistory)
api.GET("/asset-profile/:symbol", h.GetAssetProfile)

// Dividend calendar
api.GET("/dividend-calendar", h.GetDividendCalendar)
}
}
