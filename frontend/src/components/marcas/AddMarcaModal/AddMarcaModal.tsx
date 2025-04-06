import React, { useState, useEffect } from 'react';
import { Fabricante } from '../../../types/Fabricante';
import { getFabricantes } from '../../../services/api';

interface AddMarcaModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onMarcaAdded: (marca: { nombre: string; fabricanteIds: number[] }) => void;
}

const AddMarcaModal: React.FC<AddMarcaModalProps> = ({ isOpen, closeModal, onMarcaAdded }) => {
  const [nombre, setNombre] = useState('');
  const [fabricantes, setFabricantes] = useState<Fabricante[]>([]);
  const [selectedFabricantes, setSelectedFabricantes] = useState<number[]>([]);

  useEffect(() => {
    const fetchFabricantes = async () => {
      try {
        const data = await getFabricantes();
        setFabricantes(data);
      } catch (error) {
        console.error('Error al cargar fabricantes:', error);
      }
    };
  
    if (isOpen) {
      fetchFabricantes();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onMarcaAdded({ 
        nombre, 
        fabricanteIds: selectedFabricantes 
      });
      setNombre('');
      setSelectedFabricantes([]);
    } catch (error) {
      console.error('Error al crear marca:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleFabricanteChange = (fabricanteId: number) => {
    setSelectedFabricantes(prev => 
      prev.includes(fabricanteId)
        ? prev.filter(id => id !== fabricanteId)
        : [...prev, fabricanteId]
    );
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
            <label className="block text-gray-700 mb-2">Fabricantes</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {fabricantes.map((fabricante) => (
                <label key={fabricante.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFabricantes.includes(fabricante.id)}
                    onChange={() => handleFabricanteChange(fabricante.id)}
                    className="mr-2"
                  />
                  {fabricante.nombre}
                </label>
              ))}
            </div>
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