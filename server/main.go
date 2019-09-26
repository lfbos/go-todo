package main

import (
	"fmt"
	"github.com/lfbos/go-todo/server/handlers"
	"log"
	"net/http"
)

func main() {
	router := handlers.ToDoListResource{}.Routes()
	fmt.Println("Starting server on the port 3333...")
	log.Fatal(http.ListenAndServe(":3333", router))
}
