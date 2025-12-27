// Package handlers provides HTTP request handlers
package handlers

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/mcmarin9/dolls/database"
	"github.com/mcmarin9/dolls/models"
	"github.com/mcmarin9/dolls/utils"
)

// GetMarcas returns all marcas
func GetMarcas(w http.ResponseWriter, r *http.Request) {
	query := "SELECT id, nombre, created_at FROM marca ORDER BY nombre ASC"

	rows, err := database.ExecuteQuery(query)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al obtener marcas")
		return
	}
	defer rows.Close()

	var marcas []models.Marca
	for rows.Next() {
		var marca models.Marca
		if err := rows.Scan(&marca.ID, &marca.Nombre, &marca.CreatedAt); err == nil {
			marcas = append(marcas, marca)
		}
	}

	respondWithJSON(w, http.StatusOK, marcas)
}

// AddMarca creates a new marca
func AddMarca(w http.ResponseWriter, r *http.Request) {
	type MarcaInput struct {
		Nombre       string `json:"nombre"`
		FabricanteID int    `json:"fabricante_id"`
	}

	var input MarcaInput
	if err := parseJSONBody(r, &input); err != nil {
		respondWithError(w, http.StatusBadRequest, "Datos inválidos")
		return
	}

	// Validate input
	if err := utils.ValidateMarcaInput(input.Nombre); err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	if input.FabricanteID <= 0 {
		respondWithError(w, http.StatusBadRequest, "fabricante_id inválido")
		return
	}

	// Validate that fabricante exists
	var fabricanteExists int
	err := database.ExecuteQueryRow("SELECT COUNT(*) FROM fabricantes WHERE id = ?", input.FabricanteID).Scan(&fabricanteExists)
	if err != nil || fabricanteExists == 0 {
		respondWithError(w, http.StatusBadRequest, "Fabricante no encontrado")
		return
	}

	// Insert marca
	insertQuery := "INSERT INTO marca (nombre) VALUES (?)"
	result, err := database.ExecuteUpdate(insertQuery, input.Nombre)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al crear marca")
		return
	}

	marcaID, _ := result.LastInsertId()

	// Associate with fabricante
	_, err = database.ExecuteUpdate("INSERT INTO marca_fabricante (marca_id, fabricante_id) VALUES (?, ?)",
		marcaID, input.FabricanteID)
	if err != nil {
		logger.Error("Error creating marca_fabricante relationship", err)
		respondWithError(w, http.StatusInternalServerError, "Error al asociar marca con fabricante")
		return
	}

	respondWithJSON(w, http.StatusCreated, models.SuccessResponse{
		Message: "Marca creada exitosamente",
		Data:    map[string]int64{"id": marcaID},
	})
}

// UpdateMarca updates an existing marca
func UpdateMarca(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	type MarcaInput struct {
		Nombre string `json:"nombre"`
	}

	var input MarcaInput
	if err := parseJSONBody(r, &input); err != nil {
		respondWithError(w, http.StatusBadRequest, "Datos inválidos")
		return
	}

	// Validate input
	if err := utils.ValidateMarcaInput(input.Nombre); err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Update marca
	updateQuery := "UPDATE marca SET nombre = ? WHERE id = ?"
	_, err = database.ExecuteUpdate(updateQuery, input.Nombre, id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al actualizar marca")
		return
	}

	respondWithJSON(w, http.StatusOK, models.SuccessResponse{
		Message: "Marca actualizada exitosamente",
	})
}

// DeleteMarca deletes a marca
func DeleteMarca(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "ID inválido")
		return
	}

	// Check if marca is being used by dolls
	var count int
	database.ExecuteQueryRow("SELECT COUNT(*) FROM dolls WHERE marca_id = ?", id).Scan(&count)
	if count > 0 {
		respondWithError(w, http.StatusBadRequest, "No se puede eliminar: marca en uso por muñecas")
		return
	}

	// Delete from marca_fabricante first
	database.ExecuteUpdate("DELETE FROM marca_fabricante WHERE marca_id = ?", id)

	// Delete marca
	result, err := database.ExecuteUpdate("DELETE FROM marca WHERE id = ?", id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al eliminar marca")
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		respondWithError(w, http.StatusNotFound, "Marca no encontrada")
		return
	}

	respondWithJSON(w, http.StatusOK, models.SuccessResponse{
		Message: "Marca eliminada exitosamente",
	})
}

// GetFabricantes returns all fabricantes
func GetFabricantes(w http.ResponseWriter, r *http.Request) {
	query := "SELECT id, nombre, created_at FROM fabricantes ORDER BY nombre ASC"

	rows, err := database.ExecuteQuery(query)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al obtener fabricantes")
		return
	}
	defer rows.Close()

	var fabricantes []models.Fabricante
	for rows.Next() {
		var fabricante models.Fabricante
		if err := rows.Scan(&fabricante.ID, &fabricante.Nombre, &fabricante.CreatedAt); err == nil {
			fabricantes = append(fabricantes, fabricante)
		}
	}

	respondWithJSON(w, http.StatusOK, fabricantes)
}

// GetMarcasByFabricante returns all marcas for a specific fabricante
func GetMarcasByFabricante(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	fabricanteID, err := strconv.Atoi(vars["fabricante_id"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "fabricante_id inválido")
		return
	}

	query := `
		SELECT m.id, m.nombre, m.created_at
		FROM marca m
		INNER JOIN marca_fabricante mf ON m.id = mf.marca_id
		WHERE mf.fabricante_id = ?
		ORDER BY m.nombre ASC
	`

	rows, err := database.ExecuteQuery(query, fabricanteID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Error al obtener marcas")
		return
	}
	defer rows.Close()

	var marcas []models.Marca
	for rows.Next() {
		var marca models.Marca
		if err := rows.Scan(&marca.ID, &marca.Nombre, &marca.CreatedAt); err == nil {
			marcas = append(marcas, marca)
		}
	}

	respondWithJSON(w, http.StatusOK, marcas)
}
