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
	Password string             `json:"password,omitempty" bson:"password,omitempty"`
}

type LoginUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserRegister struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	LastName string `json:"lastName"`
	Token    string `json:"token"`
}
