package router

import (
	"time"

	"drone-c2/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func SetupRouter(db *pgxpool.Pool) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	{
		api.GET("/drones", func(ctx *gin.Context) { handlers.GetDrones(ctx, db) })
		api.GET("/sites", func(ctx *gin.Context) { handlers.GetSites(ctx, db) })
		api.GET("/image/:image_name", func(ctx *gin.Context) { handlers.GetImage(ctx) })
		api.GET("/weather", func(ctx *gin.Context) { handlers.GetWeather(ctx) })
	}

	return r
}
