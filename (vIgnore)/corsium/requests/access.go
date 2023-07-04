package requests

import (
	"strconv"
	"tizu/deezchords/corsium/magic"

	"net/http"
	"time"

	"github.com/charmbracelet/log"
	"github.com/gorilla/websocket"
	"github.com/ncruces/zenity"
)

var ValidCodes []ValidCode

type ValidCode struct {
	Code    string
	Timeout time.Time
}

func Access(w http.ResponseWriter, r *http.Request, upgrader websocket.Upgrader) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error("Couldn't change to WebSocket", "err", err)
		return
	}

	code := magic.RandomCode()
	timeoutMinutes := 5

	conn.WriteJSON(map[string]any{
		"cmd": "ACCESS",
		"data": map[string]any{
			"code": code,
			"time": timeoutMinutes * 60,
		},
		"evt":   "READY",
		"nonce": nil,
	})

	log.Info("Requested access code", "code", code)

	go func() {
		err = zenity.Question("Do you want to grant "+conn.RemoteAddr().String()+" higher access to CORSium? It will automatically expire in "+strconv.Itoa(timeoutMinutes)+" minutes, or you can revoke it from the Deez Chords! CORSium config.",
			zenity.Title("Access code requested"),
			zenity.InfoIcon, zenity.OKLabel("Grant access"), zenity.CancelLabel("Deny"))
		if err != nil {
			switch err {
			case zenity.ErrCanceled:
				log.Warn("Access code requested cancelled")
			case zenity.ErrUnsupported:
				log.Error("Couldn't open zenity window", "err", err)
			}
			return
		}
		err = zenity.Question("Does the code "+code+" match with the one you can see in the Deez Chords! client?",
			zenity.Title("Access code requested"),
			zenity.InfoIcon, zenity.OKLabel("Yes, grant access"), zenity.CancelLabel("No, cancel"))
		if err != nil {
			switch err {
			case zenity.ErrCanceled:
				log.Warn("Access code requested cancelled")
			case zenity.ErrUnsupported:
				log.Error("Couldn't open zenity window", "err", err)
			}
			return
		}

		log.Info("Access granted")
		ValidCodes = append(ValidCodes, ValidCode{Code: code, Timeout: time.Now().Add((time.Duration(timeoutMinutes) + 1) * time.Minute)})
	}()

	err = conn.Close()
	if err != nil {
		log.Error("Couldn't close connection", "err", err)
		return
	}
}

func AccessCodeValid(code string) (bool, time.Time) {
	for _, v := range ValidCodes {
		if v.Timeout.Before(time.Now()) {
			ValidCodes = append(ValidCodes[:len(ValidCodes)-1])
			continue
		}
		if v.Code == code {
			return true, v.Timeout
		}
	}
	return false, time.Time{}
}
