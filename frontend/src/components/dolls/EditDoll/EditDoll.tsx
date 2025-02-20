import React, { useState, useEffect } from "react";
import { Doll } from "../../../types/Doll";

interface EditDollProps {
  isOpen: boolean;
  closeModal: () => void;
  doll: Doll;
  onEdit: (id: number, formData: FormData) => Promise<void>;
}

interface PricingMethod {
  compra: "individual" | "lote" | null;
  venta: "individual" | "lote" | null;
}

const EditDoll: React.FC<EditDollProps> = ({
  isOpen,
  closeModal,
  doll,
  onEdit,
}) => {
  const [formData, setFormData] = useState<Doll>(doll);
  const [marcas, setMarcas] = useState<{ id: number; nombre: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pricingMethod, setPricingMethod] = useState<PricingMethod>({
    compra: doll.precio_compra ? "individual" : "lote",
    venta: doll.precio_venta ? "individual" : "lote",
  });

  useEffect(() => {
    setFormData(doll);
  }, [doll]);

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/marcas");
        if (!response.ok) throw new Error("Failed to fetch marcas");
        const data = await response.json();
        setMarcas(data);
      } catch (error) {
        console.error("Error fetching marcas:", error);
      }
    };

    if (isOpen) {
      fetchMarcas();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "anyo" || name === "marca_id" ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!doll.id) return;
  
    const submitData = new FormData();
    submitData.append("nombre", formData.nombre);
    submitData.append("marca_id", formData.marca_id.toString());
    submitData.append("modelo", formData.modelo);
    submitData.append("personaje", formData.personaje);
    submitData.append("anyo", formData.anyo.toString());
    submitData.append("estado", formData.estado || doll.estado || "guardada");
  
    // Append prices based on pricing method
    if (pricingMethod.compra === "individual" && formData.precio_compra !== undefined) {
      submitData.append("precio_compra", formData.precio_compra.toString());
    }
  
    if (pricingMethod.venta === "individual" && formData.precio_venta !== undefined) {
      submitData.append("precio_venta", formData.precio_venta.toString());
    }
  
    if (formData.comentarios) {
      submitData.append("comentarios", formData.comentarios);
    }
  
    if (imageFile) {
      submitData.append("imagen", imageFile);
    }
  
    try {
      await onEdit(doll.id, submitData);
      closeModal();
    } catch (error) {
      console.error("Error updating doll:", error);
      alert("Error al actualizar la muñeca");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6">
        <h2 className="text-xl font-semibold mb-4">Editar Muñeca</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Columna izquierda - Información básica */}
            <div>
              <h3 className="font-medium mb-3 text-gray-700">Información Básica</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Marca</label>
                  <select
                    name="marca_id"
                    value={formData.marca_id}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="">Seleccionar marca</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Personaje</label>
                  <input
                    type="text"
                    name="personaje"
                    value={formData.personaje}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Año</label>
                  <input
                    type="number"
                    name="anyo"
                    value={formData.anyo}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block mb-1">Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="guardada">Guardada</option>
                    <option value="a la venta">A la venta</option>
                    <option value="vendida">Vendida</option>
                    <option value="fuera">Fuera</option>
                  </select>
                </div>
              </div>
            </div>
  
            {/* Columna derecha - Precios y detalles adicionales */}
            <div>
              <h3 className="font-medium mb-3 text-gray-700">Precios y Detalles</h3>
              <div className="space-y-4">
                {/* Precio de Compra */}
                <div className="p-3 bg-gray-50 rounded">
                  <label className="block mb-2 font-medium">Tipo de Compra</label>
                  <div className="flex items-center space-x-4 mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="precio_compra_method"
                        value="individual"
                        checked={pricingMethod.compra === "individual"}
                        onChange={() => setPricingMethod(prev => ({ ...prev, compra: "individual" }))}
                        className="mr-2"
                      />
                      <span>Individual</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="precio_compra_method"
                        value="lote"
                        checked={pricingMethod.compra === "lote"}
                        onChange={() => setPricingMethod(prev => ({ ...prev, compra: "lote" }))}
                        className="mr-2"
                      />
                      <span>Por Lote</span>
                    </label>
                  </div>
                  {pricingMethod.compra === "individual" && (
                    <input
                      type="number"
                      name="precio_compra"
                      value={formData.precio_compra || ""}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full border rounded p-2"
                    />
                  )}
                  {pricingMethod.compra === "lote" && (
                    <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      ℹ️ No olvides añadir la muñeca a un lote de compra para establecer su precio.
                    </p>
                  )}
                </div>
  
                {/* Precio de Venta */}
                <div className="p-3 bg-gray-50 rounded">
                  <label className="block mb-2 font-medium">Tipo de Venta</label>
                  <div className="flex items-center space-x-4 mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="precio_venta_method"
                        value="individual"
                        checked={pricingMethod.venta === "individual"}
                        onChange={() => setPricingMethod(prev => ({ ...prev, venta: "individual" }))}
                        className="mr-2"
                      />
                      <span>Individual</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="precio_venta_method"
                        value="lote"
                        checked={pricingMethod.venta === "lote"}
                        onChange={() => setPricingMethod(prev => ({ ...prev, venta: "lote" }))}
                        className="mr-2"
                      />
                      <span>Por Lote</span>
                    </label>
                  </div>
                  {pricingMethod.venta === "individual" && (
                    <input
                      type="number"
                      name="precio_venta"
                      value={formData.precio_venta || ""}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full border rounded p-2"
                    />
                  )}
                  {pricingMethod.venta === "lote" && (
                    <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      ℹ️ No olvides añadir la muñeca a un lote de venta para establecer su precio.
                    </p>
                  )}
                </div>
  
                {/* Comentarios e Imagen */}
                <div>
                  <label className="block mb-1">Comentarios</label>
                  <textarea
                    name="comentarios"
                    value={formData.comentarios || ""}
                    onChange={handleChange}
                    className="w-full border rounded p-2 h-24"
                  />
                </div>
                <div>
                  <label className="block mb-1">Imagen</label>
                  {formData.imagen && typeof formData.imagen === "string" && (
                    <img
                      src={`http://localhost:5000${formData.imagen}`}
                      alt="Current"
                      className="w-32 h-32 object-cover mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
  
          {/* Botones de acción */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoll;
