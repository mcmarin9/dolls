import React, { useState, useMemo } from "react";
import { deleteImage } from "../../../services/api";
import { Doll } from "../../../types/Doll";
import { getStatusStyle } from "../../../utils/styleUtils";
import { Marca } from "../../../types/Marca";

interface DollsListProps {
  dolls: Doll[];
  brands: Marca[];
  onDelete: (id: number) => void;
  onView: (doll: Doll) => void;
  onEdit: (doll: Doll) => void;
}

const DollsList: React.FC<DollsListProps> = ({
  dolls,
  brands,
  onView,
  onDelete,
  onEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [dollToDelete, setDollToDelete] = useState<Doll | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const ESTADOS = {
    guardada: "Guardada",
    "a la venta": "A la venta",
    vendida: "Vendida",
    fuera: "Fuera",
  };

  const filteredDolls = useMemo(
    () =>
      dolls.filter((doll) => {
        const matchesName = doll.nombre
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesBrand =
          !selectedBrand || doll.marca_nombre === selectedBrand;
        const matchesManufacturer =
          !selectedManufacturer ||
          doll.fabricante_nombre === selectedManufacturer;
        const matchesStatus = !selectedStatus || doll.estado === selectedStatus;
        return (
          matchesName && matchesBrand && matchesManufacturer && matchesStatus
        );
      }),
    [dolls, searchTerm, selectedBrand, selectedManufacturer, selectedStatus]
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
        onDelete(doll.id);
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

  return (
    <div className="h-[calc(100vh-300px)]">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-50 p-2 border rounded-lg"
        />
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-50 p-2 border rounded-lg"
        >
          <option value="">Todas las marcas</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.nombre}>
              {brand.nombre}
            </option>
          ))}
        </select>
        <select
          value={selectedManufacturer}
          onChange={(e) => setSelectedManufacturer(e.target.value)}
          className="w-50 p-2 border rounded-lg"
        >
          <option value="">Todos los fabricantes</option>
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer} value={manufacturer}>
              {manufacturer}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-50 p-2 border rounded-lg"
        >
          <option value="">Todos los estados</option>
          {Object.entries(ESTADOS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="relative h-full rounded-lg border border-gray-200">
        <div className="overflow-auto h-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("nombre")}
                >
                  Nombre {getSortIcon("nombre")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("marca_nombre")}
                >
                  Marca {getSortIcon("marca_nombre")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("fabricante_nombre")}
                >
                  Fabricante {getSortIcon("fabricante_nombre")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("modelo")}
                >
                  Modelo {getSortIcon("modelo")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("personaje")}
                >
                  Personaje {getSortIcon("personaje")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("anyo")}
                >
                  Año {getSortIcon("anyo")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("estado")}
                >
                  Estado {getSortIcon("estado")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("precio_compra")}
                >
                  Precio compra {getSortIcon("precio_compra")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("precio_venta")}
                >
                  Precio venta {getSortIcon("precio_venta")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("comentarios")}
                >
                  Comentarios {getSortIcon("comentarios")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedDolls.map((doll) => (
                <tr key={doll.id}>
                  <td className="px-6 py-4 whitespace-wrap">
                    {doll.imagen ? (
                      <img
                        src={`http://localhost:5000${doll.imagen}`}
                        alt={doll.nombre}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400">No imagen</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-900">
                    {doll.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-600">
                    {doll.marca_nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-600">
                    {doll.fabricante_nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-600">
                    {doll.modelo}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-600">
                    {doll.personaje}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-600">
                    {doll.anyo}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm">
                    <span
                      className={`px-2 py-1 rounded ${getStatusStyle(
                        doll.estado || ""
                      )}`}
                    >
                      {doll.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-600">
                    {doll.precio_compra}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-600">
                    {doll.precio_venta}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap text-sm text-gray-600">
                    {doll.comentarios}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => onView(doll)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => onEdit(doll)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteClick(doll)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {dollToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Confirmar eliminación
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ¿Estás seguro de que deseas eliminar {dollToDelete.nombre}?
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

export default DollsList;
