import React, { useState, useMemo } from "react";
import { deleteImage } from "../../../services/api";
import { Doll } from "../../../types/Doll";
import { getStatusStyle } from "../../../utils/styleUtils";
import { useApp } from "../../../context";

const DollsList: React.FC = () => {
  const { dolls, brands, removeDoll, openDollDetail, openEditDoll } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showOnlyNoPhoto, setShowOnlyNoPhoto] = useState(false);
  const [dollToDelete, setDollToDelete] = useState<Doll | null>(null);

  const filteredDolls = useMemo(
    () =>
      dolls.filter((doll) => {
        const matchesSearch = searchTerm === "" || 
          doll.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doll.modelo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand =
          !selectedBrand || doll.marca_nombre === selectedBrand;
        const matchesManufacturer =
          !selectedManufacturer ||
          doll.fabricante_nombre === selectedManufacturer;
        const matchesStatus = !selectedStatus || doll.estado === selectedStatus;
        const matchesPhotoFilter = !showOnlyNoPhoto || !doll.imagen;
        return (
          matchesSearch && matchesBrand && matchesManufacturer && matchesStatus && matchesPhotoFilter
        );
      }),
    [dolls, searchTerm, selectedBrand, selectedManufacturer, selectedStatus, showOnlyNoPhoto]
  );

  const manufacturers = useMemo(() => {
    if (!selectedBrand) {
      // Si no hay marca seleccionada, mostrar todos los fabricantes únicos
      return Array.from(
        new Set(dolls.map((doll) => doll.fabricante_nombre).filter(Boolean))
      ).sort();
    } else {
      // Si hay una marca seleccionada, mostrar solo sus fabricantes
      return Array.from(
        new Set(
          dolls
            .filter((doll) => doll.marca_nombre === selectedBrand)
            .map((doll) => doll.fabricante_nombre)
            .filter(Boolean)
        )
      ).sort();
    }
  }, [dolls, selectedBrand]);

  const handleDelete = async (doll: Doll) => {
    try {
      if (doll.imagen) {
        if (typeof doll.imagen === "string") {
          await deleteImage(doll.imagen);
        }
      }
      if (doll.id) {
        await removeDoll(doll.id);
      }
    } catch (error) {
      console.error("Error deleting doll:", error);
    }
  };

  const handleDeleteClick = (doll: Doll) => {
    setDollToDelete(doll);
  };

  const confirmDelete = async () => {
    if (dollToDelete) {
      await handleDelete(dollToDelete);
      setDollToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDollToDelete(null);
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Doll | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const requestSort = (key: keyof Doll) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedDolls = useMemo(() => {
    const sortedItems = [...filteredDolls];
    if (sortConfig.key !== null) {
      sortedItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Manejar específicamente los campos numéricos
        if (
          sortConfig.key &&
          ["precio_compra", "precio_venta", "anyo"].includes(sortConfig.key)
        ) {
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
    return sortedItems;
  }, [filteredDolls, sortConfig]);

  const getSortIcon = (key: keyof Doll) => {
    if (sortConfig.key !== key) {
      return "";
    }
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalCompra = sortedDolls.reduce((sum, d) => sum + (Number(d.precio_compra) || 0), 0);
    const totalVenta = sortedDolls.reduce((sum, d) => sum + (Number(d.precio_venta) || 0), 0);
    const sinFoto = sortedDolls.filter(d => !d.imagen).length;
    const conFoto = sortedDolls.filter(d => d.imagen).length;
    const guardadas = sortedDolls.filter(d => d.estado === 'guardada').length;
    const enVenta = sortedDolls.filter(d => d.estado === 'a la venta').length;
    const vendidas = sortedDolls.filter(d => d.estado === 'vendida').length;
    
    return {
      totalCompra,
      totalVenta,
      sinFoto,
      conFoto,
      guardadas,
      enVenta,
      vendidas,
      total: sortedDolls.length
    };
  }, [sortedDolls]);

  return (
    <div className="flex flex-col h-full">
      {/* Barra de filtros */}
      <div className="mb-4 space-y-3">
        {/* Primera fila: Búsqueda y checkbox */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
            <input
              type="checkbox"
              checked={showOnlyNoPhoto}
              onChange={(e) => setShowOnlyNoPhoto(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
              id="noPhoto"
            />
            <label htmlFor="noPhoto" className="text-sm font-medium text-gray-700 cursor-pointer">
              📷 Solo sin foto
            </label>
          </div>
        </div>
        
        {/* Segunda fila: Selectores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">🏷️ Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.nombre}>
                {brand.nombre}
              </option>
            ))}
          </select>
          <select
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">🏭 Todos los fabricantes</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">📊 Todos los estados</option>
            <option value="guardada">💾 Guardada</option>
            <option value="a la venta">🏪 A la venta</option>
            <option value="vendida">✅ Vendida</option>
            <option value="fuera">❌ Fuera</option>
          </select>
        </div>
      </div>

      {/* Panel de estadísticas */}
      {sortedDolls.length > 0 && (
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
            <div className="text-xs text-blue-600 font-medium">Total</div>
            <div className="text-xl font-bold text-blue-900">{stats.total}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
            <div className="text-xs text-purple-600 font-medium">Con foto</div>
            <div className="text-xl font-bold text-purple-900">{stats.conFoto}</div>
          </div>
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
            <div className="text-xs text-gray-600 font-medium">Sin foto</div>
            <div className="text-xl font-bold text-gray-900">{stats.sinFoto}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
            <div className="text-xs text-green-600 font-medium">Guardadas</div>
            <div className="text-xl font-bold text-green-900">{stats.guardadas}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <div className="text-xs text-yellow-600 font-medium">En venta</div>
            <div className="text-xl font-bold text-yellow-900">{stats.enVenta}</div>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-2">
            <div className="text-xs text-teal-600 font-medium">Vendidas</div>
            <div className="text-xl font-bold text-teal-900">{stats.vendidas}</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
            <div className="text-xs text-orange-600 font-medium">Inversión</div>
            <div className="text-lg font-bold text-orange-900">{stats.totalCompra.toFixed(2)}€</div>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 rounded-lg border border-gray-200 shadow-sm">
        <div className="h-full overflow-auto">
          {sortedDolls.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
              <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-semibold mb-2">No hay muñecas</p>
              <p className="text-sm">
                {searchTerm || selectedBrand || selectedManufacturer || selectedStatus || showOnlyNoPhoto
                  ? "No se encontraron muñecas con los filtros aplicados"
                  : "Comienza agregando tu primera muñeca"}
              </p>
            </div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" title="Foto de la muñeca">
                  📸 Imagen
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("nombre")}
                  title="Ordenar por nombre"
                >
                  <div className="flex items-center gap-1">
                    🎎 Nombre {getSortIcon("nombre")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("marca_nombre")}
                  title="Ordenar por marca"
                >
                  <div className="flex items-center gap-1">
                    🏷️ Marca {getSortIcon("marca_nombre")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("fabricante_nombre")}
                  title="Ordenar por fabricante"
                >
                  <div className="flex items-center gap-1">
                    🏭 Fabricante {getSortIcon("fabricante_nombre")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("modelo")}
                  title="Ordenar por modelo"
                >
                  <div className="flex items-center gap-1">
                    📦 Modelo {getSortIcon("modelo")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("personaje")}
                  title="Ordenar por personaje"
                >
                  <div className="flex items-center gap-1">
                    👤 Personaje {getSortIcon("personaje")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("anyo")}
                  title="Ordenar por año"
                >
                  <div className="flex items-center gap-1">
                    📅 Año {getSortIcon("anyo")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("estado")}
                  title="Ordenar por estado"
                >
                  <div className="flex items-center gap-1">
                    📊 Estado {getSortIcon("estado")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("precio_compra")}
                  title="Ordenar por precio de compra"
                >
                  <div className="flex items-center gap-1">
                    🛒 P. Compra {getSortIcon("precio_compra")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("precio_venta")}
                  title="Ordenar por precio de venta"
                >
                  <div className="flex items-center gap-1">
                    💰 P. Venta {getSortIcon("precio_venta")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => requestSort("comentarios")}
                  title="Ordenar por comentarios"
                >
                  <div className="flex items-center gap-1">
                    💬 Comentarios {getSortIcon("comentarios")}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  ⚙️ Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedDolls.map((doll) => (
                <tr key={doll.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {doll.imagen ? (
                      <img
                        src={`http://localhost:5000${doll.imagen}`}
                        alt={doll.nombre}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                        <span className="text-gray-400 text-xs text-center">Sin<br/>foto</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{doll.nombre || '-'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {doll.marca_nombre || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {doll.fabricante_nombre || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="max-w-[250px] truncate" title={doll.modelo || ''}>
                      {doll.modelo && doll.modelo.length > 40 
                        ? `${doll.modelo.substring(0, 40)}...` 
                        : doll.modelo || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {doll.personaje || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {doll.anyo || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        doll.estado || ""
                      )}`}
                    >
                      {doll.estado === 'guardada' && '💾 '}
                      {doll.estado === 'a la venta' && '🏪 '}
                      {doll.estado === 'vendida' && '✅ '}
                      {doll.estado === 'fuera' && '❌ '}
                      {doll.estado || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {doll.precio_compra ? `${Number(doll.precio_compra).toFixed(2)}€` : '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {doll.precio_venta ? `${Number(doll.precio_venta).toFixed(2)}€` : '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600 max-w-xs truncate" title={doll.comentarios || ''}>
                      {doll.comentarios || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openDollDetail(doll)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Ver detalles"
                      >
                        👁️ Ver
                      </button>
                      <button
                        onClick={() => openEditDoll(doll)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors"
                        title="Editar muñeca"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(doll)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                        title="Eliminar muñeca"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {dollToDelete && (
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
                  ¿Estás seguro de que deseas eliminar la muñeca:
                </p>
                <p className="text-base font-semibold text-gray-900 mb-2">
                  "{dollToDelete.nombre}"?
                </p>
                {dollToDelete.imagen && (
                  <p className="text-xs text-yellow-600 mb-1">
                    ⚠️ También se eliminará su imagen
                  </p>
                )}
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

export default DollsList;
