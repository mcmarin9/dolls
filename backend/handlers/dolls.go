// Package handlers provides HTTP request handlers
package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/mcmarin9/dolls/database"
	"github.com/mcmarin9/dolls/models"
	"github.com/mcmarin9/dolls/utils"
)

var logger = utils.NewLogger("dolls_handler")

// GetDolls returns all dolls with related information
func GetDolls(w http.ResponseWriter, r *http.Request) {
	query := `
		SELECT 
			d.*,
			m.nombre AS marca_nombre,
			f.nombre AS fabricante_nombre,
			GROUP_CONCAT(l.id) as lote_ids,
			GROUP_CONCAT(l.nombre) as lote_nombres
		FROM dolls d
		LEFT JOIN marca m ON d.marca_id = m.id
		LEFT JOIN fabricantes f ON d.fabricante_id = f.id
		LEFT JOIN lote_doll ld ON d.id = ld.doll_id
		LEFT JOIN lotes l ON ld.lote_id = l.id
		GROUP BY d.id
		ORDER BY d.created_at DESC
	`

	rows, err := database.ExecuteQuery(query)
	if err != nil {
		logger.Error("Error querying dolls", err)
		logger.Error("Failed query", nil)
		respondWithError(w, http.StatusInternalServerError, "Error al obtener muñecas")
		return
	}
	defer rows.Close()

	var dolls []models.Doll
	for rows.Next() {
		var doll models.Doll
		var loteIDs, loteNombres sql.NullString

		err := rows.Scan(
			&doll.ID, &doll.Nombre, &doll.MarcaID, &doll.FabricanteID,
			&doll.Modelo, &doll.Personaje, &doll.Anyo, &doll.Estado,
			&doll.PrecioCompra, &doll.PrecioVenta, &doll.Comentarios, &doll.Imagen,
			&doll.CreatedAt,
			&doll.MarcaNombre, &doll.FabricanteNombre,
			&loteIDs, &loteNombres,
		)
		if err != nil {
			logger.Error("Error scanning doll", err)
			continue
		}

		// Process lotes
		if loteIDs.Valid && loteNombres.Valid {
			ids := strings.Split(loteIDs.String, ",")
			nombres := strings.Split(loteNombres.String, ",")
			for i := range ids {
				if i < len(nombres) {
					id, _ := strconv.Atoi(ids[i])
					doll.Lotes = append(doll.Lotes, models.Lote{
						ID:     id,
						Nombre: nombres[i],
					})
				}
			}
		}

		dolls = append(dolls, doll)
	}

	respondWithJSON(w, http.StatusOK, dolls)
}

// GetDoll returns a single doll by ID
func GetDoll(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	query := `
		SELECT 
			d.*,
			m.nombre AS marca_nombre,
			f.nombre AS fabricante_nombre
		FROM dolls d
		LEFT JOIN marca m ON d.marca_id = m.id
		LEFT JOIN fabricantes f ON d.fabricante_id = f.id
		WHERE d.id = ?
	`

	var doll models.Doll
	err = database.ExecuteQueryRow(query, id).Scan(
		&doll.ID, &doll.Nombre, &doll.MarcaID, &doll.FabricanteID,
		&doll.Modelo, &doll.Personaje, &doll.Anyo, &doll.Estado,
		&doll.PrecioCompra, &doll.PrecioVenta, &doll.Comentarios, &doll.Imagen,
		&doll.CreatedAt,
		&doll.MarcaNombre, &doll.FabricanteNombre,
	)
	if err == sql.ErrNoRows {
		respondWithError(w, http.StatusNotFound, "Muñeca no encontrada")
		return
	}
	if err != nil {
		logger.Error("Error querying doll", err)
		respondWithError(w, http.StatusInternalServerError, "Error al obtener muñeca")
		return
	}

	// Get lotes for this doll
	loteQuery := `
		SELECT l.id, l.nombre
		FROM lotes l
		INNER JOIN lote_doll ld ON l.id = ld.lote_id
		WHERE ld.doll_id = ?
	`
	loteRows, err := database.ExecuteQuery(loteQuery, id)
	if err == nil {
		defer loteRows.Close()
		for loteRows.Next() {
			var lote models.Lote
			if err := loteRows.Scan(&lote.ID, &lote.Nombre); err == nil {
				doll.Lotes = append(doll.Lotes, lote)
			}
		}
	}

	respondWithJSON(w, http.StatusOK, doll)
}

