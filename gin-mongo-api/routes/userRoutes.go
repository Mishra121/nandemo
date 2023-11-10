package routes

import (
	controller "gin-mongo-api/controllers"

	"github.com/gin-gonic/gin"
)

// UserRoutes function
func UserRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.POST("/users-auth/signup", controller.SignUp())
	incomingRoutes.POST("/users-auth/login", controller.Login())
	incomingRoutes.POST("/users-auth/refresh-token", controller.RefreshToken())
	incomingRoutes.POST("/users-auth/forgotpassword", controller.ForgotPassword())
	incomingRoutes.PATCH("/users-auth/resetpassword/:resetToken", controller.ResetPassword())
}
