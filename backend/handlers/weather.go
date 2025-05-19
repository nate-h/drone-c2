package handlers

import (
	"net/http"

	"math/rand"

	"github.com/gin-gonic/gin"
)

type Weather struct {
	Temperature   int     `json:"temperature"`
	Cloudiness    int     `json:"cloudiness"`
	Precipitation bool    `json:"precipitation"`
	WindSpeed     float64 `json:"wind_speed"`
}

// GetWeather is an example handler function that generates random weather data
// based on latitude and longitude query parameters. It uses the provided
// coordinates to seed a random number generator to create random weather data.
//
// Note: This is an example implementation. In a real-world scenario, you might
// query a weather API to get actual weather data instead of generating random values.
func GetWeather(ctx *gin.Context) {
	// Get latitude and longitude from query parameters.
	lat := ctx.Query("lat")
	lon := ctx.Query("lon")

	// Use latitude and longitude to seed the random generator.
	seed := int64(0)
	for _, char := range lat + lon {
		seed += int64(char)
	}
	r := rand.New(rand.NewSource(seed))

	weather := Weather{
		Temperature:   r.Intn(21) + 70,  // Random temp between 70-90
		Cloudiness:    r.Intn(101),      // Random cloudiness percentage (0-100)
		Precipitation: r.Intn(2) == 1,   // Random true/false for precipitation
		WindSpeed:     r.Float64() * 20, // Random wind speed between 0-20
	}

	ctx.JSON(http.StatusOK, weather)
}
