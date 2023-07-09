package magic

import (
	"math/rand"
	"time"
)

func RandomCode() string {
	rand.Seed(time.Now().UnixNano())
	chars := "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	code := ""
	for i := 0; i < 8; i++ {
		index := rand.Intn(len(chars))
		code += string(chars[index])
	}
	return code
}

func GetIndex(slice []string, target string) int {
	for i, value := range slice {
		if value == target {
			return i
		}
	}
	return -1 // Item not found
}