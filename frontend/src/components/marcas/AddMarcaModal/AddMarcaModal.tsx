import React, { useState } from 'react';

interface AddMarcaModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onMarcaAdded: (marca: { nombre: string; fabricante?: string }) => void;
}

const AddMarcaModal: React.FC<AddMarcaModalProps> = ({ isOpen, closeModal, onMarcaAdded }) => {
  const [nombre, setNombre] = useState('');
  const [fabricante, setFabricante] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMarcaAdded({ nombre, fabricante });
    setNombre('');
    setFabricante('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Añadir Nueva Marca</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Fabricante</label>
            <input
              type="text"
              value={fabricante}
              onChange={(e) => setFabricante(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMarcaModal;