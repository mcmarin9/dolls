import React, { useState, useEffect } from "react";
import { Lote } from "../../../types/Lote";
import { Doll } from "../../../types/Doll";
import axios from "axios";
import { useApp } from "../../../context";

interface AddLoteModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const initialFormData = {
  nombre: "",
  tipo: "Seleccionar tipo",
  precio_total: 0,
  dolls: [] as number[],
};

const AddLoteModal: React.FC<AddLoteModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const { dolls, addLote } = useApp();
  const [formData, setFormData] = useState(initialFormData);
  const [availableDolls, setAvailableDolls] = useState<Doll[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");


  useEffect(() => {
    if (isOpen) {
      setAvailableDolls(dolls);
      setFormData(initialFormData);
      setError("");
    }
  }, [isOpen, dolls]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "precio_total" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleDollSelection = (dollId: number) => {
    setFormData((prev) => {
      const updatedDolls = prev.dolls.includes(dollId)
        ? prev.dolls.filter((id) => id !== dollId)
        : [...prev.dolls, dollId];
      return { ...prev, dolls: updatedDolls };
    });
  };

  const filteredDolls = availableDolls.filter((doll) =>
    `${doll.nombre} ${doll.marca_nombre}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (formData.tipo === "Seleccionar tipo") {
      setError("Debes seleccionar un tipo de lote");
      setIsSubmitting(false);
      return;
    }

    if (formData.precio_total <= 0) {
      setError("El precio total debe ser mayor que 0");
      setIsSubmitting(false);
      return;
    }

    if (formData.dolls.length === 0) {
      setError("Debes seleccionar al menos una muñeca");
      setIsSubmitting(false);
      return;
    }

    try {
      await addLote({
        nombre: formData.nombre,
        tipo: formData.tipo as "compra" | "venta",
        precio_total: formData.precio_total,
        dolls: formData.dolls,
      });
      closeModal();
    } catch (error) {
      console.error("Submission error:", error);
      setError("Error al crear el lote");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">📦 Crear Nuevo Lote</h2>
            <button
              onClick={closeModal}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              disabled={isSubmitting}
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
              <input
                type="text"
                placeholder="🔍 Buscar por nombre o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="border-2 border-slate-200 rounded-lg p-2 max-h-60 overflow-y-auto bg-slate-50">
                {filteredDolls.length > 0 ? (
                  <div className="space-y-1">
                    {filteredDolls.map((doll) => (
                      <label 
                        key={doll.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          formData.dolls.includes(doll.id!) 
                            ? "bg-blue-100 border border-blue-300" 
                            : "bg-white hover:bg-slate-100 border border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.dolls.includes(doll.id!)}
                          onChange={() => handleDollSelection(doll.id!)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{doll.nombre}</p>
                          <p className="text-xs text-slate-500">{doll.marca_nombre}</p>
                        </div>
                        {formData.dolls.includes(doll.id!) && (
                          <span className="text-blue-600 text-xl">✓</span>
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-sm">No se encontraron muñecas</p>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <span className="text-sm font-semibold text-slate-700">
                  Muñecas seleccionadas:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {formData.dolls.length}
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
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creando...
              </>
            ) : (
              "Crear Lote"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLoteModal;
