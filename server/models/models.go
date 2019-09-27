package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ToDoList struct {
	ID     primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Task   string             `json:"task,omitempty" bson:"task,omitempty"`
	Status bool               `json:"status"`
}

type User struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Email    string             `json:"email,omitempty" bson:"email,omitempty"`
	Name     string             `json:"name,omitempty" bson:"name,omitempty"`
	LastName string             `json:"lastName,omitempty" bson:"lastName,omitempty"`
}