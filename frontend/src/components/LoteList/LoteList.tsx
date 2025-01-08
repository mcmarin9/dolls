import React, { useState } from "react";
import { Lote } from "../../types/Lote";
import LoteDetail from "../LoteDetail/LoteDetail";

interface LoteListProps {
  lotes: Lote[];
  onDelete: (id: number) => void;
  onView: (lote: Lote) => void;
}

const LoteList: React.FC<LoteListProps> = ({ lotes, onDelete }) => {
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleViewDetail = (lote: Lote) => {
    setSelectedLote(lote);
    setIsDetailOpen(true);
  };

  const formatPrice = (price: number | string): string => {
    if (typeof price === "number") {
      return price.toFixed(2);
    }
    const numPrice = Number(price);
    if (!isNaN(numPrice)) {
      return numPrice.toFixed(2);
    }
    return "0.00";
  };

  const getTypeStyle = (type: "compra" | "venta"): string => {
    return type === "compra"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  return (
<div className="flex flex-col h-full">
  <div className="flex-1 min-h-0 rounded-lg border border-gray-200">
    <div className="h-full overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 w-1/4 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-4 py-2 w-1/6 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-4 py-2 w-1/6 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio Total
                </th>
                <th className="px-4 py-2 w-1/6 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio Unitario
                </th>
                <th className="px-4 py-2 w-1/6 text-left text-xs font-medium text-gray-500 uppercase">
                  Cantidad Muñecas
                </th>
                <th className="px-4 py-2 w-1/6 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            {/* Cuerpo de la tabla */}
            <tbody className="bg-white divide-y divide-gray-200">
            {lotes.map((lote) => {
                const unitPrice = lote.quantity
                  ? lote.total_price / lote.quantity
                  : 0;
                return (
                  <tr key={lote.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {lote.nombre}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                      <span
                        className={`px-2 py-1 rounded ${getTypeStyle(
                          lote.type
                        )}`}
                      >
                        {lote.type.charAt(0).toUpperCase() + lote.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                      {formatPrice(lote.total_price)}€
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                      {formatPrice(unitPrice)}€
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                      {lote.quantity}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetail(lote)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => lote.id && onDelete(lote.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLote && (
        <LoteDetail
          lote={selectedLote}
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedLote(null);
          }}
        />
      )}
    </div>
  );
};


export default LoteList;