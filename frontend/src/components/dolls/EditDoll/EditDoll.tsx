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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6">
        <h2 className="text-xl font-semibold mb-4">Editar Muñeca</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Columna izquierda - Información básica */}
            <div>
              <h3 className="font-medium mb-3 text-gray-700">
                Información Básica
              </h3>
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
                  <MarcaSelector
                    selectedMarcaId={formData.marca_id}
                    selectedFabricanteId={formData.fabricante_id}
                    onMarcaChange={handleMarcaChange}
                    onFabricanteChange={handleFabricanteChange}
                    className="w-full"
                  />
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
              <h3 className="font-medium mb-3 text-gray-700">
                Precios y Detalles
              </h3>
              <div className="space-y-4">
                {/* Precio de Compra */}
                <div className="p-3 bg-gray-50 rounded">
                  <label className="block mb-2 font-medium">
                    Tipo de Compra
                  </label>
                  <div className="flex items-center space-x-4 mb-2">
                    <label className="flex items-center">
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
                        className="mr-2"
                      />
                      <span
                        className={enLoteCompraState ? "text-gray-400" : ""}
                      >
                        Individual
                      </span>
                    </label>
                    <label className="flex items-center">
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
                        className="mr-2"
                      />
                      <span
                        className={enLoteCompraState ? "text-gray-400" : ""}
                      >
                        Por Lote
                      </span>
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
                      disabled={enLoteCompraState}
                      className="w-full border rounded p-2"
                      placeholder="Introduce el precio de compra"
                    />
                  )}
                  {pricingMethod.compra === "lote" && (
                    <div>
                      {enLoteCompraState ? (
                        <>
                          <input
                            type="number"
                            value={formData.precio_compra || ""}
                            disabled
                            className="w-full border rounded p-2 bg-gray-100"
                          />
                          <span className="text-sm text-orange-600 mt-1 block">
                            Precio establecido en lote
                          </span>
                        </>
                      ) : (
                        <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                          ℹ️ No olvides añadir la muñeca a un lote de compra
                          para establecer su precio.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Precio de Venta */}
                <div className="p-3 bg-gray-50 rounded">
                  <label className="block mb-2 font-medium">
                    Tipo de Venta
                  </label>
                  <div className="flex items-center space-x-4 mb-2">
                    <label className="flex items-center">
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
                        className="mr-2"
                      />
                      <span className={enLoteVentaState ? "text-gray-400" : ""}>
                        Individual
                      </span>
                    </label>
                    <label className="flex items-center">
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
                        className="mr-2"
                      />
                      <span className={enLoteVentaState ? "text-gray-400" : ""}>
                        Por Lote
                      </span>
                    </label>
                  </div>
                  {pricingMethod.venta === "individual" && (
                    <div>
                      <input
                        type="number"
                        name="precio_venta"
                        value={formData.precio_venta || ""}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        disabled={enLoteVentaState}
                        className="w-full border rounded p-2"
                        placeholder="Introduce el precio de venta"
                      />
                      {ventaMessage && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                          ⚠️ {ventaMessage}
                        </div>
                      )}
                    </div>
                  )}
                  {pricingMethod.venta === "lote" && (
                    <div>
                      {enLoteVentaState ? (
                        <>
                          <input
                            type="number"
                            value={formData.precio_venta || ""}
                            disabled
                            className="w-full border rounded p-2 bg-gray-100"
                          />
                          <span className="text-sm text-orange-600 mt-1 block">
                            Precio establecido en lote
                          </span>
                        </>
                      ) : (
                        <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                          ℹ️ No olvides añadir la muñeca a un lote de venta para
                          establecer su precio.
                        </p>
                      )}
                    </div>
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
