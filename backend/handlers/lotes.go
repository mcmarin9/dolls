// Package handlers provides HTTP request handlers
package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/mcmarin9/dolls/database"
	"github.com/mcmarin9/dolls/models"
	"github.com/mcmarin9/dolls/utils"
)

// GetLotes returns all lotes with their dolls
func GetLotes(w http.ResponseWriter, r *http.Request) {
	query := `
		SELECT 
			l.id, l.nombre, l.tipo, l.precio_total, l.created_at,
			GROUP_CONCAT(d.id) as doll_ids,
			GROUP_CONCAT(d.nombre) as doll_nombres
		FROM lotes l
		LEFT JOIN lote_doll ld ON l.id = ld.lote_id
		LEFT JOIN dolls d ON ld.doll_id = d.id
		GROUP BY l.id
		ORDER BY l.created_at DESC
	`

	rows, err := database.ExecuteQuery(query)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al obtener lotes")
		return
	}
	defer rows.Close()

	type LoteWithDolls struct {
		models.Lote
		Dolls []map[string]interface{} `json:"dolls"`
	}

	var lotes []LoteWithDolls
	for rows.Next() {
		var lote LoteWithDolls
		var dollIDs, dollNombres sql.NullString

		err := rows.Scan(
			&lote.ID, &lote.Nombre, &lote.Tipo, &lote.PrecioTotal, &lote.CreatedAt,
			&dollIDs, &dollNombres,
		)
		if err != nil {
			continue
		}

		// Process dolls
		if dollIDs.Valid && dollNombres.Valid {
			ids := strings.Split(dollIDs.String, ",")
			nombres := strings.Split(dollNombres.String, ",")
			for i := range ids {
				if i < len(nombres) {
					id, _ := strconv.Atoi(ids[i])
					lote.Dolls = append(lote.Dolls, map[string]interface{}{
						"id":     id,
						"nombre": nombres[i],
					})
				}
			}
		} else {
			lote.Dolls = []map[string]interface{}{}
		}

		lotes = append(lotes, lote)
	}

	respondWithJSON(w, http.StatusOK, lotes)
}

// GetLote returns a single lote by ID
func GetLote(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	query := "SELECT id, nombre, tipo, precio_total, created_at FROM lotes WHERE id = ?"

	type LoteWithDolls struct {
		models.Lote
		Dolls []models.Doll `json:"dolls"`
	}

	var lote LoteWithDolls
	err = database.ExecuteQueryRow(query, id).Scan(
		&lote.ID, &lote.Nombre, &lote.Tipo, &lote.PrecioTotal, &lote.CreatedAt,
	)
	if err == sql.ErrNoRows {
		respondWithError(w, http.StatusNotFound, "Lote no encontrado")
		return
	}
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al obtener lote")
		return
	}

	// Get dolls for this lote
	dollQuery := `
		SELECT d.*
		FROM dolls d
		INNER JOIN lote_doll ld ON d.id = ld.doll_id
		WHERE ld.lote_id = ?
	`
	dollRows, err := database.ExecuteQuery(dollQuery, id)
	if err == nil {
		defer dollRows.Close()
		for dollRows.Next() {
			var doll models.Doll
			err := dollRows.Scan(
				&doll.ID, &doll.Nombre, &doll.MarcaID, &doll.FabricanteID,
				&doll.Modelo, &doll.Personaje, &doll.Anyo, &doll.Estado,
				&doll.PrecioCompra, &doll.PrecioVenta, &doll.Comentarios, &doll.Imagen,
				&doll.CreatedAt,
			)
			if err == nil {
				lote.Dolls = append(lote.Dolls, doll)
			}
		}
	}

	respondWithJSON(w, http.StatusOK, lote)
}

// AddLote creates a new lote
func AddLote(w http.ResponseWriter, r *http.Request) {
	var input models.LoteInput
	if err := parseJSONBody(r, &input); err != nil {
		respondWithError(w, http.StatusBadRequest, "Datos inválidos")
		return
	}

	// Validate input
	if err := utils.ValidateLoteInput(input.Nombre); err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Normalize tipo
	tipo := strings.ToLower(strings.TrimSpace(input.Tipo))
	if tipo == "" {
		tipo = "compra"
	}
	if tipo != "compra" && tipo != "venta" {
		respondWithError(w, http.StatusBadRequest, "tipo debe ser 'compra' o 'venta'")
		return
	}

	// Precio total opcional
	var precioTotal interface{}
	if input.PrecioTotal != nil {
		precioTotal = *input.PrecioTotal
	} else {
		precioTotal = nil
	}

	// Insert lote
	insertQuery := "INSERT INTO lotes (nombre, tipo, precio_total) VALUES (?, ?, ?)"
	result, err := database.ExecuteUpdate(insertQuery, input.Nombre, tipo, precioTotal)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al crear lote")
		return
	}

	loteID, _ := result.LastInsertId()

	// Add doll associations
	for _, dollID := range input.DollIDs {
		database.ExecuteUpdate("INSERT INTO lote_doll (lote_id, doll_id) VALUES (?, ?)", loteID, dollID)
	}

	respondWithJSON(w, http.StatusCreated, models.SuccessResponse{
		Message: "Lote creado exitosamente",
		Data:    map[string]int64{"id": loteID},
	})
}

// UpdateLote updates an existing lote
func UpdateLote(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	var input models.LoteInput
	if err := parseJSONBody(r, &input); err != nil {
		respondWithError(w, http.StatusBadRequest, "Datos inválidos")
		return
	}

	// Validate input
	if err := utils.ValidateLoteInput(input.Nombre); err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Normalize tipo
	tipo := strings.ToLower(strings.TrimSpace(input.Tipo))
	if tipo == "" {
		tipo = "compra"
	}
	if tipo != "compra" && tipo != "venta" {
		respondWithError(w, http.StatusBadRequest, "tipo debe ser 'compra' o 'venta'")
		return
	}

	// Precio total opcional
	var precioTotal interface{}
	if input.PrecioTotal != nil {
		precioTotal = *input.PrecioTotal
	} else {
		precioTotal = nil
	}

	// Update lote
	updateQuery := "UPDATE lotes SET nombre = ?, tipo = ?, precio_total = ? WHERE id = ?"
	_, err = database.ExecuteUpdate(updateQuery, input.Nombre, tipo, precioTotal, id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al actualizar lote")
		return
	}

	// Update doll associations
	database.ExecuteUpdate("DELETE FROM lote_doll WHERE lote_id = ?", id)
	for _, dollID := range input.DollIDs {
		database.ExecuteUpdate("INSERT INTO lote_doll (lote_id, doll_id) VALUES (?, ?)", id, dollID)
	}

	respondWithJSON(w, http.StatusOK, models.SuccessResponse{
		Message: "Lote actualizado exitosamente",
	})
}

// DeleteLote deletes a lote
func DeleteLote(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	// Delete from lote_doll first
	database.ExecuteUpdate("DELETE FROM lote_doll WHERE lote_id = ?", id)

	// Delete lote
	result, err := database.ExecuteUpdate("DELETE FROM lotes WHERE id = ?", id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al eliminar lote")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		respondWithError(w, http.StatusNotFound, "Lote no encontrado")
		return
	}

	respondWithJSON(w, http.StatusOK, models.SuccessResponse{
		Message: "Lote eliminado exitosamente",
	})
}
