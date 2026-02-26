import React, { useState, useEffect } from "react";
import { Doll } from "../../../types/Doll";
import MarcaSelector from "../../common/MarcaSelector/MarcaSelector";
import {
  checkEnLoteCompra,
  checkEnLoteVenta,
} from "../../../utils/checkIfLote";
import { useApp } from "../../../context";

interface EditDollProps {
  isOpen: boolean;
  closeModal: () => void;
  doll: Doll;
}

interface PricingMethod {
  compra: "individual" | "lote" | null;
  venta: "individual" | "lote" | null;
}

const EditDoll: React.FC<EditDollProps> = ({
  isOpen,
  closeModal,
  doll,
}) => {
  const { editDoll } = useApp();
  const [formData, setFormData] = useState<Doll>(doll);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [enLoteCompraState, setEnLoteCompraState] = useState(false);
  const [enLoteVentaState, setEnLoteVentaState] = useState(false);
  const [pricingMethod, setPricingMethod] = useState<PricingMethod>({
    compra: null,
    venta: null, 
  });
  const [ventaMessage, setVentaMessage] = useState<string>("");

  useEffect(() => {
    setFormData(doll);
  }, [doll]);

  useEffect(() => {
    const verificarLotes = async () => {
      const [esLoteCompra, esLoteVenta] = await Promise.all([
        checkEnLoteCompra(doll),
        checkEnLoteVenta(doll),
      ]);
      setEnLoteCompraState(esLoteCompra);
      setEnLoteVentaState(esLoteVenta);

      // Update pricingMethod based on lot status and prices
      setPricingMethod({
        compra: esLoteCompra
          ? "lote"
          : doll.precio_compra !== null && doll.precio_compra !== undefined
          ? "individual"
          : null,
        venta: esLoteVenta
          ? "lote"
          : doll.precio_venta !== null && doll.precio_venta !== undefined
          ? "individual"
          : null,
      });
    };

    if (doll.id) {
      verificarLotes();
    }
  }, [doll, doll.id, doll.precio_compra, doll.precio_venta]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    // Si es el precio de venta y es individual
    if (name === "precio_venta" && pricingMethod.venta === "individual") {
      const precioVenta = value === "" ? undefined : parseFloat(value);
      if (precioVenta && precioVenta > 0) {
        setFormData((prev) => ({
          ...prev,
          precio_venta: precioVenta,
          estado: "vendida",
        }));
        setVentaMessage(
          "El estado se ha actualizado automáticamente a 'Vendida'"
        );
      } else {
        setFormData((prev) => ({
          ...prev,
          precio_venta: undefined // Usar undefined en lugar de null
        }));
        setVentaMessage("");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "anyo" || name === "marca_id" || name === "precio_compra" || name === "precio_venta"
          ? value === "" ? undefined : parseFloat(value) // Usar undefined en lugar de null
          : value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleMarcaChange = (marcaId: number) => {
    setFormData((prev) => ({
      ...prev,
      marca_id: marcaId,
    }));
  };

  const handleFabricanteChange = (fabricanteId: number) => {
    setFormData((prev) => ({
      ...prev,
      fabricante_id: fabricanteId,
    }));
  };

  const handleNumberInputWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doll.id) return;

    const submitData = new FormData();
    submitData.append("nombre", formData.nombre.trim());
    submitData.append("marca_id", formData.marca_id.toString());
    if (formData.fabricante_id && typeof formData.fabricante_id === "number") {
      submitData.append("fabricante_id", formData.fabricante_id.toString());
    }
    submitData.append("modelo", formData.modelo.trim());
    submitData.append("personaje", formData.personaje.trim());
    submitData.append("anyo", formData.anyo.toString());
    submitData.append("estado", formData.estado || doll.estado || "guardada");

    const comentarios = formData.comentarios?.trim() ?? "";
    submitData.append("comentarios", comentarios);

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

    if (imageFile) {
      submitData.append("imagen", imageFile);
    }

    try {
      await editDoll(doll.id, submitData);
      closeModal();
    } catch (error) {
      console.error("Error updating doll:", error);
      alert("Error al actualizar la muñeca");
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
              <span className="text-3xl">✏️</span>
              Editar Muñeca
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
                    selectedMarcaId={formData.marca_id}
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
                    value={formData.anyo}
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
                      } ${enLoteCompraState ? "opacity-50 cursor-not-allowed" : ""}`}>
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
                          disabled={enLoteCompraState}
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
                      } ${enLoteCompraState ? "opacity-50 cursor-not-allowed" : ""}`}>
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
                          disabled={enLoteCompraState}
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
                          onWheel={handleNumberInputWheel}
                          step="0.01"
                          min="0"
                          disabled={enLoteCompraState}
                          className="w-full pl-10 pr-4 py-2.5 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                    {pricingMethod.compra === "lote" && (
                      <div>
                        {enLoteCompraState ? (
                          <>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">€</span>
                              <input
                                type="number"
                                value={formData.precio_compra || ""}
                                disabled
                                className="w-full pl-10 pr-4 py-2.5 border border-orange-200 rounded-lg bg-slate-100 text-slate-500"
                              />
                            </div>
                            <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-2 flex items-center gap-2">
                              <span className="text-orange-600">🔒</span>
                              <span className="text-xs text-orange-700 font-medium">Precio establecido en lote</span>
                            </div>
                          </>
                        ) : (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                            <span className="text-blue-600 text-lg">ℹ️</span>
                            <p className="text-sm text-blue-700">
                              Añade la muñeca a un <strong>lote de compra</strong> para establecer su precio.
                            </p>
                          </div>
                        )}
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
                      } ${enLoteVentaState ? "opacity-50 cursor-not-allowed" : ""}`}>
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
                          disabled={enLoteVentaState}
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
                      } ${enLoteVentaState ? "opacity-50 cursor-not-allowed" : ""}`}>
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
                          disabled={enLoteVentaState}
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
                      <div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">€</span>
                          <input
                            type="number"
                            name="precio_venta"
                            value={formData.precio_venta || ""}
                            onChange={handleChange}
                            onWheel={handleNumberInputWheel}
                            step="0.01"
                            min="0"
                            disabled={enLoteVentaState}
                            className="w-full pl-10 pr-4 py-2.5 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                            placeholder="0.00"
                          />
                        </div>
                        {ventaMessage && (
                          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-start gap-2">
                            <span className="text-yellow-600 text-lg">⚠️</span>
                            <span className="text-sm text-yellow-700">{ventaMessage}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {pricingMethod.venta === "lote" && (
                      <div>
                        {enLoteVentaState ? (
                          <>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">€</span>
                              <input
                                type="number"
                                value={formData.precio_venta || ""}
                                disabled
                                className="w-full pl-10 pr-4 py-2.5 border border-emerald-200 rounded-lg bg-slate-100 text-slate-500"
                              />
                            </div>
                            <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center gap-2">
                              <span className="text-emerald-600">🔒</span>
                              <span className="text-xs text-emerald-700 font-medium">Precio establecido en lote</span>
                            </div>
                          </>
                        ) : (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                            <span className="text-blue-600 text-lg">ℹ️</span>
                            <p className="text-sm text-blue-700">
                              Añade la muñeca a un <strong>lote de venta</strong> para establecer su precio.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
                  {formData.imagen && typeof formData.imagen === "string" && (
                    <div className="mb-3">
                      <p className="text-xs text-slate-600 mb-2">Imagen actual:</p>
                      <img
                        src={`http://localhost:5000${formData.imagen}`}
                        alt="Current"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-slate-200 shadow-sm"
                      />
                    </div>
                  )}
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
                        <span>Nueva imagen: {imageFile.name}</span>
                      </p>
                    )}
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
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDoll;
