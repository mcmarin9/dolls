import React from 'react';
import { Doll } from '../../types/Doll';

interface DollsListProps {
    dolls: Doll[];
    onDelete: (id: number) => void;
    onView: (doll: Doll) => void;
}

const DollsList: React.FC<DollsListProps> = ({ dolls, onView, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-sm rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personaje</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentarios</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {dolls.map((doll) => (
                        <tr key={doll.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {doll.imagen && (
                                    <img 
                                        src={doll.imagen} 
                                        alt={doll.nombre} 
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doll.nombre}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doll.marca}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doll.modelo}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doll.personaje}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doll.anyo}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doll.estado}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{doll.commentarios}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button
                                    onClick={() => onView(doll)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                >
                                    Ver
                                </button>
                                <button
                                    onClick={() => doll.id && onDelete(doll.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DollsList;