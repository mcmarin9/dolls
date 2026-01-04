// Package handlers provides HTTP request handlers
package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"
	"time"

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
			COUNT(DISTINCT d.id) as cantidad_munecas
		FROM lotes l
		LEFT JOIN lote_doll ld ON l.id = ld.lote_id
		LEFT JOIN dolls d ON ld.doll_id = d.id
		GROUP BY l.id, l.nombre, l.tipo, l.precio_total, l.created_at
		ORDER BY l.created_at DESC
	`

	rows, err := database.ExecuteQuery(query)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al obtener lotes")
		return
	}
	defer rows.Close()

	type LoteResponse struct {
		ID              int       `json:"id"`
		Nombre          string    `json:"nombre"`
		Tipo            string    `json:"tipo"`
		PrecioTotal     *float64  `json:"precio_total"`
		CreatedAt       time.Time `json:"created_at"`
		CantidadMunecas int       `json:"cantidad_munecas"`
		PrecioUnitario  *float64  `json:"precio_unitario"`
	}

	var lotes []LoteResponse
	for rows.Next() {
		var lote LoteResponse
		var cantidad int
		var precioTotalDB sql.NullFloat64

		err := rows.Scan(
			&lote.ID, &lote.Nombre, &lote.Tipo, &precioTotalDB, &lote.CreatedAt,
			&cantidad,
		)
		if err != nil {
			continue
		}

		lote.CantidadMunecas = cantidad

		// Convertir sql.NullFloat64 a *float64
		if precioTotalDB.Valid {
			precioTotal := precioTotalDB.Float64
			lote.PrecioTotal = &precioTotal

			// Calcular precio unitario
			if cantidad > 0 {
				precioUnitario := precioTotal / float64(cantidad)
				lote.PrecioUnitario = &precioUnitario
			} else {
				precioUnitario := 0.0
				lote.PrecioUnitario = &precioUnitario
			}
		} else {
			lote.PrecioTotal = nil
			precioUnitario := 0.0
			lote.PrecioUnitario = &precioUnitario
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
		ID          int           `json:"id"`
		Nombre      string        `json:"nombre"`
		Tipo        string        `json:"tipo"`
		PrecioTotal *float64      `json:"precio_total"`
		CreatedAt   time.Time     `json:"created_at"`
		Dolls       []models.Doll `json:"dolls"`
	}

	var lote LoteWithDolls
	var precioTotalDB sql.NullFloat64
	lote.Dolls = []models.Doll{} // Initialize empty slice
	err = database.ExecuteQueryRow(query, id).Scan(
		&lote.ID, &lote.Nombre, &lote.Tipo, &precioTotalDB, &lote.CreatedAt,
	)
	if err == sql.ErrNoRows {
		respondWithError(w, http.StatusNotFound, "Lote no encontrado")
		return
	}
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al obtener lote")
		return
	}

	// Convertir sql.NullFloat64 a *float64
	if precioTotalDB.Valid {
		precioTotal := precioTotalDB.Float64
		lote.PrecioTotal = &precioTotal
	} else {
		lote.PrecioTotal = nil
	}

	// Get dolls for this lote
	dollQuery := `
		SELECT 
			d.id, d.nombre, d.marca_id, d.fabricante_id, d.modelo, d.personaje, 
			d.anyo, d.estado, d.precio_compra, d.precio_venta, d.comentarios, d.imagen, d.created_at,
			m.nombre AS marca_nombre,
			f.nombre AS fabricante_nombre
		FROM dolls d
		LEFT JOIN marca m ON d.marca_id = m.id
		LEFT JOIN fabricantes f ON d.fabricante_id = f.id
		INNER JOIN lote_doll ld ON d.id = ld.doll_id
		WHERE ld.lote_id = ?
	`
	dollRows, err := database.ExecuteQuery(dollQuery, id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al obtener dolls del lote")
		return
	}
	defer dollRows.Close()
	for dollRows.Next() {
		var doll models.Doll
		err := dollRows.Scan(
			&doll.ID, &doll.Nombre, &doll.MarcaID, &doll.FabricanteID,
			&doll.Modelo, &doll.Personaje, &doll.Anyo, &doll.Estado,
			&doll.PrecioCompra, &doll.PrecioVenta, &doll.Comentarios, &doll.Imagen,
			&doll.CreatedAt,
			&doll.MarcaNombre, &doll.FabricanteNombre,
		)
		if err == nil {
			lote.Dolls = append(lote.Dolls, doll)
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

	// Calculate unit price if we have dolls
	var precioUnitario float64
	if input.PrecioTotal != nil && len(input.DollIDs) > 0 {
		precioUnitario = *input.PrecioTotal / float64(len(input.DollIDs))
	}

	// Add doll associations and update prices
	for _, dollID := range input.DollIDs {
		database.ExecuteUpdate("INSERT INTO lote_doll (lote_id, doll_id) VALUES (?, ?)", loteID, dollID)

		// Update doll prices based on lote type
		if tipo == "compra" && input.PrecioTotal != nil && len(input.DollIDs) > 0 {
			database.ExecuteUpdate("UPDATE dolls SET precio_compra = ? WHERE id = ?", precioUnitario, dollID)
		} else if tipo == "venta" && input.PrecioTotal != nil && len(input.DollIDs) > 0 {
			database.ExecuteUpdate("UPDATE dolls SET precio_venta = ?, estado = 'vendida' WHERE id = ?", precioUnitario, dollID)
		}
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

	// Debug: Log received data
	logger.Info("Received update request for lote ID: " + strconv.Itoa(id))
	logger.Info("Number of dolls to associate: " + strconv.Itoa(len(input.DollIDs)))

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

	// Get previously associated dolls to reset their prices if they're being removed
	oldDollsQuery := "SELECT doll_id FROM lote_doll WHERE lote_id = ?"
	oldDollsRows, err := database.ExecuteQuery(oldDollsQuery, id)
	if err == nil {
		defer oldDollsRows.Close()
		var oldDollIDs []int
		for oldDollsRows.Next() {
			var dollID int
			if err := oldDollsRows.Scan(&dollID); err == nil {
				oldDollIDs = append(oldDollIDs, dollID)
			}
		}

		// Reset prices for dolls being removed from this lote
		for _, oldDollID := range oldDollIDs {
			found := false
			for _, newDollID := range input.DollIDs {
				if oldDollID == newDollID {
					found = true
					break
				}
			}
			if !found {
				// Doll is being removed, check if it's in other lotes
				if tipo == "compra" {
					// Check if doll is in another compra lote
					checkQuery := "SELECT COUNT(*) FROM lote_doll ld INNER JOIN lotes l ON ld.lote_id = l.id WHERE ld.doll_id = ? AND l.tipo = 'compra' AND l.id != ?"
					var count int
					database.ExecuteQueryRow(checkQuery, oldDollID, id).Scan(&count)
					if count == 0 {
						database.ExecuteUpdate("UPDATE dolls SET precio_compra = NULL WHERE id = ?", oldDollID)
					}
				} else if tipo == "venta" {
					// Check if doll is in another venta lote
					checkQuery := "SELECT COUNT(*) FROM lote_doll ld INNER JOIN lotes l ON ld.lote_id = l.id WHERE ld.doll_id = ? AND l.tipo = 'venta' AND l.id != ?"
					var count int
					database.ExecuteQueryRow(checkQuery, oldDollID, id).Scan(&count)
					if count == 0 {
						database.ExecuteUpdate("UPDATE dolls SET precio_venta = NULL WHERE id = ?", oldDollID)
					}
				}
			}
		}
	}

	// Update doll associations - ONLY delete associations for THIS lote
	_, err = database.ExecuteUpdate("DELETE FROM lote_doll WHERE lote_id = ?", id)
	if err != nil {
		logger.Error("Error deleting existing lote_doll associations", err)
		respondWithError(w, http.StatusInternalServerError, "Error al actualizar asociaciones de muñecas")
		return
	}

	// Calculate unit price if we have dolls
	var precioUnitario float64
	if input.PrecioTotal != nil && len(input.DollIDs) > 0 {
		precioUnitario = *input.PrecioTotal / float64(len(input.DollIDs))
	}

	// Then, insert new associations and update prices
	logger.Info("Inserting " + strconv.Itoa(len(input.DollIDs)) + " doll associations")
	for i, dollID := range input.DollIDs {
		logger.Info("Inserting doll ID " + strconv.Itoa(dollID) + " (index " + strconv.Itoa(i) + ")")
		_, err = database.ExecuteUpdate("INSERT INTO lote_doll (lote_id, doll_id) VALUES (?, ?)", id, dollID)
		if err != nil {
			logger.Error("Error inserting lote_doll association", err)
			respondWithError(w, http.StatusInternalServerError, "Error al asociar muñecas con el lote")
			return
		}

		// Update doll prices based on lote type
		if tipo == "compra" && input.PrecioTotal != nil && len(input.DollIDs) > 0 {
			database.ExecuteUpdate("UPDATE dolls SET precio_compra = ? WHERE id = ?", precioUnitario, dollID)
		} else if tipo == "venta" && input.PrecioTotal != nil && len(input.DollIDs) > 0 {
			database.ExecuteUpdate("UPDATE dolls SET precio_venta = ?, estado = 'vendida' WHERE id = ?", precioUnitario, dollID)
		}
	}

	logger.Info("Lote updated successfully with " + strconv.Itoa(len(input.DollIDs)) + " dolls")
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

	// Get lote type first
	var tipo string
	err = database.ExecuteQueryRow("SELECT tipo FROM lotes WHERE id = ?", id).Scan(&tipo)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Lote no encontrado")
		return
	}

	// Get dolls associated with this lote to reset their prices
	dollsQuery := "SELECT doll_id FROM lote_doll WHERE lote_id = ?"
	dollsRows, err := database.ExecuteQuery(dollsQuery, id)
	if err == nil {
		defer dollsRows.Close()
		var dollIDs []int
		for dollsRows.Next() {
			var dollID int
			if err := dollsRows.Scan(&dollID); err == nil {
				dollIDs = append(dollIDs, dollID)
			}
		}

		// Reset prices for each doll if they're not in other lotes of the same type
		for _, dollID := range dollIDs {
			if tipo == "compra" {
				// Check if doll is in another compra lote
				checkQuery := "SELECT COUNT(*) FROM lote_doll ld INNER JOIN lotes l ON ld.lote_id = l.id WHERE ld.doll_id = ? AND l.tipo = 'compra' AND l.id != ?"
				var count int
				database.ExecuteQueryRow(checkQuery, dollID, id).Scan(&count)
				if count == 0 {
					database.ExecuteUpdate("UPDATE dolls SET precio_compra = NULL WHERE id = ?", dollID)
				}
			} else if tipo == "venta" {
				// Check if doll is in another venta lote
				checkQuery := "SELECT COUNT(*) FROM lote_doll ld INNER JOIN lotes l ON ld.lote_id = l.id WHERE ld.doll_id = ? AND l.tipo = 'venta' AND l.id != ?"
				var count int
				database.ExecuteQueryRow(checkQuery, dollID, id).Scan(&count)
				if count == 0 {
					database.ExecuteUpdate("UPDATE dolls SET precio_venta = NULL WHERE id = ?", dollID)
				}
			}
		}
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

// GetDollLotes returns all lotes for a specific doll
func GetDollLotes(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	dollId, err := strconv.Atoi(vars["dollId"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID de muñeca inválido")
		return
	}

	query := `
		SELECT 
			l.id, l.nombre, l.tipo, l.precio_total, l.created_at
		FROM lotes l
		INNER JOIN lote_doll ld ON l.id = ld.lote_id
		WHERE ld.doll_id = ?
		ORDER BY l.created_at DESC
	`

	rows, err := database.ExecuteQuery(query, dollId)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al obtener lotes")
		return
	}
	defer rows.Close()

	type LoteResponse struct {
		ID          int       `json:"id"`
		Nombre      string    `json:"nombre"`
		Tipo        string    `json:"tipo"`
		PrecioTotal *float64  `json:"precio_total"`
		CreatedAt   time.Time `json:"created_at"`
	}

	var lotes []LoteResponse
	for rows.Next() {
		var lote LoteResponse
		var precioTotalDB sql.NullFloat64
		err := rows.Scan(&lote.ID, &lote.Nombre, &lote.Tipo, &precioTotalDB, &lote.CreatedAt)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Error al procesar lotes")
			return
		}

		if precioTotalDB.Valid {
			precioTotal := precioTotalDB.Float64
			lote.PrecioTotal = &precioTotal
		} else {
			lote.PrecioTotal = nil
		}

		lotes = append(lotes, lote)
	}

	if lotes == nil {
		lotes = []LoteResponse{}
	}

	respondWithJSON(w, http.StatusOK, lotes)
}
