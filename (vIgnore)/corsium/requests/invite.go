package requests

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/charmbracelet/log"
	"github.com/gorilla/websocket"
	"github.com/pkg/browser"
)

func Invite(w http.ResponseWriter, r *http.Request, upgrader websocket.Upgrader) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error("Couldn't change to WebSocket", "err", err)
		return
	}

	conn.WriteJSON(map[string]any{
		"cmd": "DISPATCH",
		"data": map[string]any{
			"v": "1",
			"config": map[string]any{
				"cdn_host":     "cdn.discordapp.com",
				"api_endpoint": "//discord.com/api",
				"environment":  "production",
			},
			"evt":   "READY",
			"nonce": nil,
		},
		"evt":   "READY",
		"nonce": nil,
	})

	_, msg, err := conn.ReadMessage()
	if err != nil {
		log.Error("Couldn't read invite message", "err", err)
		return
	}

	err = conn.WriteMessage(websocket.TextMessage, msg)
	if err != nil {
		log.Error("Couldn't reply to invite message", "err", err)
		return
	}

	inviteData := struct {
		Command string `json:"cmd"`
		Args    struct {
			Code string `json:"code"`
		} `json:"args"`
	}{}

	err = json.Unmarshal(msg, &inviteData)
	if err != nil {
		log.Error("Couldn't parse invite message", "err", err)
		return
	}

	browser.Stdout = io.Discard
	browser.Stderr = io.Discard

	if inviteData.Command == "INVITE_BROWSER" {
		log.Info("Received guild invite", "inviteCode", inviteData.Args.Code)

		// FIXME: Use Vercel
		url := "http://87.152.162.129:5173/joinGuild/" + inviteData.Args.Code
		browser.OpenURL(url)
		log.Info("Opening browser", "url", url)
	}

	err = conn.Close()
	if err != nil {
		log.Error("Couldn't close connection", "err", err)
		return
	}
}
