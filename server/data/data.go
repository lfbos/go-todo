package data

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/lfbos/go-todo/server/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"io"
	"log"
)

const connectionString = "mongodb://localhost:27017"
const dbName = "test"
const collName = "todos"

var collection *mongo.Collection

func init() {

	// Set client options
	clientOptions := options.Client().ApplyURI(connectionString)

	// connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	collection = client.Database(dbName).Collection(collName)

	fmt.Println("Collection instance created!")
}

func GetTasks() []primitive.M {
	cur, err := collection.Find(context.Background(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}

	results := []primitive.M{}
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result)

	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())

	fmt.Println(results)

	return results
}

func GetTask(task string) (models.ToDoList, error) {
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}

	var result models.ToDoList
	err := collection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return models.ToDoList{}, err
	}

	return result, nil
}

func CreateTask(body io.ReadCloser) (models.ToDoList, error) {
	var task models.ToDoList
	err := json.NewDecoder(body).Decode(&task)

	if err != nil {
		return models.ToDoList{}, err
	}

	res, err := collection.InsertOne(context.Background(), task)

	if err != nil {
		return models.ToDoList{}, err
	}

	var result models.ToDoList
	filter := bson.M{"_id": res.InsertedID}

	err = collection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return models.ToDoList{}, err
	}

	return result, nil
}

func CompleteTask(task string) (models.ToDoList, error) {
	update := bson.M{"$set": bson.M{"status": true}}

	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}

	_, err := collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return models.ToDoList{}, err
	}

	var result models.ToDoList
	err = collection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return models.ToDoList{}, err
	}

	return result, nil
}

func UndoTask(task string) (models.ToDoList, error) {
	update := bson.M{"$set": bson.M{"status": false}}

	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}

	_, err := collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return models.ToDoList{}, err
	}

	var result models.ToDoList
	err = collection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return models.ToDoList{}, err
	}

	return result, nil
}

func DeleteTask(task string) (models.ToDoList, error) {
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}

	var result models.ToDoList
	err := collection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return models.ToDoList{}, err
	}

	_, err = collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return models.ToDoList{}, err
	}

	return result, nil
}