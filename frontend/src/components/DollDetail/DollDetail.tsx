import React from "react";
import { Doll } from "../../types/Doll";

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
  if (!isOpen) return null;

  const getBadgeColor = (tipo: string) => {
    return tipo === "compra"
      ? "bg-green-100 text-green-800 hover:bg-green-200"
      : "bg-orange-100 text-orange-800 hover:bg-orange-200";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{doll.nombre}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

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
            <span className="font-semibold">Marca:</span> {doll.marca_nombre}
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
            <span className="font-semibold">Estado:</span> {doll.estado}
          </p>
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
          {doll.lotes && doll.lotes.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Lotes:</p>
              <div className="flex flex-wrap gap-2">
                {doll.lotes.map((lote) => (
                  <button
                    key={lote.id}
                    onClick={() => onLoteClick?.(lote.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${getBadgeColor(
                      lote.tipo
                    )}`}
                  >
                    {lote.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* TODO: cuando abro un lote y pincho a una muñeca, a ella no le salen los lotes a los que pertenece. Pero si entro desde el listado, sí aparecen sus lotes.*/}
    </div>
  );
};

export default DollDetail;
