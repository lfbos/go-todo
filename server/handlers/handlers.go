package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth"
	"github.com/lfbos/go-todo/server/data"
	"net/http"
	"os"
)

var tokenAuth *jwtauth.JWTAuth

func init() {
	secretKey := os.Getenv("SECRET_KEY")

	if len(secretKey) == 0 {
		secretKey = "mySecretKeyAuthenticator"
	}

	tokenAuth = jwtauth.New("HS256", []byte(secretKey), nil)

	_, tokenString, _ := tokenAuth.Encode(jwt.MapClaims{"_id": "123", "name": "Luis", "lastName": "Boscan"})
	fmt.Printf("DEBUG: a sample jwt is %s\n\n", tokenString)
}

type ToDoListResource struct{}

func (rs ToDoListResource) ListTasks(w http.ResponseWriter, r *http.Request) {
	tasks := data.GetTasks()

	json.NewEncoder(w).Encode(tasks)
}

func (rs ToDoListResource) GetTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	task, err := data.GetTask(id)

	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func (rs ToDoListResource) CreateTask(w http.ResponseWriter, r *http.Request) {
	task, err := data.CreateTask(r.Body)

	if err != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func (rs ToDoListResource) CompleteTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	task, err := data.CompleteTask(id)

	if err != nil {
		http.Error(w, http.StatusText(500), 500)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func (rs ToDoListResource) UndoTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	task, err := data.UndoTask(id)

	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func (rs ToDoListResource) DeleteTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	task, err := data.DeleteTask(id)

	if err != nil {
		http.Error(w, http.StatusText(404), 404)
		return
	}

	json.NewEncoder(w).Encode(task)
}

func (rs ToDoListResource) LoginUser(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Login User"))
}

func (rs ToDoListResource) SignUpUser(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Sign Up User"))
}

func SettingsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Context-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		next.ServeHTTP(w, r)
	})
}

func CustomAuthenticator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, err := jwtauth.VerifyRequest(tokenAuth, r, jwtauth.TokenFromHeader)
		claims := jwt.MapClaims{}

		jwt.ParseWithClaims(token.Raw, claims, func(token *jwt.Token) (i interface{}, e error) {
			return nil, nil
		})

		if err != nil {
			http.Error(w, http.StatusText(401), 401)
			return
		}

		if token == nil || !token.Valid {
			http.Error(w, http.StatusText(401), 401)
			return
		}

		fmt.Println(claims["_id"])

		err = data.GetUser(claims["_id"].(string))

		if err != nil {
			http.Error(w, http.StatusText(404), 404)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (rs ToDoListResource) Routes() chi.Router {
	router := chi.NewRouter()

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})

	router.Use(middleware.Logger)
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(SettingsMiddleware)
	router.Use(c.Handler)

	router.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(tokenAuth))
		r.Use(CustomAuthenticator)

		r.Route("/api/task", func(r chi.Router) {
			r.Get("/", rs.ListTasks)
			r.Post("/", rs.CreateTask)

			r.Route("/{id}", func(r chi.Router) {
				r.Get("/", rs.GetTask)
				r.Post("/complete", rs.CompleteTask)
				r.Post("/undo", rs.UndoTask)
				r.Delete("/", rs.DeleteTask)
			})
		})
	})

	router.Group(func(r chi.Router) {
		r.Post("/login", rs.LoginUser)
		r.Post("/signup", rs.SignUpUser)
	})

	return router
}
