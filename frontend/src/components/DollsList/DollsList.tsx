import React, { useState, useMemo } from "react";
import { deleteImage } from "../../services/api";
import { Doll } from "../../types/Doll";
import { getStatusStyle } from "../../utils/styleUtils";
import { Marca } from "../../types/Marca";

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

  const filteredDolls = useMemo(
    () =>
      dolls.filter((doll) => {
        const matchesName = doll.nombre
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesBrand =
          !selectedBrand || doll.marca_nombre === selectedBrand;
        return matchesName && matchesBrand;
      }),
    [dolls, searchTerm, selectedBrand]
  );

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
      </div>
      <div className="relative h-full rounded-lg border border-gray-200">
        <div className="overflow-auto h-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personaje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Año
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comentarios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDolls.map((doll) => (
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
                      onClick={() => handleDelete(doll)}
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
    </div>
  );
};

export default DollsList;
