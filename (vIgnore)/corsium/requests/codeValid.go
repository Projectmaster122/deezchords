package requests

import (
	"encoding/json"
	"net/http"

	"github.com/charmbracelet/log"
	"github.com/gorilla/websocket"
)

func CodeValid(w http.ResponseWriter, r *http.Request, upgrader websocket.Upgrader) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error("Couldn't change to WebSocket", "err", err)
		return
	}

	_, msg, err := conn.ReadMessage()
	if err != nil {
		log.Error("Couldn't read code validation message", "err", err)
		return
	}

	codeData := struct {
		Data    struct {
			Code string `json:"code"`
		} `json:"data"`
	}{}
	err = json.Unmarshal(msg, &codeData)
	if err != nil {
		log.Error("Couldn't parse JSON", "err", err)
		return
	}

	log.Info("Requested access code validation")
	for {
		valid, timeout := AccessCodeValid(codeData.Data.Code)
		conn.WriteJSON(map[string]any{
			"cmd": "CODE_VALID",
			"data": map[string]any{
				"valid": valid,
				"timeout": timeout,
			},
			"evt":   "READY",
			"nonce": nil,
		})
		if valid {
			break
		}
	}

	err = conn.Close()
	if err != nil {
		log.Error("Couldn't close connection", "err", err)
		return
	}
}
