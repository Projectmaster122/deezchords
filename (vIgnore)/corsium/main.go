package main

import (
	"net/http"
	"os"

	"fyne.io/systray"
	"fyne.io/systray/example/icon"
	"github.com/charmbracelet/log"
	"github.com/gorilla/websocket"
	"github.com/ncruces/zenity"

	"tizu/deezchords/corsium/requests"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	log.SetReportCaller(true)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		requests.Invite(w, r, upgrader)
	})
	// ---
	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		requests.Ping(w, r, upgrader)
	})
	http.HandleFunc("/access", func(w http.ResponseWriter, r *http.Request) {
		requests.Access(w, r, upgrader)
	})
	http.HandleFunc("/codeValid", func(w http.ResponseWriter, r *http.Request) {
		requests.Access(w, r, upgrader)
	})

	go systray.Run(func() {
		systray.SetIcon(icon.Data)
		systray.SetTitle("CORSium")
		systray.SetTooltip("The official Deez Chords! proxy")

		mQuit := systray.AddMenuItem("Quit", "Quit CORSium completely")
		mQuit.SetIcon(icon.Data)

		mCode := systray.AddMenuItem("Active codes", "View active codes")
		mCode.SetIcon(icon.Data)

		log.Info("Setting up sys tray")

		go func() {
			for {
				select {
				case <-mQuit.ClickedCh:
					os.Exit(0)
				case <-mCode.ClickedCh:
					codes := []string{}
					for _, v := range requests.ValidCodes {
						codes = append(codes, v.Code)
					}

					if len(codes) <= 0 {
						zenity.Error("No active codes")
						return
					}
					zenity.List("Active codes", codes, zenity.Title("Active codes"), zenity.InfoIcon, zenity.OKLabel("Revoke"), zenity.CancelLabel("Close"), zenity.DisallowEmpty())
				}
			}
		}()
	}, func() {
		log.Info("Cleaning up sys tray")
	})

	log.Info("You're ready to go! 🎉")
	err := http.ListenAndServe(":6463", nil)
	if err != nil {
		log.Error("Couldn't listen on port 6463", "err", err)
	}
}
