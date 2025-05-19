package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetDrones(ctx *gin.Context, db *pgxpool.Pool) {
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
	LEFT JOIN drone_models dm ON d.model = dm.model
	LEFT JOIN drone_waypoints dw ON dw.tail_number = d.tail_number
	GROUP BY d.tail_number, dm.model, dm.max_cargo_weight, dm.image_path
	HAVING COUNT(dw.latitude) > 0;`

	rows, err := db.Query(ctx, q)
	if err != nil {
		log.Printf("Error fetching drones: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	defer rows.Close()

	var drones []map[string]interface{}
	for rows.Next() {
		var tailNumber, model, imagePath, waypointsJSON string
		var maxCargoWeight float64

		err := rows.Scan(&tailNumber, &model, &maxCargoWeight, &imagePath, &waypointsJSON)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}

		var waypoints []map[string]interface{}
		if err := json.Unmarshal([]byte(waypointsJSON), &waypoints); err != nil {
			log.Printf("Error unmarshalling waypoints JSON: %v", err)
			continue
		}

		drones = append(drones, gin.H{
			"tailNumber":     tailNumber,
			"model":          model,
			"maxCargoWeight": maxCargoWeight,
			"imagePath":      imagePath,
			"waypoints":      waypoints,
		})
	}

	ctx.JSON(http.StatusOK, drones)
}
