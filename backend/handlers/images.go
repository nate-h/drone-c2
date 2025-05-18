package handlers

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func GetImage() gin.HandlerFunc {
	return func(c *gin.Context) {
		imageName := c.Param("image_name")
		if imageName == "" {
			log.Println("No image name defined")
			c.String(http.StatusInternalServerError, "No image name defined.")
			return
		}

		ext := filepath.Ext(imageName)[1:]
		if ext != "png" && ext != "jpeg" {
			log.Println("Unsupported image type: ", ext)
			c.String(http.StatusInternalServerError, "Unsupported image type.")
			return
		}

		data, err := os.ReadFile("images/" + imageName)
		if err != nil {
			log.Println("Error reading file:", err)
			c.String(http.StatusInternalServerError, "Could not read the image.")
			return
		}

		c.Data(http.StatusOK, "image/"+ext, data)
	}
}
