package main

import (
	"crypto/sha256"
	"encoding/base64"
	"io"
	"os"
	"strings"
	"time"

	"github.com/charmbracelet/log"
	"github.com/ncruces/zenity"
	"github.com/pkg/browser"
)

func main() {
	log.SetReportCaller(true)

	browser.Stderr = io.Discard
	browser.Stdout = io.Discard

	log.Info("You're ready to go! 🎉")

	currentTime := time.Now()
	nextHour := time.Date(currentTime.Year(), currentTime.Month(), currentTime.Day(), currentTime.Hour()+1, 0, 0, 0, currentTime.Location())

	durationUntilNextHour := nextHour.Sub(currentTime)

	if durationUntilNextHour <= 5*time.Minute {
		message := "Hash would be valid for less than five minutes. Try again in a few minutes."
		zenity.Error(message)
		log.Fatal(message)
	}

	user, pass := getUser(zenity.Username(), zenity.Title("Use developer hash"), zenity.ExtraButton("Acquire"), zenity.OKLabel("Use"), zenity.CancelLabel("Quit"))

	hash := sha256.Sum256([]byte(user + pass))
	hashString := strings.Replace(base64.URLEncoding.EncodeToString(hash[:]), "=", "", -1)
	log.Info("Calculated base hash", "hash", hashString)

	hashTime := time.Now().UTC().Format("2006010215")
	log.Info("Hash time", "hashTime", hashTime)

	preFinalHash := sha256.Sum256([]byte(hashString + strings.Join(strings.Split(hashTime, ""), "fuck you mr hacker")))
	finalHash := strings.Replace(base64.URLEncoding.EncodeToString(preFinalHash[:]), "=", "", -1)

	log.Info("Created", "hash", finalHash)
	browser.OpenURL("http://87.152.162.129:5173/dev/codes/" + finalHash)
}

func getUser(options ...zenity.Option) (user string, pass string) {
	user, pass, err := zenity.Password(options...)
	if err != nil {
		switch err {
		case zenity.ErrCanceled:
			os.Exit(0)
		case zenity.ErrExtraButton:
			browser.OpenURL("http://87.152.162.129:5173/dev/codes")
			time.Sleep(2 * time.Second)
			return getUser(options...)
		default:
			log.Fatal(err)
		}
	}
	return user, pass
}