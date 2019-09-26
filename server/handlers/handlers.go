package handlers

import (
	"net/http"
)

func ListTasks(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("ListTasks.."))
}

func GetTask(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("GetTask.."))
}

func CreateTask(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("CreateTask.."))
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("UpdateTask.."))
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("DeleteTask.."))
}