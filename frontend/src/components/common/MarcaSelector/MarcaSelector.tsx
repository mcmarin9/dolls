import React, { useEffect, useState } from "react";
import { Marca } from "../../../types/Marca";
import { getMarcas } from "../../../services/api";

interface MarcaSelectorProps {
  selectedMarcaId?: number;
  selectedFabricanteId?: number;
  onMarcaChange: (marcaId: number) => void;
  onFabricanteChange: (fabricanteId: number) => void;
  className?: string;
}

const MarcaSelector: React.FC<MarcaSelectorProps> = ({
  selectedMarcaId,
  selectedFabricanteId,
  onMarcaChange,
  onFabricanteChange,
  className = "",
}) => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marcasData] = await Promise.all([getMarcas()]);
        setMarcas(marcasData);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarcaChange = (marcaId: number) => {
    onMarcaChange(marcaId);

    const marca = marcas.find((m) => m.id === marcaId);
    if (!marca) return;

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
        <select
          value={selectedMarcaId || ""}
          onChange={(e) => handleMarcaChange(Number(e.target.value))}
          className="w-full border rounded p-2"
        >
          <option value="">Selecciona una marca</option>
          {marcas.map((marca) => (
            <option key={marca.id} value={marca.id}>
              {marca.nombre}
            </option>
          ))}
        </select>
      </div>

      {selectedMarcaId && currentMarca && (
        <div className="fabricante-select-container">
          {currentMarca.fabricantes && currentMarca.fabricantes.length === 1 ? (
            // Si solo hay un fabricante, mostrar su nombre
            <div className="w-full p-2 border rounded bg-gray-50">
              {currentMarca.fabricantes[0].nombre}
            </div>
          ) : (
            // Si hay múltiples fabricantes, mostrar selector
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
