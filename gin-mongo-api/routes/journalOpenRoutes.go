package routes

import (
	"gin-mongo-api/controllers"

	"github.com/gin-gonic/gin"
)

func JournalOpenRoutes(router *gin.Engine) {
	router.GET("/journals/:journalId", controllers.GetAJournal())
}
