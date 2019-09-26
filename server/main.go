package main

import (
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/lfbos/go-todo/server/handlers"
	"log"
	"net/http"
)

func main() {
	router := chi.NewRouter()

	// A good base middleware stack
	router.Use(middleware.Logger)

	router.Route("/api/task", func(r chi.Router) {
		r.Get("/", handlers.ListTasks)
		r.Post("/", handlers.CreateTask)

		r.Route("/{id}", func(r chi.Router) {
			r.Get("/", handlers.GetTask)
			r.Patch("/", handlers.UpdateTask)
			r.Delete("/", handlers.DeleteTask)
		})
	})

	fmt.Println("Starting server on the port 3333...")

	log.Fatal(http.ListenAndServe(":3333", router))
}
