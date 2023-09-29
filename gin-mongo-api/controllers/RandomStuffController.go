package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetRandomQuote() gin.HandlerFunc {
	return func(c *gin.Context) {
		response, err := http.Get("https://type.fit/api/quotes")
		if err != nil {
			log.Println(err)
			c.Status(http.StatusServiceUnavailable)
			return
		}

		defer response.Body.Close()

		if response.StatusCode != http.StatusOK {
			c.Status(http.StatusServiceUnavailable)
			return
		}

		// TODO:
		// use a proper struct type in your real code
		// the empty interface is just for demonstration
		var v interface{}
		json.NewDecoder(response.Body).Decode(&v)

		c.JSON(http.StatusOK, v)
	}
}
