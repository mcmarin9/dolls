// Package database handles database connections and operations
package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/mcmarin9/dolls/config"
)

var DB *sql.DB

// Connect establishes a connection to the database
func Connect(cfg *config.Config) error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=%s&parseTime=true",
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBHost,
		cfg.DBName,
		cfg.DBCharset,
	)

	var err error
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("error opening database: %w", err)
	}

	// Set connection pool settings
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(5 * time.Minute)

	// Test the connection
	if err = DB.Ping(); err != nil {
		return fmt.Errorf("error connecting to database: %w", err)
	}

	log.Println("✅ Database connection successful")
	return nil
}

// Close closes the database connection
func Close() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}

// ExecuteQuery executes a query and returns multiple rows
func ExecuteQuery(query string, args ...interface{}) (*sql.Rows, error) {
	log.Printf("Executing query: %s", query)
	return DB.Query(query, args...)
}

// ExecuteQueryRow executes a query and returns a single row
func ExecuteQueryRow(query string, args ...interface{}) *sql.Row {
	log.Printf("Executing query (single row): %s", query)
	return DB.QueryRow(query, args...)
}

// ExecuteUpdate executes an INSERT, UPDATE, or DELETE query
func ExecuteUpdate(query string, args ...interface{}) (sql.Result, error) {
	log.Printf("Executing update: %s", query)
	return DB.Exec(query, args...)
}

// BeginTransaction starts a new transaction
func BeginTransaction() (*sql.Tx, error) {
	return DB.Begin()
}
