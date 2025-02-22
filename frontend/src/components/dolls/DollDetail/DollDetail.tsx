import React, { useEffect, useState } from "react";
import { Doll } from "../../../types/Doll";
import { getStatusStyle, getTypeStyle } from "../../../utils/styleUtils";
import { fetchDollLotes } from "../../../utils/checkIfLote";


interface DollDetailProps {
  doll: Doll;
  isOpen: boolean;
  onClose: () => void;
  onLoteClick?: (loteId: number) => void;
}

const DollDetail: React.FC<DollDetailProps> = ({
  doll,
  isOpen,
  onClose,
  onLoteClick,
}) => {
  const [dollWithLotes, setDollWithLotes] = useState<Doll>(doll);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDollLotes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const lotes = await fetchDollLotes(doll.id);
        setDollWithLotes((prev) => ({ ...prev, lotes }));
      } catch (error) {
        setError("No se pudieron cargar los lotes");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isOpen && doll.id) {
      loadDollLotes();
    }
  }, [doll.id, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="w-full">
      <div className="doll-detail">
        {doll.imagen ? (
          <img
            src={`http://localhost:5000${doll.imagen}`}
            alt={doll.nombre}
            className="w-64 h-64 object-cover rounded mb-4"
          />
        ) : (
          <div className="w-64 h-64 bg-gray-200 rounded flex items-center justify-center mb-4">
            <span className="text-gray-400">No imagen</span>
          </div>
        )}
        <div className="grid gap-2">
          <p>
            <span className="font-semibold">Nombre:</span> {doll.nombre}
          </p>
          <p>
            <span className="font-semibold">Marca:</span> {doll.marca_nombre} -{" "}
            {doll.fabricante_nombre}
          </p>
          <p>
            <span className="font-semibold">Modelo:</span> {doll.modelo}
          </p>
          <p>
            <span className="font-semibold">Personaje:</span> {doll.personaje}
          </p>
          <p>
            <span className="font-semibold">Año:</span> {doll.anyo}
          </p>
          <p>
            <span className="font-semibold">Estado: </span>
            <span
              className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(
                doll.estado || ""
              )}`}
            >
              {doll.estado}
            </span>
          </p>{" "}
          {doll.comentarios && (
            <p>
              <span className="font-semibold">Comentarios:</span>{" "}
              {doll.comentarios}
            </p>
          )}
          {doll.precio_compra && (
            <p>
              <span className="font-semibold">Precio de compra:</span>{" "}
              {doll.precio_compra}€
            </p>
          )}
          {doll.precio_venta && (
            <p>
              <span className="font-semibold">Precio de venta:</span>{" "}
              {doll.precio_venta}€
            </p>
          )}
          {isLoading ? (
            <p>Cargando lotes...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            dollWithLotes.lotes &&
            dollWithLotes.lotes.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Lotes:</p>
                <div className="flex flex-wrap gap-2">
                  {dollWithLotes.lotes.map((lote) => (
                    <button
                      key={lote.id}
                      onClick={() => onLoteClick?.(lote.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${getTypeStyle(
                        (lote.tipo || "").toLowerCase() as "compra" | "venta"
                      )}`}
                    >
                      {lote.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md"
      >
        Cerrar
      </button>
    </div>
  );
};

export default DollDetail;
