// Package main is the entry point of the application
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/mcmarin9/dolls/config"
	"github.com/mcmarin9/dolls/database"
	"github.com/mcmarin9/dolls/handlers"
	"github.com/rs/cors"
)

func main() {
	// Load configuration
	cfg := config.Load()
	log.Println("⚙️  Configuration loaded")

	// Connect to database
	if err := database.Connect(cfg); err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Create upload directory if it doesn't exist
	if err := os.MkdirAll(cfg.UploadFolder, 0755); err != nil {
		log.Printf("⚠️  Warning: Could not create upload directory: %v", err)
	}

	// Setup router
	router := mux.NewRouter()

	// Health check
	router.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"online","message":"Backend is running"}`))
	}).Methods("GET")

	// Dolls routes
	router.HandleFunc("/api/dolls", handlers.GetDolls).Methods("GET")
	router.HandleFunc("/api/dolls/{id:[0-9]+}", handlers.GetDoll).Methods("GET")
	router.HandleFunc("/api/dolls", handlers.AddDoll).Methods("POST")
	router.HandleFunc("/api/dolls/{id:[0-9]+}", handlers.UpdateDoll).Methods("PUT")
	router.HandleFunc("/api/dolls/{id:[0-9]+}", handlers.DeleteDoll).Methods("DELETE")

	// Lotes routes
	router.HandleFunc("/api/lotes", handlers.GetLotes).Methods("GET")
	router.HandleFunc("/api/lotes/{id:[0-9]+}", handlers.GetLote).Methods("GET")
	router.HandleFunc("/api/lotes", handlers.AddLote).Methods("POST")
	router.HandleFunc("/api/lotes/{id:[0-9]+}", handlers.UpdateLote).Methods("PUT")
	router.HandleFunc("/api/lotes/{id:[0-9]+}", handlers.DeleteLote).Methods("DELETE")

	// Marcas routes
	router.HandleFunc("/api/marcas", handlers.GetMarcas).Methods("GET")
	router.HandleFunc("/api/marcas", handlers.AddMarca).Methods("POST")
	router.HandleFunc("/api/marcas/{id:[0-9]+}", handlers.UpdateMarca).Methods("PUT")
	router.HandleFunc("/api/marcas/{id:[0-9]+}", handlers.DeleteMarca).Methods("DELETE")

	// Fabricantes routes
	router.HandleFunc("/api/fabricantes", handlers.GetFabricantes).Methods("GET")
	router.HandleFunc("/api/fabricantes/{fabricante_id:[0-9]+}/marcas", handlers.GetMarcasByFabricante).Methods("GET")

	// Image routes
	router.HandleFunc("/uploads/{filename}", handlers.ServeImage).Methods("GET")

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   cfg.CORSOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		ExposedHeaders:   []string{"Content-Range", "X-Content-Range"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	handler := c.Handler(router)

	// Logging middleware
	handler = loggingMiddleware(handler)

	// Server configuration
	addr := fmt.Sprintf("%s:%s", cfg.ServerHost, cfg.ServerPort)
	server := &http.Server{
		Addr:         addr,
		Handler:      handler,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server
	log.Println("=" + string(make([]byte, 60)))
	log.Println("🚀 Dolls Backend Server - Go Edition")
	log.Printf("📍 Server running at http://%s", addr)
	log.Printf("🐛 Debug Mode: %v", cfg.Debug)
	log.Printf("🌐 CORS Origins: %v", cfg.CORSOrigins)
	log.Printf("📁 Upload Folder: %s", cfg.UploadFolder)
	log.Println("=" + string(make([]byte, 60)))

	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("❌ Server failed to start: %v", err)
	}
}

// loggingMiddleware logs all incoming requests
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		// Log request
		log.Printf("➡️  %s %s from %s", r.Method, r.URL.Path, r.RemoteAddr)
		
		// Call next handler
		next.ServeHTTP(w, r)
		
		// Log response time
		duration := time.Since(start)
		log.Printf("⬅️  %s %s completed in %v", r.Method, r.URL.Path, duration)
	})
}
