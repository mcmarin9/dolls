import React, { useState, useEffect } from "react";
import { Lote } from "../../../types/Lote";
import { Doll } from "../../../types/Doll";
import { getDolls } from "../../../services/api";

interface EditLoteProps {
  isOpen: boolean;
  closeModal: () => void;
  lote: Lote;
  onEdit: (
    id: number,
    loteData: Pick<Lote, "nombre" | "tipo"> & {
      precio_total: number;
      dolls: number[];
    }
  ) => Promise<void>;
}

const EditLote: React.FC<EditLoteProps> = ({
  isOpen,
  closeModal,
  lote,
  onEdit,
}) => {
  const [formData, setFormData] = useState<Lote>(lote);
  const [dolls, setDolls] = useState<Doll[]>([]);
  const [selectedDolls, setSelectedDolls] = useState<number[]>(
    lote.dolls?.map((d) => d.id!) || []
  );
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDolls = async () => {
      try {
        const dollsData = await getDolls();
        setDolls(dollsData);
      } catch {
        console.error("Error fetching dolls:", error);
        setError("Error al cargar las muñecas");
      }
    };

    if (isOpen) {
      fetchDolls();
    }
  }, [error, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "tipo"
          ? value.toLowerCase()
          : name === "precio_total"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleDollSelection = (dollId: number) => {
    setSelectedDolls((prev) =>
      prev.includes(dollId)
        ? prev.filter((id) => id !== dollId)
        : [...prev, dollId]
    );
  };

  const isValidTipo = (tipo: string): tipo is "compra" | "venta" => {
    return tipo === "compra" || tipo === "venta";
  };

  // In EditLote component
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate tipo
    if (!isValidTipo(formData.tipo)) {
      setError("El tipo debe ser 'compra' o 'venta'");
      setIsLoading(false);
      return;
    }

    if (selectedDolls.length < 2) {
      setError("Un lote debe contener al menos 2 muñecas");
      setIsLoading(false);
      return;
    }

    if (!formData.precio_total || formData.precio_total <= 0) {
      setError("El precio total debe ser mayor que 0");
      setIsLoading(false);
      return;
    }

    try {
      const updateData = {
        nombre: formData.nombre,
        tipo: formData.tipo, // Type is now guaranteed to be valid
        precio_total: Number(formData.precio_total),
        dolls: selectedDolls,
      };

      await onEdit(lote.id, updateData);
      closeModal();
    } catch (error) {
      console.error("Error updating lote:", error);
      setError(
        error instanceof Error ? error.message : "Error al actualizar el lote"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Editar Lote</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="compra">Compra</option>
              <option value="venta">Venta</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Precio Total</label>
            <input
              type="number"
              name="precio_total"
              value={formData.precio_total}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Seleccionar Muñecas</label>
            <div className="max-h-60 overflow-y-auto border rounded p-2">
              {dolls.map((doll) => (
                <div key={doll.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`doll-${doll.id}`}
                    checked={selectedDolls.includes(doll.id!)}
                    onChange={() => handleDollSelection(doll.id!)}
                    className="mr-2"
                  />
                  <label htmlFor={`doll-${doll.id}`}>
                    {doll.nombre} - {doll.marca_nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLote;
