package controllers

import (
	"context"
	"fmt"
	"strconv"

	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"gin-mongo-api/configs"
	"gin-mongo-api/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var journalCollection *mongo.Collection = configs.GetCollection(configs.DB, "journal")

func CreateJournal() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var journal models.Journal
		defer cancel()

		if err := c.BindJSON(&journal); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if validationErr := validate.Struct(&journal); validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}

		newJournal := models.Journal{
			ID:                primitive.NewObjectID(),
			Title:             journal.Title,
			Description:       journal.Description,
			User_id:           "",
			Overall_mood:      journal.Overall_mood,
			Type:              journal.Type,
			Description_style: "",
			Attachment:        "",
		}

		newJournal.Created_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
		newJournal.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))

		curr_user_id, uid_exist := c.Get("uid")

		if uid_exist {
			var user_id string = curr_user_id.(string)
			newJournal.User_id = user_id
		}

		resultJournal, err := journalCollection.InsertOne(ctx, newJournal)
		if err != nil {
			msg := fmt.Sprintf("Journal was not created")
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}

		c.JSON(http.StatusOK, resultJournal)
	}
}

func GetAllJournalOfUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var journals []models.Journal

		defer cancel()

		var page = c.DefaultQuery("page", "1")
		var limit = c.DefaultQuery("limit", "10")

		intPage, err := strconv.Atoi(page)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
			return
		}

		intLimit, err := strconv.Atoi(limit)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
			return
		}

		if intPage == 0 {
			intPage = 1
		}

		if intLimit == 0 {
			intLimit = 10
		}

		skip := (intPage - 1) * intLimit

		opt := options.FindOptions{}
		opt.SetLimit(int64(intLimit))
		opt.SetSkip(int64(skip))

		curr_user_id, _ := c.Get("uid")
		var user_id string = curr_user_id.(string)
		filter := bson.D{{Key: "user_id", Value: user_id}}

		results, err := journalCollection.Find(ctx, filter, &opt)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		defer results.Close(ctx)
		for results.Next(ctx) {
			var singleJournal models.Journal
			if err = results.Decode(&singleJournal); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			}

			journals = append(journals, singleJournal)
		}

		c.JSON(http.StatusOK, gin.H{"journals": journals})
	}
}
