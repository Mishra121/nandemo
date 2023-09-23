package controllers

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"strings"

	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	// "github.com/go-playground/validator/v10"

	"gin-mongo-api/configs"
	helper "gin-mongo-api/helpers"
	"gin-mongo-api/models"
	"gin-mongo-api/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userAuthCollection *mongo.Collection = configs.GetCollection(configs.DB, "userAuth")

func generateToken() (string, error) {
	tokenBytes := make([]byte, 32)
	_, err := rand.Read(tokenBytes)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(tokenBytes), nil
}

// HashPassword is used to encrypt the password before it is stored in the DB
func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Panic(err)
	}

	return string(bytes)
}

// VerifyPassword checks the input password while verifying it with the passward in the DB.
func VerifyPassword(userPassword string, providedPassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(providedPassword), []byte(userPassword))
	check := true
	msg := ""

	if err != nil {
		msg = fmt.Sprintf("login or passowrd is incorrect")
		check = false
	}

	return check, msg
}

// CreateUser is the api used to tget a single user
func SignUp() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var user models.UserModel

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		validationErr := validate.Struct(user)
		if validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}

		count, err := userAuthCollection.CountDocuments(ctx, bson.M{"email": user.Email})
		defer cancel()
		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occured while checking for the email"})
			return
		}

		password := HashPassword(*user.Password)
		user.Password = &password

		count, err = userAuthCollection.CountDocuments(ctx, bson.M{"phone": user.Phone})
		defer cancel()
		if err != nil {
			log.Panic(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occured while checking for the phone number"})
			return
		}

		if count > 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "this email or phone number already exists"})
			return
		}

		user.Created_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		user.ID = primitive.NewObjectID()
		user.User_id = user.ID.Hex()
		token, refreshToken, _ := helper.GenerateAllTokens(*user.Email, *user.First_name, *user.Last_name, user.User_id)
		user.Token = &token
		user.Refresh_token = &refreshToken

		resultInsertionNumber, insertErr := userAuthCollection.InsertOne(ctx, user)
		if insertErr != nil {
			msg := fmt.Sprintf("User item was not created")
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}
		defer cancel()

		c.JSON(http.StatusOK, resultInsertionNumber)

	}
}

// Login is the api used to tget a single user
func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var user models.UserModel
		var foundUser models.UserModel

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		err := userAuthCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&foundUser)
		defer cancel()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "login or passowrd is incorrect"})
			return
		}

		passwordIsValid, msg := VerifyPassword(*user.Password, *foundUser.Password)
		defer cancel()
		if passwordIsValid != true {
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}

		token, refreshToken, _ := helper.GenerateAllTokens(*foundUser.Email, *foundUser.First_name, *foundUser.Last_name, foundUser.User_id)

		helper.UpdateAllTokens(token, refreshToken, foundUser.User_id)

		type respFoundUser struct {
			Fname         string `json:"first_name"`
			Lname         string `json:"last_name"`
			Email         string `json:"email"`
			Phone         string `json:"phone"`
			Token         string `json:"token"`
			Refresh_token string `json:"refresh_token"`
			User_id       string `json:"user_id"`
		}

		responseUser := &respFoundUser{
			Fname:         *foundUser.First_name,
			Lname:         *foundUser.Last_name,
			Email:         *foundUser.Email,
			Phone:         *foundUser.Phone,
			Token:         *foundUser.Token,
			Refresh_token: *foundUser.Refresh_token,
			User_id:       foundUser.User_id,
		}

		c.JSON(http.StatusOK, gin.H{"user_info": responseUser})
	}
}

func ForgotPassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var userCredential models.ForgotPasswordInput
		var foundUser models.UserModel

		defer cancel()

		if err := c.BindJSON(&userCredential); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		message := "You will receive a reset email if user with that email exist"

		err := userAuthCollection.FindOne(ctx, bson.M{"email": userCredential.Email}).Decode(&foundUser)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				c.JSON(http.StatusOK, gin.H{"status": "fail", "message": message})
				return
			}
			c.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": err.Error()})
			return
		}

		// Generate Verification Code
		passwordResetToken, errToken := generateToken()

		if errToken != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
			return
		}

		// Update User in Database
		query := bson.D{{Key: "email", Value: strings.ToLower(userCredential.Email)}}
		update := bson.D{{Key: "$set", Value: bson.D{{Key: "passwordResetToken", Value: passwordResetToken}, {Key: "passwordResetAt", Value: time.Now().Add(time.Minute * 15)}}}}

		result, err := userAuthCollection.UpdateOne(ctx, query, update)
		if err != nil {
			c.JSON(http.StatusForbidden, gin.H{"status": "success", "message": err.Error()})
			return
		}

		if result.MatchedCount == 0 {
			c.JSON(http.StatusBadGateway, gin.H{"status": "success", "message": "There was an error sending email"})
			return
		}

		var firstName, toEmail string
		firstName = *foundUser.First_name
		toEmail = *foundUser.Email

		// ? Send Email
		emailData := utils.EmailData{
			URL:       "http://" + "nandemo/auth/resetpassword/" + passwordResetToken,
			FirstName: firstName,
			Subject:   "Your password reset token (valid for 10min)",
		}

		err = utils.SendEmail(toEmail, &emailData, "resetPassword.html")

		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"status": "success", "message": "There was an error sending email"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "success", "message": message})
	}
}

func ResetPassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		resetToken := c.Params.ByName("resetToken")
		var passwordCredential models.ResetPasswordInput

		defer cancel()

		if err := c.BindJSON(&passwordCredential); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if passwordCredential.Password != passwordCredential.PasswordConfirm {
			c.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Passwords do not match"})
			return
		}

		hashedPassword := HashPassword(passwordCredential.Password)

		// TODO: check token expiry
		// Update User in Database
		query := bson.D{{Key: "passwordResetToken", Value: resetToken}}
		update := bson.D{{Key: "$set", Value: bson.D{{Key: "password", Value: hashedPassword}}}, {Key: "$unset", Value: bson.D{{Key: "passwordResetToken", Value: ""}, {Key: "passwordResetAt", Value: ""}}}}
		result, err := userAuthCollection.UpdateOne(ctx, query, update)
		if err != nil {
			c.JSON(http.StatusForbidden, gin.H{"status": "success", "message": err.Error()})
			return
		}

		if result.MatchedCount == 0 {
			c.JSON(http.StatusBadGateway, gin.H{"status": "success", "message": "Token is invalid or has expired"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Password data updated successfully"})
	}
}
