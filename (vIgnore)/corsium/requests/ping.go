package requests

import (
	"net/http"

	"github.com/charmbracelet/log"
	"github.com/gorilla/websocket"
)

func Ping(w http.ResponseWriter, r *http.Request, upgrader websocket.Upgrader) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error("Couldn't change to WebSocket", "err", err)
		return
	}

	conn.WriteJSON(map[string]any{
		"cmd": "PING",
		"data": map[string]any{ },
		"evt":   "READY",
		"nonce": nil,
	})

	log.Info("Sent ping on request", "context", r.URL.Query().Get("c"))

	err = conn.Close()
	if err != nil {
		log.Error("Couldn't close connection", "err", err)
		return
	}
}
