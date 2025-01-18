import React, { useEffect, useState } from "react";
import { Lote } from "../../types/Lote";
import { Doll } from "../../types/Doll";

interface LoteDetailProps {
  lote: Lote;
  isOpen: boolean;
  onClose: () => void;
}

const LoteDetail: React.FC<LoteDetailProps> = ({ lote, isOpen, onClose }) => {
  const [dolls, setDolls] = useState<Doll[]>(lote.dolls || []); // Si el lote ya incluye las muñecas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const totalPrice =
    lote.tipo === "compra" ? lote.precio_total || 0 : lote.precio_total || 0;
  const quantity = dolls.length;

  useEffect(() => {
    if (isOpen && lote.id && !lote.dolls) {
      // Si las muñecas no están en el lote, las cargamos
      setLoading(true);
      fetch(`http://localhost:5000/api/lotes/${lote.id}/dolls`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar las muñecas");
          return res.json();
        })
        .then((data) => setDolls(data))
        .catch((err) => {
          setError("No se pudieron cargar las muñecas.");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, lote]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Detalles del Lote: {lote.nombre}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">Tipo:</span>{" "}
            <span
              className={`px-2 py-1 rounded ${
                lote.tipo === "compra"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {lote.tipo.charAt(0).toUpperCase() + lote.tipo.slice(1)}
            </span>
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Precio Total:</span> {totalPrice}€
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Cantidad de Muñecas:</span>{" "}
            {quantity}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Precio Unitario:</span>{" "}
            {quantity > 0 ? (totalPrice / quantity).toFixed(2) : "0.00"}€
          </p>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Muñecas en este Lote</h3>
          {loading ? (
            <p>Cargando muñecas...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dolls.map((doll) => (
                <div key={doll.id} className="border rounded p-3">
                  <div className="flex items-center space-x-3">
                    {doll.imagen ? (
                      <img
                        src={`http://localhost:5000${doll.imagen}`}
                        alt={doll.nombre}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No imagen</span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">{doll.nombre}</h4>
                      <p className="text-sm text-gray-600">
                        {doll.marca_nombre} - {doll.modelo}
                      </p>
                      <p className="text-sm text-gray-500">{doll.estado}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoteDetail;
