import React, { useState, useMemo } from "react";
import { Lote } from "../../../types/Lote";
import { getTypeStyle } from "../../../utils/styleUtils";
import { useApp } from "../../../context";
import LoteDetail from "../LoteDetail/LoteDetail";

const LoteList: React.FC = () => {
  const { lotes, removeLote, openLoteDetail, openEditLote } = useApp();
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loteToDelete, setLoteToDelete] = useState<Lote | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null) return "0.00";
    return Number(price).toFixed(2);
  };

  const handleView = (lote: Lote) => {
    setSelectedLote(lote);
    setIsDetailOpen(true);
    openLoteDetail(lote);
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

  const filteredAndSortedLotes = useMemo(() => {
    // Primer paso: filtrar por búsqueda y tipo
    let filteredItems = [...lotes];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filteredItems = filteredItems.filter(lote => 
        lote.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por tipo
    if (selectedType) {
      filteredItems = filteredItems.filter(lote => 
        lote.tipo.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Segundo paso: ordenar los items filtrados
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
  }, [lotes, sortConfig, selectedType, searchTerm]);


  const getSortIcon = (key: keyof Lote) => {
    if (sortConfig.key !== key) {
      return "";
    }
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const handleDeleteClick = (lote: Lote) => {
    setLoteToDelete(lote);
  };

  const confirmDelete = async () => {
    if (loteToDelete?.id) {
      try {
        await removeLote(loteToDelete.id);
      } catch (error) {
        console.error("Error deleting lote:", error);
      }
      setLoteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setLoteToDelete(null);
  };

  // Calcular estadísticas
  const stats = useMemo(() => {
    const filtered = filteredAndSortedLotes;
    const totalCompra = filtered
      .filter(l => l.tipo.toLowerCase() === 'compra')
      .reduce((sum, l) => sum + (l.precio_total || 0), 0);
    const totalVenta = filtered
      .filter(l => l.tipo.toLowerCase() === 'venta')
      .reduce((sum, l) => sum + (l.precio_total || 0), 0);
    const totalDolls = filtered.reduce((sum, l) => sum + (l.cantidad_munecas || 0), 0);
    
    return {
      totalCompra,
      totalVenta,
      totalDolls,
      count: filtered.length
    };
  }, [filteredAndSortedLotes]);

  return (
    <div className="flex flex-col h-full">
      {/* Barra de filtros y búsqueda */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        {/* Campo de búsqueda */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar por nombre..."
            className="w-full p-2 pl-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Filtro de tipo */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">📦 Todos los tipos</option>
          <option value="compra">🛒 Compra</option>
          <option value="venta">💰 Venta</option>
        </select>
      </div>

      {/* Estadísticas rápidas */}
      {filteredAndSortedLotes.length > 0 && (
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium uppercase">Total Lotes</div>
            <div className="text-2xl font-bold text-blue-900">{stats.count}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium uppercase">Compras</div>
            <div className="text-2xl font-bold text-green-900">{formatPrice(stats.totalCompra)}€</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-xs text-purple-600 font-medium uppercase">Ventas</div>
            <div className="text-2xl font-bold text-purple-900">{formatPrice(stats.totalVenta)}€</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-xs text-orange-600 font-medium uppercase">Total Muñecas</div>
            <div className="text-2xl font-bold text-orange-900">{stats.totalDolls}</div>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 rounded-lg border border-gray-200 shadow-sm">
        <div className="h-full overflow-auto">{filteredAndSortedLotes.length === 0 ? (
            /* Estado vacío */
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
              <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-xl font-semibold mb-2">No hay lotes</p>
              <p className="text-sm">
                {searchTerm || selectedType
                  ? "No se encontraron lotes con los filtros aplicados"
                  : "Comienza agregando tu primer lote"}
              </p>
            </div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("nombre")}
                  title="Ordenar por nombre"
                >
                  <div className="flex items-center gap-1">
                    📝 Nombre {getSortIcon("nombre")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("tipo")}
                  title="Ordenar por tipo"
                >
                  <div className="flex items-center gap-1">
                    🏷️ Tipo {getSortIcon("tipo")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("precio_total")}
                  title="Ordenar por precio total"
                >
                  <div className="flex items-center gap-1">
                    💵 Precio Total {getSortIcon("precio_total")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" title="Precio por unidad">
                  <div className="flex items-center gap-1">
                    💰 Precio Unitario
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" title="Número de muñecas">
                  <div className="flex items-center gap-1">
                    🎎 Cantidad
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  ⚙️ Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedLotes.map((lote) => {
            const totalPrice = lote.precio_total || 0;
            const quantity = lote.cantidad_munecas || 0;
            const unitPrice = lote.precio_unitario || 0;


                return (
                  <tr key={lote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lote.nombre}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyle(
                          lote.tipo.toLowerCase() as "compra" | "venta"
                        )}`}
                      >
                        {lote.tipo.toLowerCase() === 'compra' ? '🛒' : '💰'} {lote.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatPrice(totalPrice)}€</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{formatPrice(unitPrice)}€</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {quantity} {quantity === 1 ? 'muñeca' : 'muñecas'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(lote)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Ver detalles del lote"
                        >
                          👁️ Ver
                        </button>
                        <button
                          onClick={() => openEditLote(lote)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors"
                          title="Editar lote"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteClick(lote)}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                          title="Eliminar lote"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
          <div className="relative mx-auto p-6 border border-gray-200 w-full max-w-md shadow-2xl rounded-xl bg-white">
            <div className="text-center">
              {/* Icono de advertencia */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-xl leading-6 font-bold text-gray-900 mb-2">
                ⚠️ Confirmar eliminación
              </h3>
              <div className="mt-3 px-4 py-3">
                <p className="text-sm text-gray-600 mb-2">
                  ¿Estás seguro de que deseas eliminar el lote:
                </p>
                <p className="text-base font-semibold text-gray-900 mb-2">
                  "{loteToDelete.nombre}"?
                </p>
                <p className="text-xs text-red-600">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex gap-3 justify-center px-4 py-3 mt-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  ❌ Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  🗑️ Eliminar
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
