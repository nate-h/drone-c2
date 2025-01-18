package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
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
		api.GET("/image/:image_name", app.getImage)
	}
	return nil
}

func (app *App) getImage(c *gin.Context) {

	// Grab image we're looking for.
	imageName := c.Param("image_name")
	if imageName == "" {
		log.Println("No image name defined")
		c.String(http.StatusInternalServerError, "No image name defined.")
		return
	}

	ext := filepath.Ext(imageName)[1:]
	if ext != "png" && ext != "jpeg" {
		log.Println("Unsupported image type: ", ext)
		c.String(http.StatusInternalServerError, fmt.Sprintf("Unsupported image type: %s", ext))
		return
	}

	// Read the file into memory (small images).
	data, err := os.ReadFile("images/" + imageName)
	if err != nil {
		log.Println("Error reading file:", err)
		c.String(http.StatusInternalServerError, "Could not read the image.")
		return
	}

	// Serve the data with Content-Type "image/jpeg"
	// If your image is PNG, use "image/png", etc.
	c.Data(http.StatusOK, "image/"+ext, data)
}

// Handler to get sites.
func (app *App) getDrones(c *gin.Context) {
	q := `
	SELECT
		d.tail_number, dm.model, dm.max_cargo_weight, dm.image_path,
		JSON_AGG(
			JSON_BUILD_OBJECT(
				'latitude', dw.latitude,
				'longitude', dw.longitude,
				'altitude', dw.altitude,
				'heading', dw.heading,
				'speed', dw.speed,
				'fuel', dw.fuel,
				'timestamp', dw.timestamp
			)
			ORDER BY dw.timestamp
		) AS waypoints
	FROM drones d
	left join drone_models dm on d.model = dm.model
	left join drone_waypoints dw on dw.tail_number = d.tail_number
	GROUP BY d.tail_number, dm.model, dm.max_cargo_weight, dm.image_path;
	`
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
		var imagePath string
		var waypointsJSON string // To hold the JSON data for waypoints

		// Scan the row data, including the waypoints JSON.
		err := rows.Scan(&tailNumber, &model, &maxCargoWeight, &imagePath, &waypointsJSON)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		// Parse the JSON string into a Go structure (slice of maps).
		var waypoints []map[string]interface{}
		if err := json.Unmarshal([]byte(waypointsJSON), &waypoints); err != nil {
			log.Printf("Error unmarshalling waypoints JSON: %v", err)
			continue
		}

		// Append the drone information along with the parsed waypoints
		drones = append(
			drones,
			gin.H{
				"tailNumber":     tailNumber,
				"model":          model,
				"maxCargoWeight": maxCargoWeight,
				"imagePath":      imagePath,
				"waypoints":      waypoints,
			},
		)
	}

	c.JSON(http.StatusOK, drones)
}

// Handler to get sites.
func (app *App) getSites(c *gin.Context) {
	q := "SELECT name, site_type, latitude, longitude, elevation FROM sites"
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
		var site_type string
		var latitude float64
		var longitude float64
		var elevation int

		err := rows.Scan(&name, &site_type, &latitude, &longitude, &elevation)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		sites = append(
			sites,
			gin.H{
				"name":      name,
				"site_type": site_type,
				"latitude":  latitude,
				"longitude": longitude,
				"elevation": elevation,
			},
		)
	}

	c.JSON(http.StatusOK, sites)
}
