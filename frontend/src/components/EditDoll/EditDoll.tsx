import React, { useState, useEffect } from "react";
import { Doll } from "../../types/Doll";

interface EditDollProps {
  isOpen: boolean;
  closeModal: () => void;
  doll: Doll;
  onEdit: (id: number, formData: FormData) => Promise<void>;
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Editar Muñeca</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="mb-4">
            <label className="block mb-1">Estado</label>
            <select
  name="estado"
  value={formData.estado || 'guardada'}
  onChange={handleChange}
  required
  className="w-full border rounded p-2"
>
  <option value="guardada">Guardada</option>
  <option value="a la venta">A la venta</option>
  <option value="vendida">Vendida</option>
</select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Comentarios</label>
            <textarea
              name="comentarios"
              value={formData.comentarios || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
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
          <div className="flex justify-end gap-2">
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