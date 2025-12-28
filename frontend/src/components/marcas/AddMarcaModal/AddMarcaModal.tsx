import React, { useState, useEffect } from 'react';
import { Fabricante } from '../../../types/Fabricante';
import { getFabricantes, createFabricante } from '../../../services/api';
import { useApp } from '../../../context';

interface AddMarcaModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const AddMarcaModal: React.FC<AddMarcaModalProps> = ({ isOpen, closeModal }) => {
  const { addMarca } = useApp();
  const [nombre, setNombre] = useState('');
  const [fabricantes, setFabricantes] = useState<Fabricante[]>([]);
  const [selectedFabricantes, setSelectedFabricantes] = useState<number[]>([]);
  const [showNewFabricanteForm, setShowNewFabricanteForm] = useState(false);
  const [newFabricanteName, setNewFabricanteName] = useState('');
  const [isCreatingFabricante, setIsCreatingFabricante] = useState(false);
  const [error, setError] = useState('');

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

  const handleAddNewFabricante = async () => {
    if (!newFabricanteName.trim()) {
      setError('El nombre del fabricante no puede estar vacío');
      return;
    }

    setIsCreatingFabricante(true);
    setError('');
    
    try {
      const newFabricante = await createFabricante(newFabricanteName.trim());
      setFabricantes([...fabricantes, newFabricante]);
      setSelectedFabricantes([...selectedFabricantes, newFabricante.id]);
      setNewFabricanteName('');
      setShowNewFabricanteForm(false);
    } catch (error) {
      console.error('Error al crear fabricante:', error);
      setError('Error al crear el fabricante');
    } finally {
      setIsCreatingFabricante(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMarca({ 
        nombre, 
        fabricanteIds: selectedFabricantes 
      });
      setNombre('');
      setSelectedFabricantes([]);
    } catch (error) {
      console.error('Error al crear marca:', error);
      alert('Error al crear la marca');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🏷️</span>
              Añadir Nueva Marca
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

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Nombre de la marca */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <span>✏️</span>
                Nombre de la Marca
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ej: Barbie, Monster High..."
                required
              />
            </div>

            {/* Fabricantes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span>🏭</span>
                Fabricantes Asociados
              </label>
              <div className="border-2 border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                {fabricantes.length > 0 ? (
                  <div className="space-y-2">
                    {fabricantes.map((fabricante) => (
                      <label 
                        key={fabricante.id} 
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedFabricantes.includes(fabricante.id)
                            ? "border-slate-500 bg-slate-100 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFabricantes.includes(fabricante.id)}
                          onChange={() => handleFabricanteChange(fabricante.id)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                          selectedFabricantes.includes(fabricante.id)
                            ? "border-slate-600 bg-slate-600"
                            : "border-slate-400 bg-white"
                        }`}>
                          {selectedFabricantes.includes(fabricante.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`font-semibold text-sm ${
                          selectedFabricantes.includes(fabricante.id) ? "text-slate-700" : "text-slate-600"
                        }`}>
                          {fabricante.nombre}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">No hay fabricantes disponibles</p>
                )}
                
                {/* Botón para añadir nuevo fabricante */}
                {!showNewFabricanteForm && (
                  <button
                    type="button"
                    onClick={() => setShowNewFabricanteForm(true)}
                    className="w-full mt-3 px-4 py-2.5 bg-blue-50 border-2 border-dashed border-blue-300 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 hover:border-blue-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>➕</span>
                    Crear Nuevo Fabricante
                  </button>
                )}

                {/* Formulario de nuevo fabricante */}
                {showNewFabricanteForm && (
                  <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <label className="block text-sm font-semibold text-blue-800 mb-2">
                      Nombre del Nuevo Fabricante
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newFabricanteName}
                        onChange={(e) => {
                          setNewFabricanteName(e.target.value);
                          setError('');
                        }}
                        placeholder="Ej: Mattel, Hasbro..."
                        className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewFabricante}
                        disabled={isCreatingFabricante || !newFabricanteName.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-400 transition-colors text-sm"
                      >
                        {isCreatingFabricante ? '⏳' : '✓'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewFabricanteForm(false);
                          setNewFabricanteName('');
                          setError('');
                        }}
                        className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    {error && (
                      <p className="text-sm text-red-600 mt-2">⚠️ {error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg font-semibold hover:from-slate-700 hover:to-slate-800 transition-colors"
            >
              Añadir Marca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMarcaModal;