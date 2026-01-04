import React, { useState } from "react";
import { Doll } from "../../../types/Doll";
import MarcaSelector from "../../common/MarcaSelector/MarcaSelector";
import { useApp } from "../../../context";

interface AddDollModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

interface PricingMethod {
  compra: "individual" | "lote" | null;
  venta: "individual" | "lote" | null;
}

const AddDollModal: React.FC<AddDollModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const { addDoll } = useApp();
  const [formData, setFormData] = useState<Partial<Doll>>({
    nombre: "",
    marca_id: 0,
    fabricante_id: undefined,
    modelo: "",
    personaje: "",
    anyo: new Date().getFullYear(),
    estado: "guardada",
    comentarios: "",
    imagen: "",
    precio_compra: undefined,
    precio_venta: undefined,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pricingMethod, setPricingMethod] = useState<PricingMethod>({
    compra: null,
    venta: null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "anyo"
          ? parseInt(value)
          : name === "precio_compra" || name === "precio_venta"
          ? value === ""
            ? undefined
            : parseFloat(value)
          : value,
    }));
  };

  const handleMarcaChange = (marcaId: number) => {
    setFormData((prev) => ({
      ...prev,
      marca_id: marcaId,
      fabricante_id: undefined,
    }));
  };

  const handleFabricanteChange = (fabricanteId: number) => {
    setFormData((prev) => ({
      ...prev,
      fabricante_id: fabricanteId,
    }));
  };

  // Update handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.nombre ||
      !formData.marca_id ||
      !formData.modelo ||
      !formData.personaje ||
      !formData.anyo ||
      !formData.estado
    ) {
      alert("Por favor, rellena todos los campos requeridos");
      return;
    }

    const submitData = new FormData();

    // Append required fields
    submitData.append("nombre", formData.nombre);
    submitData.append("marca_id", formData.marca_id.toString());
    submitData.append("modelo", formData.modelo);
    submitData.append("personaje", formData.personaje);
    submitData.append("anyo", formData.anyo.toString());
    submitData.append("estado", formData.estado);

    // Append prices based on pricing method
    if (
      pricingMethod.compra === "individual" &&
      formData.precio_compra !== undefined
    ) {
      submitData.append("precio_compra", formData.precio_compra.toString());
    }

    if (
      pricingMethod.venta === "individual" &&
      formData.precio_venta !== undefined
    ) {
      submitData.append("precio_venta", formData.precio_venta.toString());
    }

    // Append optional fields
    if (formData.comentarios) {
      submitData.append("comentarios", formData.comentarios);
    }

    if (imageFile) {
      submitData.append("imagen", imageFile);
    }

    try {
      await addDoll(submitData);
      // Reset form
      setFormData({
        nombre: "",
        marca_id: 0,
        modelo: "",
        personaje: "",
        anyo: new Date().getFullYear(),
        estado: "guardada",
        comentarios: "",
        imagen: "",
        precio_compra: undefined,
        precio_venta: undefined,
      });
      setImageFile(null);
      setPricingMethod({ compra: null, venta: null });
    } catch (error: unknown) {
      console.error("Error details:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error adding doll";
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🎎</span>
              Añadir Nueva Muñeca
            </h2>
            <button
              onClick={closeModal}
              type="button"
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body con scroll */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna izquierda - Información básica */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-pink-200">
                  <span className="text-2xl">📋</span>
                  <h3 className="font-bold text-lg text-slate-800">Información Básica</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ✏️ Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nombre de la muñeca"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    🏷️ Marca y Fabricante
                  </label>
                  <MarcaSelector
                    selectedMarcaId={formData.marca_id || undefined}
                    selectedFabricanteId={formData.fabricante_id}
                    onMarcaChange={handleMarcaChange}
                    onFabricanteChange={handleFabricanteChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    📦 Modelo
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Modelo de la muñeca"
                  />
                </div>


                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    👤 Personaje
                  </label>
                  <input
                    type="text"
                    name="personaje"
                    value={formData.personaje}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Nombre del personaje"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    📅 Año
                  </label>
                  <input
                    type="number"
                    name="anyo"
                    value={formData.anyo || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Año de fabricación"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    📊 Estado
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.estado === "guardada"
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="estado"
                        value="guardada"
                        checked={formData.estado === "guardada"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-xl">📦</span>
                      <span className={`font-semibold text-sm ${
                        formData.estado === "guardada" ? "text-blue-700" : "text-slate-600"
                      }`}>
                        Guardada
                      </span>
                    </label>
                    <label
                      className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.estado === "a la venta"
                          ? "border-amber-500 bg-amber-50 shadow-md"
                          : "border-slate-200 hover:border-amber-300 hover:bg-amber-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="estado"
                        value="a la venta"
                        checked={formData.estado === "a la venta"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-xl">🏷️</span>
                      <span className={`font-semibold text-sm ${
                        formData.estado === "a la venta" ? "text-amber-700" : "text-slate-600"
                      }`}>
                        A la venta
                      </span>
                    </label>
                    <label
                      className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.estado === "vendida"
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="estado"
                        value="vendida"
                        checked={formData.estado === "vendida"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-xl">✅</span>
                      <span className={`font-semibold text-sm ${
                        formData.estado === "vendida" ? "text-emerald-700" : "text-slate-600"
                      }`}>
                        Vendida
                      </span>
                    </label>
                    <label
                      className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.estado === "fuera"
                          ? "border-slate-500 bg-slate-50 shadow-md"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="estado"
                        value="fuera"
                        checked={formData.estado === "fuera"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-xl">📤</span>
                      <span className={`font-semibold text-sm ${
                        formData.estado === "fuera" ? "text-slate-700" : "text-slate-600"
                      }`}>
                        Fuera
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Precios y detalles */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b-2 border-purple-200">
                  <span className="text-2xl">💰</span>
                  <h3 className="font-bold text-lg text-slate-800">Precios y Detalles</h3>
                </div>

                {/* Precio de Compra */}
                <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl p-4">
                  <label className="block text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">🛒</span>
                    Precio de Compra
                  </label>
                  <div className="flex gap-3 mb-3">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      pricingMethod.compra === "individual"
                        ? "border-orange-500 bg-orange-100 shadow-md"
                        : "border-orange-200 hover:border-orange-400 hover:bg-orange-50"
                    }`}>
                      <input
                        type="radio"
                        name="precio_compra_method"
                        value="individual"
                        checked={pricingMethod.compra === "individual"}
                        onChange={() =>
                          setPricingMethod((prev) => ({
                            ...prev,
                            compra: "individual",
                          }))
                        }
                        className="sr-only"
                      />
                      <span className={`font-semibold text-sm ${
                        pricingMethod.compra === "individual" ? "text-orange-700" : "text-slate-600"
                      }`}>
                        Individual
                      </span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      pricingMethod.compra === "lote"
                        ? "border-orange-500 bg-orange-100 shadow-md"
                        : "border-orange-200 hover:border-orange-400 hover:bg-orange-50"
                    }`}>
                      <input
                        type="radio"
                        name="precio_compra_method"
                        value="lote"
                        checked={pricingMethod.compra === "lote"}
                        onChange={() =>
                          setPricingMethod((prev) => ({
                            ...prev,
                            compra: "lote",
                          }))
                        }
                        className="sr-only"
                      />
                      <span className={`font-semibold text-sm ${
                        pricingMethod.compra === "lote" ? "text-orange-700" : "text-slate-600"
                      }`}>
                        Por Lote
                      </span>
                    </label>
                  </div>
                  {pricingMethod.compra === "individual" && (
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">€</span>
                      <input
                        type="number"
                        name="precio_compra"
                        value={formData.precio_compra || ""}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-2.5 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                  {pricingMethod.compra === "lote" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                      <span className="text-blue-600 text-lg">ℹ️</span>
                      <p className="text-sm text-blue-700">
                        Añade la muñeca a un <strong>lote de compra</strong> para establecer su precio.
                      </p>
                    </div>
                  )}
                </div>

                {/* Precio de Venta */}
                <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-xl p-4">
                  <label className="block text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">💵</span>
                    Precio de Venta
                  </label>
                  <div className="flex gap-3 mb-3">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      pricingMethod.venta === "individual"
                        ? "border-emerald-500 bg-emerald-100 shadow-md"
                        : "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50"
                    }`}>
                      <input
                        type="radio"
                        name="precio_venta_method"
                        value="individual"
                        checked={pricingMethod.venta === "individual"}
                        onChange={() =>
                          setPricingMethod((prev) => ({
                            ...prev,
                            venta: "individual",
                          }))
                        }
                        className="sr-only"
                      />
                      <span className={`font-semibold text-sm ${
                        pricingMethod.venta === "individual" ? "text-emerald-700" : "text-slate-600"
                      }`}>
                        Individual
                      </span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      pricingMethod.venta === "lote"
                        ? "border-emerald-500 bg-emerald-100 shadow-md"
                        : "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50"
                    }`}>
                      <input
                        type="radio"
                        name="precio_venta_method"
                        value="lote"
                        checked={pricingMethod.venta === "lote"}
                        onChange={() =>
                          setPricingMethod((prev) => ({
                            ...prev,
                            venta: "lote",
                          }))
                        }
                        className="sr-only"
                      />
                      <span className={`font-semibold text-sm ${
                        pricingMethod.venta === "lote" ? "text-emerald-700" : "text-slate-600"
                      }`}>
                        Por Lote
                      </span>
                    </label>
                  </div>
                  {pricingMethod.venta === "individual" && (
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">€</span>
                      <input
                        type="number"
                        name="precio_venta"
                        value={formData.precio_venta || ""}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-2.5 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                  {pricingMethod.venta === "lote" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                      <span className="text-blue-600 text-lg">ℹ️</span>
                      <p className="text-sm text-blue-700">
                        Añade la muñeca a un <strong>lote de venta</strong> para establecer su precio.
                      </p>
                    </div>
                  )}
                </div>

                {/* Comentarios */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    💬 Comentarios
                  </label>
                  <textarea
                    name="comentarios"
                    value={formData.comentarios || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Notas adicionales sobre la muñeca..."
                  />
                </div>

                {/* Imagen */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    📸 Imagen
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-pink-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
                    />
                    {imageFile && (
                      <p className="mt-2 text-sm text-emerald-600 flex items-center gap-2">
                        <span>✓</span>
                        <span>Archivo: {imageFile.name}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 -mx-6 -mb-6 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-700 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-purple-800 transition-colors"
              >
                Añadir Muñeca
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDollModal;
