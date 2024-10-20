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
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "pong"})
		})
		api.GET("/count_items", countItems)
		api.GET("/items", getItems)
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

// Handler to get items
func countItems(c *gin.Context) {

	var count int
	err := db.QueryRow(context.Background(), "SELECT COUNT(*) FROM items").Scan(&count)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the count as JSON
	c.JSON(http.StatusOK, gin.H{
		"count": count,
	})
}

// Handler to get items
func getItems(c *gin.Context) {
	rows, err := db.Query(context.Background(), "SELECT id, name FROM items")
	if err != nil {
		log.Error("Error fetching items: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	defer rows.Close()

	var items []map[string]interface{}
	for rows.Next() {
		var id int
		var name string
		err := rows.Scan(&id, &name)
		if err != nil {
			log.Error("Error scanning row: ", err)
			continue
		}
		items = append(items, gin.H{"id": id, "name": name})
	}

	c.JSON(http.StatusOK, items)
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
