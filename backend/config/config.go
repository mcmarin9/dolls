// Package config manages application configuration
package config

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

// Config holds all application configuration
type Config struct {
	// Database
	DBHost     string
	DBUser     string
	DBPassword string
	DBName     string
	DBCharset  string

	// Server
	ServerHost string
	ServerPort string
	Debug      bool

	// CORS
	CORSOrigins []string

	// File Upload
	UploadFolder      string
	AllowedExtensions []string
	MaxFileSize       int64
	ImageMaxWidth     int
	ImageMaxHeight    int
	ImageQuality      int

	// Security
	MasterKey string
}

var AppConfig *Config

// Load reads configuration from environment variables
func Load() *Config {
	// Load .env file if exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	config := &Config{
		// Database defaults
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBUser:     getEnv("DB_USER", "root"),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBName:     getEnv("DB_NAME", "dolls_db"),
		DBCharset:  "utf8mb4",

		// Server defaults
		ServerHost: getEnv("SERVER_HOST", "localhost"),
		ServerPort: getEnv("SERVER_PORT", "5000"),
		Debug:      getEnvBool("DEBUG", true),

		// CORS
		CORSOrigins: strings.Split(getEnv("CORS_ORIGINS", "http://localhost:5173"), ","),

		// File upload defaults
		UploadFolder:      getEnv("UPLOAD_FOLDER", "./uploads"),
		AllowedExtensions: []string{"png", "jpg", "jpeg", "gif"},
		MaxFileSize:       16 * 1024 * 1024, // 16MB
		ImageMaxWidth:     800,
		ImageMaxHeight:    800,
		ImageQuality:      85,

		// Security
		MasterKey: getEnv("MASTER_KEY", "dev-key-change-me"),
	}

	AppConfig = config
	return config
}

// getEnv gets environment variable or returns default
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvBool gets boolean environment variable
func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		boolVal, err := strconv.ParseBool(value)
		if err != nil {
			return defaultValue
		}
		return boolVal
	}
	return defaultValue
}
