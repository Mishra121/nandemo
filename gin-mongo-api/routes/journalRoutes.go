package routes

import (
	"gin-mongo-api/controllers"

	"github.com/gin-gonic/gin"
)

func JournalRoutes(router *gin.Engine) {
	router.POST("/journal/create", controllers.CreateJournal())
	router.GET("/journals", controllers.GetAllJournalOfUser())
	router.DELETE("/journal/:journalId", controllers.DeleteAJournal())
	router.PUT("/journal/:journalId", controllers.EditAJournal())
}
