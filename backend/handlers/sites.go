package handlers

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetSites(ctx context.Context, db *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		q := "SELECT name, site_type, latitude, longitude, elevation FROM sites"

		rows, err := db.Query(ctx, q)
		if err != nil {
			log.Printf("Error fetching sites: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		defer rows.Close()

		var sites []map[string]interface{}
		for rows.Next() {
			var name, siteType string
			var latitude, longitude float64
			var elevation int

			err := rows.Scan(&name, &siteType, &latitude, &longitude, &elevation)
			if err != nil {
				log.Printf("Error scanning row: %v", err)
				continue
			}

			sites = append(sites, gin.H{
				"name":      name,
				"site_type": siteType,
				"latitude":  latitude,
				"longitude": longitude,
				"elevation": elevation,
			})
		}

		c.JSON(http.StatusOK, sites)
	}
}
