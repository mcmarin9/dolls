// Package utils provides utility functions
package utils

import (
	"log"

	"github.com/mcmarin9/dolls/config"
)

// Logger provides structured logging
type Logger struct {
	name string
}

// NewLogger creates a new logger instance
func NewLogger(name string) *Logger {
	return &Logger{name: name}
}

// Info logs an info message
func (l *Logger) Info(msg string) {
	log.Printf("[INFO] [%s] %s", l.name, msg)
}

// Error logs an error message
func (l *Logger) Error(msg string, err error) {
	if err != nil {
		log.Printf("[ERROR] [%s] %s: %v", l.name, msg, err)
	} else {
		log.Printf("[ERROR] [%s] %s", l.name, msg)
	}
}

// Debug logs a debug message
func (l *Logger) Debug(msg string) {
	if config.AppConfig.Debug {
		log.Printf("[DEBUG] [%s] %s", l.name, msg)
	}
}

// Warning logs a warning message
func (l *Logger) Warning(msg string) {
	log.Printf("[WARNING] [%s] %s", l.name, msg)
}
