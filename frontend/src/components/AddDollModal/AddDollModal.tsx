import React, { useState } from 'react';
import { Doll } from '../../types/Doll';

interface AddDollModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onDollAdded: (doll: Doll) => void;
}

const AddDollModal: React.FC<AddDollModalProps> = ({ isOpen, closeModal, onDollAdded }) => {
    const [formData, setFormData] = useState<Doll>({
        nombre: '',
        marca: '',
        modelo: '',
        personaje: '',
        anyo: new Date().getFullYear(),
        estado: 'guardada',
        commentarios: '',
        imagen: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onDollAdded(formData);
        closeModal();
        setFormData({
            nombre: '',
            marca: '',
            modelo: '',
            personaje: '',
            anyo: new Date().getFullYear(),
            estado: 'guardada',
            commentarios: '',
            imagen: '',
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'anyo' ? parseInt(value) : value,
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">Añadir Nueva Muñeca</h2>
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
                        <input
                            type="text"
                            name="marca"
                            value={formData.marca}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        />
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
                            value={formData.estado}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        >
                            <option value="guardada">Guardada</option>
                            <option value="vendida">Vendida</option>
                            <option value="a la venta">A la venta</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Comentarios</label>
                        <textarea
                            name="commentarios"
                            value={formData.commentarios}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">URL de la imagen</label>
                        <input
                            type="text"
                            name="imagen"
                            value={formData.imagen}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
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
                            Añadir
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDollModal;