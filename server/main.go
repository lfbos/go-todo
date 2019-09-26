package main

import (
	"fmt"
	"github.com/lfbos/go-todo/server/handlers"
	"log"
	"net/http"
)

func main() {
	router := handlers.ToDoListResource{}.Routes()
	fmt.Println("Starting server on the port 8080...")
	log.Fatal(http.ListenAndServe(":8080", router))
}
