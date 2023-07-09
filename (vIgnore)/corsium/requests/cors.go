package requests

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"time"
	"tizu/deezchords/corsium/magic"

	"github.com/charmbracelet/log"
	"github.com/gorilla/websocket"
)

func CrossOrigin(w http.ResponseWriter, r *http.Request, upgrader websocket.Upgrader) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error("Couldn't change to WebSocket", "err", err)
		return
	}

	referenceToken := magic.RandomCode()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Error("Couldn't read message", "err", err, "reference", referenceToken)
			break
		}

		data := struct {
			Method  string            `json:"method"`
			Url     string            `json:"url"`
			Params  map[string]string `json:"params"`
			Data    string            `json:"data"`
			Headers map[string]string `json:"headers"`
			MaxReq  int               `json:"maxReq"`
		}{}
		err = json.Unmarshal(msg, &data)
		if err != nil {
			log.Error("Couldn't parse JSON", "err", err, "reference", referenceToken)
			break
		}

		for !magic.AllowRequests || magic.RequestsThisSecond >= data.MaxReq {
			time.Sleep(1 * time.Second)
		}
		log.Info("Serving over CORSium", "method", data.Method, "url", data.Url, "context", r.URL.Query().Get("c"), "reference", referenceToken)
		magic.RequestsThisSecond++

		if data.Method == "WS" {
			// TODO
			break
		}

		req, err := http.NewRequest(data.Method, data.Url, bytes.NewBufferString(data.Data))
		if err != nil {
			log.Error("Couldn't create request", "err", err, "reference", referenceToken)
			break
		}

		for key, val := range data.Headers {
			req.Header.Set(key, val)
		}

		queryValues := req.URL.Query()
		for key, val := range data.Params {
			queryValues.Add(key, val)
		}
		req.URL.RawQuery = queryValues.Encode()

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			log.Error("Couldn't send request", "err", err, "reference", referenceToken)
			break
		}

		returnData := struct {
			Status  int               `json:"status"`
			Data    string            `json:"data"`
			Headers map[string]string `json:"headers"`
		}{}

		returnData.Status = resp.StatusCode
		if resp.StatusCode >= 400 {
			log.Warn("Request failed", "reference", referenceToken)
		}

		returnedData, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Error("Couldn't read response", "err", err, "reference", referenceToken)
			break
		}
		returnData.Data = string(returnedData)

		returnData.Headers = make(map[string]string)
		for key, values := range resp.Header {
			returnData.Headers[key] = strings.Join(values, ", ")
		}

		if resp.StatusCode == 429 {
			magic.AllowRequests = false
			log.Warn("Too many requests", "reference", referenceToken, "maxReq", data.MaxReq, "result", returnData.Data)
			go func ()  {
				time.Sleep(1 * time.Second)
				magic.AllowRequests = true
			}()
		}

		conn.WriteJSON(returnData)
		break
	}

	err = conn.Close()
	if err != nil {
		log.Error("Couldn't close connection", "err", err, "reference", referenceToken)
		return
	}
}