// AddDoll creates a new doll
func AddDoll(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		respondWithError(w, http.StatusBadRequest, "Error al parsear formulario")
		return
	}

	nombre := r.FormValue("nombre")
	marcaIDStr := r.FormValue("marca_id")

	marcaID, err := strconv.Atoi(marcaIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "marca_id inválido")
		return
	}

	// Validate input
	if err := utils.ValidateDollInput(nombre, marcaID); err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Get fabricante_id from marca
	var fabricanteID sql.NullInt64
	query := "SELECT fabricante_id FROM marca_fabricante WHERE marca_id = ? LIMIT 1"
	database.ExecuteQueryRow(query, marcaID).Scan(&fabricanteID)

	// Parse optional fields
	modelo := utils.StringPtr(r.FormValue("modelo"))
	personaje := utils.StringPtr(r.FormValue("personaje"))
	anyoStr := r.FormValue("anyo")
	var anyo *int
	if anyoStr != "" {
		if a, err := strconv.Atoi(anyoStr); err == nil {
			anyo = &a
		}
	}

	estado := r.FormValue("estado")
	if estado == "" {
		estado = "guardada"
	}

	var precioCompra, precioVenta *float64
	if pc := r.FormValue("precio_compra"); pc != "" {
		if p, err := strconv.ParseFloat(pc, 64); err == nil {
			precioCompra = &p
		}
	}
	if pv := r.FormValue("precio_venta"); pv != "" {
		if p, err := strconv.ParseFloat(pv, 64); err == nil {
			precioVenta = &p
		}
	}

	comentarios := utils.StringPtr(r.FormValue("comentarios"))

	// Handle image upload
	var imagePath *string
	file, fileHeader, err := r.FormFile("imagen")
	if err == nil {
		defer file.Close()
		if path, err := utils.SaveImage(fileHeader); err == nil {
			imagePath = &path
		} else {
			logger.Error("Error saving image", err)
		}
	}

	// Insert doll
	insertQuery := `
		INSERT INTO dolls (
			nombre, marca_id, fabricante_id, modelo, personaje, anyo, estado,
			precio_compra, precio_venta, comentarios, imagen
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := database.ExecuteUpdate(insertQuery,
		nombre, marcaID, fabricanteID, modelo, personaje, anyo, estado,
		precioCompra, precioVenta, comentarios, imagePath,
	)
	if err != nil {
		logger.Error("Error inserting doll", err)
		respondWithError(w, http.StatusInternalServerError, "Error al crear muñeca")
		return
	}

	dollID, _ := result.LastInsertId()

	// Handle lote associations
	loteIDsStr := r.FormValue("lote_ids")
	if loteIDsStr != "" {
		loteIDs := strings.Split(loteIDsStr, ",")
		for _, loteIDStr := range loteIDs {
			loteID, err := strconv.Atoi(strings.TrimSpace(loteIDStr))
			if err == nil {
				database.ExecuteUpdate("INSERT INTO lote_doll (lote_id, doll_id) VALUES (?, ?)", loteID, dollID)
			}
		}
	}

	respondWithJSON(w, http.StatusCreated, models.SuccessResponse{
		Message: "Muñeca creada exitosamente",
		Data:    map[string]int64{"id": dollID},
	})
}

// UpdateDoll updates an existing doll
func UpdateDoll(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	if err := r.ParseMultipartForm(32 << 20); err != nil {
		respondWithError(w, http.StatusBadRequest, "Error al parsear formulario")
		return
	}

	nombre := r.FormValue("nombre")
	marcaIDStr := r.FormValue("marca_id")

	marcaID, err := strconv.Atoi(marcaIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "marca_id inválido")
		return
	}

	// Validate input
	if err := utils.ValidateDollInput(nombre, marcaID); err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Get current image before updating
	var currentImage sql.NullString
	database.ExecuteQueryRow("SELECT imagen FROM dolls WHERE id = ?", id).Scan(&currentImage)

	// Handle image upload
	var imagePath *string
	file, fileHeader, err := r.FormFile("imagen")
	if err == nil {
		defer file.Close()
		if path, err := utils.SaveImage(fileHeader); err == nil {
			imagePath = &path
			// Delete old image
			if currentImage.Valid {
				utils.DeleteImage(currentImage.String)
			}
		}
	} else {
		// Keep existing image
		if currentImage.Valid {
			imagePath = &currentImage.String
		}
	}

	// Get fabricante_id from marca
	var fabricanteID sql.NullInt64
	query := "SELECT fabricante_id FROM marca_fabricante WHERE marca_id = ? LIMIT 1"
	database.ExecuteQueryRow(query, marcaID).Scan(&fabricanteID)

	// Parse optional fields (similar to AddDoll)
	modelo := utils.StringPtr(r.FormValue("modelo"))
	personaje := utils.StringPtr(r.FormValue("personaje"))
	anyoStr := r.FormValue("anyo")
	var anyo *int
	if anyoStr != "" {
		if a, err := strconv.Atoi(anyoStr); err == nil {
			anyo = &a
		}
	}

	estado := r.FormValue("estado")
	if estado == "" {
		estado = "guardada"
	}

	var precioCompra, precioVenta *float64
	if pc := r.FormValue("precio_compra"); pc != "" {
		if p, err := strconv.ParseFloat(pc, 64); err == nil {
			precioCompra = &p
		}
	}
	if pv := r.FormValue("precio_venta"); pv != "" {
		if p, err := strconv.ParseFloat(pv, 64); err == nil {
			precioVenta = &p
		}
	}

	comentarios := utils.StringPtr(r.FormValue("comentarios"))

	// Update doll
	updateQuery := `
		UPDATE dolls SET
			nombre = ?, marca_id = ?, fabricante_id = ?, modelo = ?, personaje = ?,
			anyo = ?, estado = ?, precio_compra = ?, precio_venta = ?,
			comentarios = ?, imagen = ?
		WHERE id = ?
	`

	_, err = database.ExecuteUpdate(updateQuery,
		nombre, marcaID, fabricanteID, modelo, personaje, anyo, estado,
		precioCompra, precioVenta, comentarios, imagePath, id,
	)
	if err != nil {
		logger.Error("Error updating doll", err)
		respondWithError(w, http.StatusInternalServerError, "Error al actualizar muñeca")
		return
	}

	// Update lote associations
	database.ExecuteUpdate("DELETE FROM lote_doll WHERE doll_id = ?", id)
	loteIDsStr := r.FormValue("lote_ids")
	if loteIDsStr != "" {
		loteIDs := strings.Split(loteIDsStr, ",")
		for _, loteIDStr := range loteIDs {
			loteID, err := strconv.Atoi(strings.TrimSpace(loteIDStr))
			if err == nil {
				database.ExecuteUpdate("INSERT INTO lote_doll (lote_id, doll_id) VALUES (?, ?)", loteID, id)
			}
		}
	}

	respondWithJSON(w, http.StatusOK, models.SuccessResponse{
		Message: "Muñeca actualizada exitosamente",
	})
}

// DeleteDoll deletes a doll
func DeleteDoll(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	// Get image path before deleting
	var imagePath sql.NullString
	database.ExecuteQueryRow("SELECT imagen FROM dolls WHERE id = ?", id).Scan(&imagePath)

	// Delete from lote_doll first (foreign key constraint)
	database.ExecuteUpdate("DELETE FROM lote_doll WHERE doll_id = ?", id)

	// Delete doll
	result, err := database.ExecuteUpdate("DELETE FROM dolls WHERE id = ?", id)
	if err != nil {
		logger.Error("Error deleting doll", err)
		respondWithError(w, http.StatusInternalServerError, "Error al eliminar muñeca")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		respondWithError(w, http.StatusNotFound, "Muñeca no encontrada")
		return
	}

	// Delete image file
	if imagePath.Valid {
		utils.DeleteImage(imagePath.String)
	}

	respondWithJSON(w, http.StatusOK, models.SuccessResponse{
		Message: "Muñeca eliminada exitosamente",
	})
}

// Helper functions
func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, models.ErrorResponse{Error: message})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}
