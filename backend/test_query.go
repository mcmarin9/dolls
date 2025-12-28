package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/mcmarin9/dolls/config"
	"github.com/mcmarin9/dolls/database"
)

func testQuery() {
	cfg := config.Load()
	err := database.Connect(cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer database.Close()

	// Test lote 50
	loteID := 50
	query := `
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

	rows, err := database.ExecuteQuery(query, loteID)
	if err != nil {
		log.Fatalf("Error executing query: %v", err)
	}
	defer rows.Close()

	count := 0
	for rows.Next() {
		var id int
		var nombre string
		var marcaID int
		var fabricanteID sql.NullInt64
		var modelo sql.NullString
		var personaje sql.NullString
		var anyo sql.NullInt64
		var estado string
		var precioCompra sql.NullFloat64
		var precioVenta sql.NullFloat64
		var comentarios sql.NullString
		var imagen sql.NullString
		var createdAt string
		var marcaNombre sql.NullString
		var fabricanteNombre sql.NullString

		err := rows.Scan(
			&id, &nombre, &marcaID, &fabricanteID,
			&modelo, &personaje, &anyo, &estado,
			&precioCompra, &precioVenta, &comentarios, &imagen,
			&createdAt,
			&marcaNombre, &fabricanteNombre,
		)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}
		count++
		fmt.Printf("Row %d: ID=%d, Nombre=%s, Marca=%v\n", count, id, nombre, marcaNombre)
	}

	fmt.Printf("Total rows: %d\n", count)
}
