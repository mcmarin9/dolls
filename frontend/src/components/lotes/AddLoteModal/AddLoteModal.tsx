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
  const { dolls, closeLoteModal } = useApp();
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

    if (formData.precio_total <= 0) {
      setError("El precio total debe ser mayor que 0");
      setIsSubmitting(false);
      return;
    }

    const submitData = {
      ...formData,
      dolls: Array.isArray(formData.dolls) ? formData.dolls : [],
    };

    try {
      const response = await fetch("http://localhost:5000/api/lotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.error || "Error creating lote");
        return;
      }

      closeLoteModal();
    } catch (error) {
      console.error("Submission error:", error);
      setError("Error creating lote");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Crear Lote</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Tipo:</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="tipo"
                  value="compra"
                  checked={formData.tipo === "compra"}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Compra</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="tipo"
                  value="venta"
                  checked={formData.tipo === "venta"}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Venta</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Precio Total:</label>
            <input
              type="number"
              name="precio_total"
              value={formData.precio_total}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Muñecas Disponibles:</label>
            <input
              type="text"
              placeholder="Buscar muñeca por nombre o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2"
            />
            <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
              {filteredDolls.length > 0 ? (
                filteredDolls.map((doll) => (
                  <label key={doll.id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dolls.includes(doll.id!)}
                      onChange={() => handleDollSelection(doll.id!)}
                      className="mr-2"
                    />
                    <span className="text-sm">{doll.nombre} - {doll.marca_nombre}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-2">No se encontraron muñecas</p>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {formData.dolls.length} muñeca{formData.dolls.length !== 1 ? 's' : ''} seleccionada{formData.dolls.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded-md mr-2"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando..." : "Crear Lote"}
            </button>
          </div>
        </form>
      </div>
    </div>

    
  );
};

export default AddLoteModal;
