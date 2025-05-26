package handlers

import (
	"net/http"

	"math/rand"

	"github.com/gin-gonic/gin"
)

type Weather struct {
	Temperature   int     `json:"temperature"`
	Cloudiness    int     `json:"cloudiness"`
	Humidity    int       `json:"humidity"`
	Precipitation bool    `json:"precipitation"`
	WindSpeed     int     `json:"wind_speed"`
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
	time := ctx.Query("time")

	// Use latitude and longitude to seed the random generator.
	seed := int64(0)
	for _, char := range lat + lon + time {
		seed += int64(char)
	}
	r := rand.New(rand.NewSource(seed))

	weather := Weather{
		Temperature:   r.Intn(6) + 70,  // Random temp between 70-75
		Cloudiness:    r.Intn(11) + 50,      // Random cloudiness percentage (50-60)
		Humidity:     r.Intn(11) + 70,      // Random cloudiness percentage (70-80)
		Precipitation: r.Intn(2) == 1,   // Random true/false for precipitation
		WindSpeed:     r.Intn(11) + 15, // Random wind speed between 15-25mph
	}

	ctx.JSON(http.StatusOK, weather)
}
