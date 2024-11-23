package main

import (
	"context"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v4"
	"github.com/sirupsen/logrus"
)

var db *pgx.Conn
var log = logrus.New()

func main() {
	// Configure Logrus
	log.Formatter = &logrus.TextFormatter{
		FullTimestamp: true,
	}
	log.Level = logrus.DebugLevel

	// Connect to PostgreSQL
	var err error
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}
	db, err = pgx.Connect(context.Background(), databaseURL)
	if err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}
	defer db.Close(context.Background())

	// Set up Gin router
	router := gin.Default()
	router.Use(cors.Default())

	api := router.Group("/api")
	{
		api.GET("/sites", getSites)
		api.GET("/drones", getDrones)
		api.POST("/items", createItem)
	}

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Info("Starting server on port ", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Server exited with error: ", err)
	}
}

// Handler to get sites.
func getDrones(c *gin.Context) {
	q := `SELECT d.tail_number, dm.model, dm.max_cargo_weight
		FROM drones d
		left join drone_models dm on d.model = dm.model;`
	rows, err := db.Query(context.Background(), q)
	if err != nil {
		log.Error("Error fetching drones: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	defer rows.Close()

	var drones []map[string]interface{}
	for rows.Next() {
		var tail_number string
		var model string
		var max_cargo_weight float64

		err := rows.Scan(&tail_number, &model, &max_cargo_weight)
		if err != nil {
			log.Error("Error scanning row: ", err)
			continue
		}

		drones = append(drones, gin.H{"tail_number": tail_number, "model": model, "max_cargo_weight": max_cargo_weight})
	}

	c.JSON(http.StatusOK, drones)
}

// Handler to get sites.
func getSites(c *gin.Context) {
	q := "SELECT name, city, country, latitude, longitude, elevation FROM sites"
	rows, err := db.Query(context.Background(), q)
	if err != nil {
		log.Error("Error fetching sites: ", err)
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
			log.Error("Error scanning row: ", err)
			continue
		}

		sites = append(sites, gin.H{"name": name, "city": city, "country": country, "latitude": latitude, "longitude": longitude, "elevation": elevation})
	}

	c.JSON(http.StatusOK, sites)
}

// Handler to create an item
func createItem(c *gin.Context) {
	var newItem struct {
		Name string `json:"name"`
	}

	if err := c.BindJSON(&newItem); err != nil {
		log.Error("Invalid input: ", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	var id int
	err := db.QueryRow(
		context.Background(),
		"INSERT INTO items (name) VALUES ($1) RETURNING id",
		newItem.Name,
	).Scan(&id)
	if err != nil {
		log.Error("Error inserting item: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": id, "name": newItem.Name})
}
