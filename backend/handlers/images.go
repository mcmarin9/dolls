// Package handlers provides HTTP request handlers
package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/mcmarin9/dolls/config"
)

// ServeImage serves an image file
func ServeImage(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	filename := vars["filename"]

	// Security: prevent directory traversal
	filename = filepath.Base(filename)

	filePath := filepath.Join(config.AppConfig.UploadFolder, filename)

	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.NotFound(w, r)
		return
	}

	// Serve the file
	http.ServeFile(w, r, filePath)
}

// parseJSONBody is a helper to parse JSON request bodies
func parseJSONBody(r *http.Request, v interface{}) error {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	return json.Unmarshal(body, v)
}
