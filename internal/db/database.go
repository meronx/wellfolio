package db

import (
	"log"
	"os"
	"path/filepath"

	"github.com/glebarez/sqlite"
	"github.com/meronx/wellfolio/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Initialize opens (or creates) the SQLite database and runs migrations.
func Initialize() (*gorm.DB, error) {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "wellfolio.db"
	}

	// Ensure parent directory exists
	if dir := filepath.Dir(dbPath); dir != "." {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return nil, err
		}
	}

	logLevel := logger.Warn
	if os.Getenv("GIN_MODE") == "debug" {
		logLevel = logger.Info
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})
	if err != nil {
		return nil, err
	}

	// Auto-migrate schema
	if err := db.AutoMigrate(&models.PortfolioModel{}, &models.AppSetting{}, &models.Transaction{}); err != nil {
		return nil, err
	}

	// Seed the default portfolio (ID=1) if none exist
	var count int64
	db.Model(&models.PortfolioModel{}).Count(&count)
	if count == 0 {
		db.Create(&models.PortfolioModel{Name: "Default"})
	}

	log.Printf("Database initialized at %s", dbPath)
	return db, nil
}
