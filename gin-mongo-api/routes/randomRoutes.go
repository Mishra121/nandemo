package routes

import (
	"gin-mongo-api/controllers"

	"github.com/gin-gonic/gin"
)

func RandomOpenRoutes(router *gin.Engine) {
	router.GET("/random-quote", controllers.GetRandomQuote())
}
