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
		var month = c.DefaultQuery("month", "none")
		var year = c.DefaultQuery("year", "none")

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

		if year != "none" && month != "none" {

			intMonth, err := strconv.Atoi(month)
			if err != nil {
				c.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
				return
			}

			intYear, err := strconv.Atoi(year)
			if err != nil {
				c.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
				return
			}

			startDate := time.Date(intYear, time.Month(intMonth), 1, 0, 0, 0, 0, time.UTC)
			endDate := startDate.AddDate(0, 1, 0).Add(-time.Second)

			startDateP, _ := time.Parse(time.RFC3339, startDate.Format(time.RFC3339))
			endDateP, _ := time.Parse(time.RFC3339, endDate.Format(time.RFC3339))

			filter = bson.D{
				{Key: "$and",
					Value: bson.A{
						bson.D{{Key: "user_id", Value: user_id}},
						bson.M{
							"created_at": bson.M{
								"$gte": startDateP,
								"$lt":  endDateP,
							},
						},
					},
				},
			}
		}

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

func GetAJournal() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		journalId := c.Param("journalId")
		var journal models.Journal
		defer cancel()

		objId, _ := primitive.ObjectIDFromHex(journalId)

		err := journalCollection.FindOne(ctx, bson.M{"_id": objId}).Decode(&journal)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"journal_data": journal})
	}
}

func DeleteAJournal() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		journalId := c.Param("journalId")
		var journal models.Journal
		defer cancel()

		objId, _ := primitive.ObjectIDFromHex(journalId)

		err := journalCollection.FindOne(ctx, bson.M{"_id": objId}).Decode(&journal)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
			return
		}

		curr_user_id, uid_exist := c.Get("uid")

		if uid_exist {
			var user_id string = curr_user_id.(string)
			var journal_uid = journal.User_id

			if user_id != journal_uid {
				c.JSON(http.StatusNotAcceptable, gin.H{"status": "fail", "message": "user did not created the journal"})
				return
			}
		}

		result, err := journalCollection.DeleteOne(ctx, bson.M{"_id": objId})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "fail", "message": err.Error()})
			return
		}

		if result.DeletedCount < 1 {
			c.JSON(http.StatusNotFound, gin.H{"status": "fail", "message": "journal not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "journal deleted successfully"})
	}
}

func EditAJournal() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		journalId := c.Param("journalId")
		var journal models.Journal
		var jsonData models.JournalEditSerializer
		objId, _ := primitive.ObjectIDFromHex(journalId)

		defer cancel()

		if err := c.BindJSON(&jsonData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if validationErr := validate.Struct(&jsonData); validationErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
			return
		}

		err := journalCollection.FindOne(ctx, bson.M{"_id": objId}).Decode(&journal)
		if err != nil {
			c.JSON(http.StatusBadGateway, gin.H{"status": "fail", "message": err.Error()})
			return
		}

		curr_user_id, uid_exist := c.Get("uid")

		if uid_exist {
			var user_id string = curr_user_id.(string)
			var journal_uid = journal.User_id

			if user_id != journal_uid {
				c.JSON(http.StatusNotAcceptable, gin.H{"status": "fail", "message": "user did not created the journal"})
				return
			}
		}

		var title, description, overall_mood, description_style, attachment, journal_type string

		title = *jsonData.Title
		description = *jsonData.Description
		overall_mood = jsonData.Overall_mood
		description_style = jsonData.Description_style
		attachment = jsonData.Attachment
		journal_type = jsonData.Type
		updated_at, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))

		updateData := bson.M{
			"title":             title,
			"description":       description,
			"overall_mood":      overall_mood,
			"description_style": description_style,
			"attachment":        attachment,
			"updated_at":        updated_at,
			"type":              journal_type,
		}

		_, err = journalCollection.UpdateOne(ctx, bson.M{"_id": objId}, bson.M{"$set": updateData})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "fail", "message": err.Error()})
			return
		}

		c.JSON(http.StatusNoContent, gin.H{"message": "journal updated successfully"})
	}
}
