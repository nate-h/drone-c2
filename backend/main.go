package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type App struct {
	Router    *gin.Engine
	DBPool    *pgxpool.Pool
	DBContext context.Context
}

func main() {
	// Load database URL from environment variable or use default
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	app := &App{}
	if err := app.Initialize(databaseURL); err != nil {
		log.Fatalf("Failed to initialize app: %v", err)
	}

	// Run the server on port 8080.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := app.Router.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

// Initialize sets up the application
func (app *App) Initialize(dbURL string) error {
	// Initialize database connection pool
	var err error
	app.DBContext = context.Background()
	app.DBPool, err = pgxpool.New(app.DBContext, dbURL)
	if err != nil {
		return fmt.Errorf("unable to create connection pool: %v", err)
	}

	// Test database connection
	err = app.DBPool.Ping(app.DBContext)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %v", err)
	}

	// Initialize Gin router
	app.Router = gin.Default()

	// Configure CORS middleware
	app.Router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3001"}, // Frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Define routes
	api := app.Router.Group("/api")
	{
		api.GET("/sites", app.getSites)
		api.GET("/drones", app.getDrones)
	}
	return nil
}

// Handler to get sites.
func (app *App) getDrones(c *gin.Context) {
	q := `SELECT d.tail_number, dm.model, dm.max_cargo_weight
		FROM drones d
		left join drone_models dm on d.model = dm.model;`
	rows, err := app.DBPool.Query(context.Background(), q)
	if err != nil {
		log.Printf("Error fetching drones: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	defer rows.Close()

	var drones []map[string]interface{}
	for rows.Next() {
		var tailNumber string
		var model string
		var maxCargoWeight float64

		err := rows.Scan(&tailNumber, &model, &maxCargoWeight)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		drones = append(
			drones,
			gin.H{"tailNumber": tailNumber, "model": model, "maxCargoWeight": maxCargoWeight},
		)
	}

	c.JSON(http.StatusOK, drones)
}

// Handler to get sites.
func (app *App) getSites(c *gin.Context) {
	q := "SELECT name, city, country, latitude, longitude, elevation FROM sites"
	rows, err := app.DBPool.Query(context.Background(), q)
	if err != nil {
		log.Printf("Error fetching sites: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	defer rows.Close()

	var sites []map[string]interface{}
	for rows.Next() {
		var name string
		var city string
		var country string
		var latitude float64
		var longitude float64
		var elevation int

		err := rows.Scan(&name, &city, &country, &latitude, &longitude, &elevation)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		sites = append(
			sites,
			gin.H{
				"name":      name,
				"city":      city,
				"country":   country,
				"latitude":  latitude,
				"longitude": longitude,
				"elevation": elevation,
			},
		)
	}

	c.JSON(http.StatusOK, sites)
}
