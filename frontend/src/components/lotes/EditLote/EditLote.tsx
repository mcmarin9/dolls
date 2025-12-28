import React, { useState } from "react";
import { Lote } from "../../../types/Lote";
import { useApp } from "../../../context";

interface EditLoteProps {
  isOpen: boolean;
  closeModal: () => void;
  lote: Lote;
}

const EditLote: React.FC<EditLoteProps> = ({
  isOpen,
  closeModal,
  lote,
}) => {
  const { dolls, editLote } = useApp();
  const [formData, setFormData] = useState<Lote>(lote);
  const [selectedDolls, setSelectedDolls] = useState<number[]>(
    lote.dolls?.map((d) => d.id!) || []
  );
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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
        doll_ids: selectedDolls,
      };

      await editLote(lote.id, updateData);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">✏️ Editar Lote</h2>
            <button
              onClick={closeModal}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body con scroll */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                📝 Nombre del Lote
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Lote Barbie Diciembre 2024"
                required
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🏷️ Tipo de Lote
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.tipo === "compra" 
                    ? "border-orange-500 bg-orange-50 shadow-md" 
                    : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/50"
                }`}>
                  <input
                    type="radio"
                    name="tipo"
                    value="compra"
                    checked={formData.tipo === "compra"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="text-2xl">🛒</span>
                    <span className={formData.tipo === "compra" ? "text-orange-700" : "text-slate-600"}>
                      Compra
                    </span>
                  </span>
                </label>
                <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.tipo === "venta" 
                    ? "border-emerald-500 bg-emerald-50 shadow-md" 
                    : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}>
                  <input
                    type="radio"
                    name="tipo"
                    value="venta"
                    checked={formData.tipo === "venta"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="text-2xl">💰</span>
                    <span className={formData.tipo === "venta" ? "text-emerald-700" : "text-slate-600"}>
                      Venta
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                💵 Precio Total
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">€</span>
                <input
                  type="number"
                  name="precio_total"
                  value={formData.precio_total}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Muñecas */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🎎 Seleccionar Muñecas
              </label>
              <div className="border-2 border-slate-200 rounded-lg p-2 max-h-60 overflow-y-auto bg-slate-50">
                {dolls.length > 0 ? (
                  <div className="space-y-1">
                    {dolls.map((doll) => (
                      <label 
                        key={doll.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          selectedDolls.includes(doll.id!) 
                            ? "bg-blue-100 border border-blue-300" 
                            : "bg-white hover:bg-slate-100 border border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDolls.includes(doll.id!)}
                          onChange={() => handleDollSelection(doll.id!)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{doll.nombre}</p>
                          <p className="text-xs text-slate-500">{doll.marca_nombre}</p>
                        </div>
                        {selectedDolls.includes(doll.id!) && (
                          <span className="text-blue-600 text-xl">✓</span>
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-sm">No hay muñecas disponibles</p>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <span className="text-sm font-semibold text-slate-700">
                  Muñecas seleccionadas:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {selectedDolls.length}
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLote;
