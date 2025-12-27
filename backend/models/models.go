// Package models defines data structures
package models

import (
	"database/sql"
	"encoding/json"
	"time"
)

// Doll represents a doll in the collection
type Doll struct {
	ID           int             `json:"id"`
	Nombre       string          `json:"nombre"`
	MarcaID      int             `json:"marca_id"`
	FabricanteID sql.NullInt64   `json:"fabricante_id"`
	Modelo       sql.NullString  `json:"modelo"`
	Personaje    sql.NullString  `json:"personaje"`
	Anyo         sql.NullInt64   `json:"anyo"`
	Estado       string          `json:"estado"`
	PrecioCompra sql.NullFloat64 `json:"precio_compra"`
	PrecioVenta  sql.NullFloat64 `json:"precio_venta"`
	Comentarios  sql.NullString  `json:"comentarios"`
	Imagen       sql.NullString  `json:"imagen"`
	CreatedAt    time.Time       `json:"created_at"`

	// Joined fields
	MarcaNombre      sql.NullString `json:"marca_nombre"`
	FabricanteNombre sql.NullString `json:"fabricante_nombre"`
	Lotes            []Lote         `json:"lotes"`
}

// DollInput represents input data for creating/updating a doll
type DollInput struct {
	Nombre       string   `json:"nombre"`
	MarcaID      int      `json:"marca_id"`
	FabricanteID *int     `json:"fabricante_id"`
	Modelo       *string  `json:"modelo"`
	Personaje    *string  `json:"personaje"`
	Anyo         *int     `json:"anyo"`
	Estado       string   `json:"estado"`
	PrecioCompra *float64 `json:"precio_compra"`
	PrecioVenta  *float64 `json:"precio_venta"`
	Comentarios  *string  `json:"comentarios"`
	Imagen       *string  `json:"imagen"`
	LoteIDs      []int    `json:"lote_ids"`
}

// Marca represents a brand
type Marca struct {
	ID        int       `json:"id"`
	Nombre    string    `json:"nombre"`
	CreatedAt time.Time `json:"created_at"`
}

// Fabricante represents a manufacturer
type Fabricante struct {
	ID        int       `json:"id"`
	Nombre    string    `json:"nombre"`
	CreatedAt time.Time `json:"created_at"`
}

// Lote represents a batch/lot
type Lote struct {
	ID          int             `json:"id"`
	Nombre      string          `json:"nombre"`
	Tipo        string          `json:"tipo"`
	PrecioTotal sql.NullFloat64 `json:"precio_total"`
	CreatedAt   time.Time       `json:"created_at"`
}

// LoteInput represents input data for creating/updating a lote
type LoteInput struct {
	Nombre      string   `json:"nombre"`
	Tipo        string   `json:"tipo"`
	PrecioTotal *float64 `json:"precio_total"`
	DollIDs     []int    `json:"doll_ids"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}

// SuccessResponse represents a success response
type SuccessResponse struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// MarshalJSON customizes Doll JSON serialization to handle sql.Null types
func (d Doll) MarshalJSON() ([]byte, error) {
	type Alias Doll
	return json.Marshal(&struct {
		FabricanteID     interface{} `json:"fabricante_id"`
		Modelo           interface{} `json:"modelo"`
		Personaje        interface{} `json:"personaje"`
		Anyo             interface{} `json:"anyo"`
		PrecioCompra     interface{} `json:"precio_compra"`
		PrecioVenta      interface{} `json:"precio_venta"`
		Comentarios      interface{} `json:"comentarios"`
		Imagen           interface{} `json:"imagen"`
		MarcaNombre      interface{} `json:"marca_nombre"`
		FabricanteNombre interface{} `json:"fabricante_nombre"`
		*Alias
	}{
		FabricanteID:     nullInt64Value(d.FabricanteID),
		Modelo:           nullStringValue(d.Modelo),
		Personaje:        nullStringValue(d.Personaje),
		Anyo:             nullInt64Value(d.Anyo),
		PrecioCompra:     nullFloat64Value(d.PrecioCompra),
		PrecioVenta:      nullFloat64Value(d.PrecioVenta),
		Comentarios:      nullStringValue(d.Comentarios),
		Imagen:           nullStringValue(d.Imagen),
		MarcaNombre:      nullStringValue(d.MarcaNombre),
		FabricanteNombre: nullStringValue(d.FabricanteNombre),
		Alias:            (*Alias)(&d),
	})
}

// MarshalJSON customizes Lote JSON serialization
func (l Lote) MarshalJSON() ([]byte, error) {
	type Alias Lote
	return json.Marshal(&struct {
		PrecioTotal interface{} `json:"precio_total"`
		*Alias
	}{
		PrecioTotal: nullFloat64Value(l.PrecioTotal),
		Alias:       (*Alias)(&l),
	})
}

// Helper functions for null value serialization
func nullInt64Value(ni sql.NullInt64) interface{} {
	if ni.Valid {
		return ni.Int64
	}
	return nil
}

func nullStringValue(ns sql.NullString) interface{} {
	if ns.Valid {
		return ns.String
	}
	return nil
}

func nullFloat64Value(nf sql.NullFloat64) interface{} {
	if nf.Valid {
		return nf.Float64
	}
	return nil
}
