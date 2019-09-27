package data

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/jwtauth"
	"github.com/lfbos/go-todo/server/models"
	"github.com/lfbos/go-todo/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/x/bsonx"
	"io"
	"log"
	"os"
)

const connectionString = "mongodb://localhost:27017"
const dbName = "test"
const collName = "todos"
const collUserName = "users"

var collection *mongo.Collection
var userCollection *mongo.Collection

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
	userCollection = client.Database(dbName).Collection(collUserName)

	userCollection.Indexes().CreateOne(
		context.Background(),
		mongo.IndexModel{
			Keys:    bsonx.Doc{{"email", bsonx.Int32(1)}},
			Options: options.Index().SetUnique(true),
		},
	)

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

	return results
}

func GetTask(task string) (*models.ToDoList, error) {
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}

	var result models.ToDoList
	err := collection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return nil, err
	}

	return &result, nil
}

func CreateTask(body io.ReadCloser) (*models.ToDoList, error) {
	var task models.ToDoList
	err := json.NewDecoder(body).Decode(&task)

	if err != nil {
		return nil, err
	}

	res, err := collection.InsertOne(context.Background(), task)

	if err != nil {
		return nil, err
	}

	var result models.ToDoList
	filter := bson.M{"_id": res.InsertedID}

	err = collection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return nil, err
	}

	return &result, nil
}

func CompleteTask(task string) (*models.ToDoList, error) {
	update := bson.M{"$set": bson.M{"status": true}}

	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}

	_, err := collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return nil, err
	}

	var result models.ToDoList
	err = collection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return nil, err
	}

	return &result, nil
}

func UndoTask(task string) (*models.ToDoList, error) {
	update := bson.M{"$set": bson.M{"status": false}}

	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}

	_, err := collection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return nil, err
	}

	var result models.ToDoList
	err = collection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return nil, err
	}

	return &result, nil
}

func DeleteTask(task string) (*models.ToDoList, error) {
	id, _ := primitive.ObjectIDFromHex(task)
	filter := bson.M{"_id": id}

	var result models.ToDoList
	err := collection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return nil, err
	}

	_, err = collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return nil, err
	}

	return &result, nil
}

func GetUser(user string) error {
	id, _ := primitive.ObjectIDFromHex(user)
	filter := bson.M{"_id": id}
	err := userCollection.FindOne(context.Background(), filter).Decode(&models.User{})

	if err != nil {
		return err
	}

	return nil
}

func GetUserByCredentials(body io.ReadCloser) (*models.UserRegister, error) {
	var loginUser models.LoginUser
	var user models.User
	err := json.NewDecoder(body).Decode(&loginUser)

	filter := bson.M{"email": loginUser.Email}

	if err != nil {
		return nil, err
	}

	err = userCollection.FindOne(context.Background(), filter).Decode(&user)

	if err != nil {
		return nil, err
	}

	if !utils.ComparePassword(user.Password, []byte(loginUser.Password)) {
		return nil, fmt.Errorf("Invalid password")
	}

	secretKey := os.Getenv("SECRET_KEY")

	if len(secretKey) == 0 {
		secretKey = "mySecretKeyAuthenticator"
	}

	tokenAuth := jwtauth.New("HS256", []byte(secretKey), nil)

	claims := jwt.MapClaims{"_id": user.ID, "name": user.Name, "lastName": user.LastName, "email": user.Email}

	_, tokenString, _ := tokenAuth.Encode(claims)

	registerUser := models.UserRegister{
		Email:    user.Email,
		Name:     user.Name,
		LastName: user.LastName,
		Token:    tokenString,
	}

	return &registerUser, nil
}

func CreateUser(body io.ReadCloser) (*models.UserRegister, error) {
	var user models.User
	err := json.NewDecoder(body).Decode(&user)

	if err != nil {
		fmt.Println(err)
	}

	secretKey := os.Getenv("SECRET_KEY")

	if len(secretKey) == 0 {
		secretKey = "mySecretKeyAuthenticator"
	}

	tokenAuth := jwtauth.New("HS256", []byte(secretKey), nil)

	user.Password = utils.HashAndSalt([]byte(user.Password))

	res, err := userCollection.InsertOne(context.Background(), user)

	if err != nil {
		return nil, err
	}

	user.ID = res.InsertedID.(primitive.ObjectID)

	claims := jwt.MapClaims{"_id": user.ID, "name": user.Name, "lastName": user.LastName, "email": user.Email}

	_, tokenString, _ := tokenAuth.Encode(claims)

	registerUser := models.UserRegister{
		Email:    user.Email,
		Name:     user.Name,
		LastName: user.LastName,
		Token:    tokenString,
	}

	return &registerUser, nil
}
