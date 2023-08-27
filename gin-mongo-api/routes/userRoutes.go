package routes

import (
	controller "gin-mongo-api/controllers"

	"github.com/gin-gonic/gin"
)

// UserRoutes function
func UserRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.POST("/users-auth/signup", controller.SignUp())
	incomingRoutes.POST("/users-auth/login", controller.Login())
}
