import React, { useState } from "react";
import { Lote } from "../../../types/Lote";
import LoteDetail from "../LoteDetail/LoteDetail";
import { getTypeStyle } from "../../../utils/styleUtils";


interface LoteListProps {
  lotes: Lote[];
  onDelete: (id: number) => void;
  onView: (lote: Lote) => void;
  onEdit: (lote: Lote) => void;
}

const LoteList: React.FC<LoteListProps> = ({ lotes, onDelete, onView, onEdit }) => {
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null) return "0.00";
    return Number(price).toFixed(2);
  };

  const handleView = (lote: Lote) => {
    setSelectedLote(lote);
    setIsDetailOpen(true);
    onView(lote);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 rounded-lg border border-gray-200">
        <div className="h-full overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio Total
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Precio Unitario
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Cantidad Muñecas
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lotes.map((lote) => {
                const totalPrice = lote.precio_total || 0;
                const quantity = lote.dolls?.length || 0;
                const unitPrice = quantity > 0 ? totalPrice / quantity : 0;

                return (
                  <tr key={lote.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {lote.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded ${getTypeStyle(lote.tipo.toLowerCase() as "compra" | "venta")}`}>
                      {lote.tipo}
                    </span>
                  </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                      {formatPrice(totalPrice)}€
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                      {formatPrice(unitPrice)}€
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                      {quantity}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleView(lote)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => onEdit(lote)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(lote.id)}
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
