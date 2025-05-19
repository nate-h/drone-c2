package main

import (
	"context"
	"log"
	"os"

	"drone-c2/db"
	"drone-c2/router"
)

func main() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	ctx := context.Background()
	dbPool, err := db.InitDB(ctx, databaseURL)
	if err != nil {
		log.Fatalf("Failed to initialize DB: %v", err)
	}

	r := router.SetupRouter(dbPool)

	// Run the server on port 8080.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
