package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Journal struct {
	ID                primitive.ObjectID `bson:"_id"`
	Title             *string            `json:"title" validate:"required,min=2,max=100"`
	Description       *string            `json:"description" validate:"required,min=2"`
	Created_at        time.Time          `json:"created_at"`
	Updated_at        time.Time          `json:"updated_at"`
	User_id           string             `json:"user_id"`
	Overall_mood      string             `json:"overall_mood" validate:"required,eq=GOOD|eq=BAD|eq=HAPPY|eq=NONE"`
	Type              string             `json:"type"`
	Description_style string             `json:"description_style"`
	Attachment        string             `json:"attachment"`
}
