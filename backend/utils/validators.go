// Package utils provides utility functions
package utils

import (
	"fmt"
	"strconv"
)

// ValidationError represents a validation error
type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

// ValidateDollInput validates doll input data
func ValidateDollInput(nombre string, marcaID int) error {
	if nombre == "" {
		return &ValidationError{Field: "nombre", Message: "El nombre es requerido"}
	}

	if len(nombre) > 255 {
		return &ValidationError{Field: "nombre", Message: "El nombre no puede exceder 255 caracteres"}
	}

	if marcaID <= 0 {
		return &ValidationError{Field: "marca_id", Message: "ID de marca inválido"}
	}

	return nil
}

// ValidateLoteInput validates lote input data
func ValidateLoteInput(nombre string) error {
	if nombre == "" {
		return &ValidationError{Field: "nombre", Message: "El nombre es requerido"}
	}

	if len(nombre) > 255 {
		return &ValidationError{Field: "nombre", Message: "El nombre no puede exceder 255 caracteres"}
	}

	return nil
}

// ValidateMarcaInput validates marca input data
func ValidateMarcaInput(nombre string) error {
	if nombre == "" {
		return &ValidationError{Field: "nombre", Message: "El nombre es requerido"}
	}

	if len(nombre) > 255 {
		return &ValidationError{Field: "nombre", Message: "El nombre no puede exceder 255 caracteres"}
	}

	return nil
}

// ParseInt safely parses a string to int
func ParseInt(s string) (int, error) {
	if s == "" {
		return 0, nil
	}
	return strconv.Atoi(s)
}

// ParseFloat safely parses a string to float64
func ParseFloat(s string) (float64, error) {
	if s == "" {
		return 0, nil
	}
	return strconv.ParseFloat(s, 64)
}

// StringPtr returns a pointer to a string
func StringPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

// IntPtr returns a pointer to an int
func IntPtr(i int) *int {
	if i == 0 {
		return nil
	}
	return &i
}

// Float64Ptr returns a pointer to a float64
func Float64Ptr(f float64) *float64 {
	if f == 0 {
		return nil
	}
	return &f
}
