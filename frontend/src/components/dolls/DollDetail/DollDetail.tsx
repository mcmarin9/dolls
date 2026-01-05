import React, { useEffect, useState } from "react";
import { Doll } from "../../../types/Doll";
import { Lote } from "../../../types/Lote";
import { getStatusStyle, getTypeStyle } from "../../../utils/styleUtils";
import { fetchDollLotes } from "../../../utils/checkIfLote";


interface DollDetailProps {
  doll: Doll;
  isOpen: boolean;
  onClose: () => void;
  onLoteClick?: (lote: Lote) => void;
}

const DollDetail: React.FC<DollDetailProps> = ({
  doll,
  isOpen,
  onClose,
  onLoteClick,
}) => {
  const [dollWithLotes, setDollWithLotes] = useState<Doll>(doll);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDollLotes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const lotes = await fetchDollLotes(doll.id);
        setDollWithLotes((prev) => ({ ...prev, lotes }));
      } catch (error) {
        setError("No se pudieron cargar los lotes");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (isOpen && doll.id) {
      loadDollLotes();
    }
  }, [doll.id, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🎎</span>
              Detalles de la Muñeca
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body con scroll */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda - Imagen */}
            <div className="flex flex-col items-center">
              {doll.imagen ? (
                <img
                  src={`http://localhost:5000${doll.imagen}`}
                  alt={doll.nombre}
                  className="w-full max-w-sm h-auto object-cover rounded-xl shadow-lg border-4 border-pink-100"
                />
              ) : (
                <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex flex-col items-center justify-center border-4 border-slate-300">
                  <span className="text-6xl mb-2">📷</span>
                  <span className="text-slate-500 font-medium">Sin imagen</span>
                </div>
              )}
            </div>

            {/* Columna derecha - Información */}
            <div className="space-y-4">
              {/* Nombre destacado */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border-2 border-pink-200">
                <h3 className="text-2xl font-bold text-slate-800">{doll.nombre}</h3>
                <p className="text-slate-600 mt-1">{doll.marca_nombre} - {doll.fabricante_nombre}</p>
              </div>

              {/* Información básica */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-700 flex items-center gap-2 border-b pb-2">
                  <span className="text-xl">📋</span>
                  Información Básica
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500 block">Modelo</span>
                    <span className="font-semibold text-slate-800">{doll.modelo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Personaje</span>
                    <span className="font-semibold text-slate-800">{doll.personaje}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Año</span>
                    <span className="font-semibold text-slate-800">{doll.anyo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Estado</span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        doll.estado || ""
                      )}`}
                    >
                      {doll.estado}
                    </span>
                  </div>
                </div>
              </div>

              {/* Precios */}
              {(doll.precio_compra || doll.precio_venta) && (
                <div className="grid grid-cols-2 gap-3">
                  {doll.precio_compra && (
                    <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">🛒</span>
                        <span className="text-xs text-orange-700 font-semibold">COMPRA</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-800">{doll.precio_compra}€</p>
                    </div>
                  )}
                  {doll.precio_venta && (
                    <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">💵</span>
                        <span className="text-xs text-emerald-700 font-semibold">VENTA</span>
                      </div>
                      <p className="text-2xl font-bold text-emerald-800">{doll.precio_venta}€</p>
                    </div>
                  )}
                </div>
              )}

              {/* Comentarios */}
              {doll.comentarios && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                    <span className="text-xl">💬</span>
                    Comentarios
                  </h4>
                  <p className="text-slate-700 text-sm">{doll.comentarios}</p>
                </div>
              )}

              {/* Lotes */}
              {isLoading ? (
                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-slate-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-slate-600">Cargando lotes...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <p className="text-red-700">{error}</p>
                </div>
              ) : (
                dollWithLotes.lotes &&
                dollWithLotes.lotes.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-3">
                      <span className="text-xl">📦</span>
                      Lotes asociados
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dollWithLotes.lotes.map((lote) => (
                        <button
                          key={lote.id}
                          onClick={() => onLoteClick?.(lote)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 hover:shadow-md flex items-center gap-2 ${getTypeStyle(
                            (lote.tipo || "").toLowerCase() as "compra" | "venta"
                          )}`}
                        >
                          <span>{lote.tipo?.toLowerCase() === "compra" ? "🛒" : "💰"}</span>
                          {lote.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-700 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-purple-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DollDetail;
