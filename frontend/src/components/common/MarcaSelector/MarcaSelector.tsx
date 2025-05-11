import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Marca } from "../../../types/Marca";
import { getMarcas, getDolls } from "../../../services/api";

interface MarcaSelectorProps {
  selectedMarcaId?: number;
  selectedFabricanteId?: number;
  onMarcaChange: (marcaId: number) => void;
  onFabricanteChange: (fabricanteId: number) => void;
  className?: string;
}

interface MarcaWithCount extends Marca {
  dollCount: number;
}

const MarcaSelector: React.FC<MarcaSelectorProps> = ({
  selectedMarcaId,
  selectedFabricanteId,
  onMarcaChange,
  onFabricanteChange,
  className = "",
}) => {
  const [marcas, setMarcas] = useState<MarcaWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marcasData, dollsData] = await Promise.all([getMarcas(), getDolls()]);
        
        // Contar muñecas por marca
        const marcasWithCount = marcasData.map(marca => ({
          ...marca,
          dollCount: dollsData.filter(doll => doll.marca_id === marca.id).length
        }));

        // Ordenar por número de muñecas descendente
        const sortedMarcas = marcasWithCount.sort((a, b) => b.dollCount - a.dollCount);
        
        setMarcas(sortedMarcas);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarcaChange = (_: React.SyntheticEvent, marca: MarcaWithCount | null) => {
    if (!marca) return;
    
    onMarcaChange(marca.id);

    if (marca.fabricantes && marca.fabricantes.length === 1) {
      onFabricanteChange(marca.fabricantes[0].id);
    } else if (marca.fabricantes && marca.fabricantes.length > 1) {
      const fabricanteExists = marca.fabricantes.some(
        (f) => f.id === selectedFabricanteId
      );
      if (!fabricanteExists) {
        onFabricanteChange(0);
      }
    }
  };

  const currentMarca = marcas.find((marca) => marca.id === selectedMarcaId);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={`marca-selector ${className}`}>
      <div className="marca-select-container mb-2">
        <Autocomplete
          options={marcas}
          getOptionLabel={(marca) => marca.nombre}
          value={currentMarca || null}
          onChange={handleMarcaChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecciona una marca"
              variant="outlined"
              size="small"
            />
          )}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </div>

      {selectedMarcaId && currentMarca && (
        <div className="fabricante-select-container">
          {currentMarca.fabricantes && currentMarca.fabricantes.length === 1 ? (
            <div className="w-full p-2 border rounded bg-gray-50">
              {currentMarca.fabricantes[0].nombre}
            </div>
          ) : (
            <select
              value={selectedFabricanteId || ""}
              onChange={(e) => onFabricanteChange(Number(e.target.value))}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Selecciona un fabricante</option>
              {currentMarca.fabricantes?.map((fabricante) => (
                <option key={fabricante.id} value={fabricante.id}>
                  {fabricante.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
};

export default MarcaSelector;