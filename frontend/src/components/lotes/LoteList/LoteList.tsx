import React, { useState, useMemo } from "react";
import { Lote } from "../../../types/Lote";
import LoteDetail from "../LoteDetail/LoteDetail";
import { getTypeStyle } from "../../../utils/styleUtils";

const TIPO_LOTES = ["Todos", "Compra", "Venta"] as const;
type TipoLote = (typeof TIPO_LOTES)[number];

interface LoteListProps {
  lotes: Lote[];
  onDelete: (id: number) => void;
  onView: (lote: Lote) => void;
  onEdit: (lote: Lote) => void;
}

const LoteList: React.FC<LoteListProps> = ({
  lotes,
  onDelete,
  onView,
  onEdit,
}) => {
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loteToDelete, setLoteToDelete] = useState<Lote | null>(null);
  const [tipoFiltro, setTipoFiltro] = useState<TipoLote>("Todos");

  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null) return "0.00";
    return Number(price).toFixed(2);
  };

  const handleView = (lote: Lote) => {
    setSelectedLote(lote);
    setIsDetailOpen(true);
    onView(lote);
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Lote | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const requestSort = (key: keyof Lote) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedLotes = useMemo(() => {
    let filteredItems = [...lotes];

    // Aplicar filtro por tipo
    if (tipoFiltro !== "Todos") {
      filteredItems = filteredItems.filter(
        (lote) => lote.tipo.toLowerCase() === tipoFiltro.toLowerCase()
      );
    }

    // Mantener la lógica de ordenamiento existente
    if (sortConfig.key !== null) {
      filteredItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Manejar específicamente los campos numéricos
        if (sortConfig.key === "precio_total") {
          const aNum = Number(aValue) || 0;
          const bNum = Number(bValue) || 0;
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        // Para el resto de campos, mantener la ordenación por string
        const aString = String(aValue || "").toLowerCase();
        const bString = String(bValue || "").toLowerCase();

        if (aString < bString) return sortConfig.direction === "asc" ? -1 : 1;
        if (aString > bString) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filteredItems;
  }, [lotes, sortConfig, tipoFiltro]);

  const getSortIcon = (key: keyof Lote) => {
    if (sortConfig.key !== key) {
      return "";
    }
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleDeleteClick = (lote: Lote) => {
    setLoteToDelete(lote);
  };

  const confirmDelete = () => {
    if (loteToDelete?.id) {
      onDelete(loteToDelete.id);
      setLoteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setLoteToDelete(null);
  };

  const FilterSection = () => (
    <div className="mb-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Filtrar por tipo:</span>
        <div className="flex space-x-2">
          {TIPO_LOTES.map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoFiltro(tipo)}
              className={`px-4 py-2 rounded-md transition-colors ${
                tipoFiltro === tipo
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <FilterSection />
      <div className="flex-1 min-h-0 rounded-lg border border-gray-200">
        <div className="h-full overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("nombre")}
                >
                  Nombre {getSortIcon("nombre")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("tipo")}
                >
                  Tipo {getSortIcon("tipo")}
                </th>
                <th
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("precio_total")}
                >
                  Precio Total {getSortIcon("precio_total")}
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
              {sortedLotes.map((lote) => {
                const totalPrice = lote.precio_total || 0;
                const quantity = lote.dolls?.length || 0;
                const unitPrice = quantity > 0 ? totalPrice / quantity : 0;

                return (
                  <tr key={lote.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {lote.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded ${getTypeStyle(
                          lote.tipo.toLowerCase() as "compra" | "venta"
                        )}`}
                      >
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
                        onClick={() => handleDeleteClick(lote)}
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

      {loteToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Confirmar eliminación
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ¿Estás seguro de que deseas eliminar el lote "
                  {loteToDelete.nombre}"?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 mr-2"
                >
                  Eliminar
                </button>
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoteList;
