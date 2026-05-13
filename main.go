package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/meronx/wellfolio/internal/api"
	"github.com/meronx/wellfolio/internal/db"
)

//go:embed web
var webFiles embed.FS

func main() {
	// Initialise database
	database, err := db.Initialize()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Gin mode
	if os.Getenv("GIN_MODE") != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Register API routes
	api.SetupRoutes(r, database)

	// Sub-filesystem rooted at web/
	webFS, err := fs.Sub(webFiles, "web")
	if err != nil {
		log.Fatalf("Failed to create web sub-filesystem: %v", err)
	}

	// Serve /static/* from web/static/
	staticFS, err := fs.Sub(webFS, "static")
	if err != nil {
		log.Fatalf("Failed to create static sub-filesystem: %v", err)
	}
	r.StaticFS("/static", http.FS(staticFS))

	// Serve the SPA index for every non-API, non-static path
	r.NoRoute(func(c *gin.Context) {
		data, readErr := fs.ReadFile(webFS, "templates/index.html")
		if readErr != nil {
			c.Status(http.StatusInternalServerError)
			return
		}
		c.Data(http.StatusOK, "text/html; charset=utf-8", data)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Wellfolio listening on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
