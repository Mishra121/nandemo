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
		port = "8080"
	}

	router := gin.Default()
	router.ForwardedByClientIP = true
	router.SetTrustedProxies([]string{"127.0.0.1", "192.168.1.2", "10.0.0.0/8"})

	//run database
	configs.ConnectDB()

	routes.UserRoutes(router)
	routes.JournalOpenRoutes(router)

	router.Use(middleware.Authentication())
	// Auth routes
	routes.JournalRoutes(router)

	router.Run("localhost:" + port)
}
