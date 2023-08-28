package main

import (
	"os"

	"gin-mongo-api/configs"
	middleware "gin-mongo-api/middleware"

	"gin-mongo-api/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "6000"
	}

	router := gin.Default()

	//run database
	configs.ConnectDB()

	routes.UserRoutes(router)
	routes.JournalOpenRoutes(router)

	router.Use(middleware.Authentication())
	// Auth routes
	routes.JournalRoutes(router)

	router.Run("localhost:" + port)
}
