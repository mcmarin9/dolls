import React from 'react';
import { Doll } from '../../types/Doll';

interface DollDetailProps {
    doll: Doll;
}

const DollDetail: React.FC<DollDetailProps> = ({ doll }) => {
    return (
        <div className="doll-detail p-4 bg-white rounded-lg shadow">
            {doll.imagen ? (
                <img 
                    src={`http://localhost:5000${doll.imagen}`}
                    alt={doll.nombre} 
                    className="w-64 h-64 object-cover rounded mb-4" 
                />
            ) : (
                <div className="w-64 h-64 bg-gray-200 rounded flex items-center justify-center mb-4">
                    <span className="text-gray-400">No imagen</span>
                </div>
            )}
            <h2 className="text-xl font-bold mb-2">{doll.nombre}</h2>
            <div className="grid gap-2">
                <p><span className="font-semibold">Marca:</span> {doll.marca_nombre}</p>
                <p><span className="font-semibold">Modelo:</span> {doll.modelo}</p>
                <p><span className="font-semibold">Personaje:</span> {doll.personaje}</p>
                <p><span className="font-semibold">Año:</span> {doll.anyo}</p>
                <p><span className="font-semibold">Estado:</span> {doll.estado}</p>
                {doll.commentarios && (
                    <p><span className="font-semibold">Comentarios:</span> {doll.commentarios}</p>
                )}
            </div>
        </div>
    );
};

export default DollDetail;