package utils

import (
	"golang.org/x/crypto/bcrypt"
	"log"
)

func GetPwd(pwd string) []byte  {
	return []byte(pwd)
}

func HashAndSalt(pwd []byte) string  {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}

	return string(hash)
}

func ComparePassword(hashedPwd string, plainPwd []byte) bool {
	byteHash := []byte(hashedPwd)

	err := bcrypt.CompareHashAndPassword(byteHash, plainPwd)
	if err != nil {
		return false
	}

	return true
}