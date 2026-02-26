import React, { useEffect, useState } from "react";
import { Lote } from "../../../types/Lote";
import { Doll } from "../../../types/Doll";
import DollDetail from "../../dolls/DollDetail/DollDetail";
import { getStatusStyle } from "../../../utils/styleUtils";
import { useApp } from "../../../context";
import { getLote } from "../../../services/api";

interface LoteDetailProps {
  lote: Lote;
  isOpen: boolean;
  onClose: () => void;
}

const LoteDetail: React.FC<LoteDetailProps> = ({ lote, isOpen, onClose }) => {
  const { openLoteDetail } = useApp();

  const [dolls, setDolls] = useState<Doll[]>(lote.dolls || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedDoll, setSelectedDoll] = useState<Doll | null>(null);
  const [isDollModalOpen, setIsDollModalOpen] = useState(false);

  const handleDollClick = (doll: Doll) => {
    setSelectedDoll(doll);
    setIsDollModalOpen(true);
  };

  // Asegurar que totalPrice sea un número
  const totalPrice = Number(lote.precio_total) || 0;
  const quantity = dolls.length;
  
  const totalCost = dolls.reduce((sum, doll) => {
    return sum + (Number(doll.precio_compra) || 0);
  }, 0);

  const profit = lote.tipo.toLowerCase() === 'venta' ? totalPrice - totalCost : null;
  const profitMargin = lote.tipo.toLowerCase() === 'venta' && totalCost > 0 
    ? ((profit! / totalCost) * 100).toFixed(2) 
    : null;

  useEffect(() => {
    // Reset state when the lote changes to avoid showing stale dolls
    setDolls(lote.dolls || []);
    setError("");
  }, [lote]);

  useEffect(() => {
    if (!isOpen || !lote.id) return;

    setLoading(true);
    fetch(`http://localhost:5000/api/lotes/${lote.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar el lote");
        return res.json();
      })
      .then((data) => {
        setDolls(data.dolls || []);
      })
      .catch((err) => {
        setError("No se pudieron cargar las muñecas.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [isOpen, lote.id]);

  const handleClose = () => {
    // Cerrar todo de una vez
    setIsDollModalOpen(false);
    setSelectedDoll(null);
    onClose();
  };

  const handleLoteClickFromNestedDoll = async (targetLote: Lote) => {
    if (!targetLote?.id) return;

    // Cerrar la modal de muñeca y este detalle antes de abrir el nuevo lote
    setIsDollModalOpen(false);
    setSelectedDoll(null);
    onClose();

    try {
      const loteDetallado = await getLote(targetLote.id);
      openLoteDetail(loteDetallado);
    } catch (err) {
      openLoteDetail(targetLote);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className={`px-6 py-4 bg-gradient-to-r ${
          lote.tipo.toLowerCase() === 'compra' 
            ? 'from-orange-600 to-orange-700' 
            : 'from-emerald-600 to-emerald-700'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">{lote.tipo.toLowerCase() === 'compra' ? '🛒' : '💰'}</span>
              {lote.nombre}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body con scroll */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="space-y-6">
            {/* Información del Lote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo */}
              <div className={`bg-gradient-to-br rounded-xl p-4 border-2 ${
                lote.tipo.toLowerCase() === 'compra'
                  ? 'from-orange-50 to-white border-orange-200'
                  : 'from-emerald-50 to-white border-emerald-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{lote.tipo.toLowerCase() === 'compra' ? '🛒' : '💰'}</span>
                  <span className="text-sm font-bold text-slate-700">Tipo de Lote</span>
                </div>
                <p className={`text-2xl font-bold ${
                  lote.tipo.toLowerCase() === 'compra' ? 'text-orange-700' : 'text-emerald-700'
                }`}>
                  {lote.tipo.charAt(0).toUpperCase() + lote.tipo.slice(1)}
                </p>
              </div>

              {/* Cantidad */}
              <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎎</span>
                  <span className="text-sm font-bold text-slate-700">Muñecas en Lote</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">{quantity}</p>
              </div>

              {/* Precio por unidad */}
              <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🏷️</span>
                  <span className="text-sm font-bold text-slate-700">Precio Unitario</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">
                  {quantity > 0 ? (totalPrice / quantity).toFixed(2) : "0.00"}€
                </p>
              </div>

              {/* Precio Total */}
              <div className={`bg-gradient-to-br rounded-xl p-4 border-2 ${
                lote.tipo.toLowerCase() === 'compra'
                  ? 'from-orange-50 to-white border-orange-200'
                  : 'from-emerald-50 to-white border-emerald-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💵</span>
                  <span className="text-sm font-bold text-slate-700">
                    {lote.tipo.toLowerCase() === 'venta' ? 'Precio de Venta' : 'Precio Total'}
                  </span>
                </div>
                <p className={`text-2xl font-bold ${
                  lote.tipo.toLowerCase() === 'compra' ? 'text-orange-700' : 'text-emerald-700'
                }`}>
                  {totalPrice.toFixed(2)}€
                </p>
              </div>

              {/* Solo para lotes de venta: Coste y Ganancia */}
              {lote.tipo.toLowerCase() === 'venta' && (
                <>
                  <div className="bg-gradient-to-br from-red-50 to-white border-2 border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📊</span>
                      <span className="text-sm font-bold text-slate-700">Coste Total</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700">{totalCost.toFixed(2)}€</p>
                  </div>

                  <div className={`bg-gradient-to-br rounded-xl p-4 border-2 ${
                    profit && profit >= 0
                      ? 'from-green-50 to-white border-green-200'
                      : 'from-red-50 to-white border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{profit && profit >= 0 ? '📈' : '📉'}</span>
                      <span className="text-sm font-bold text-slate-700">Ganancia</span>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${
                        profit && profit >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {profit !== null ? profit.toFixed(2) : '0.00'}€
                      </p>
                      {profitMargin && (
                        <p className={`text-sm font-semibold ${
                          profit && profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({profitMargin}%)
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Lista de Muñecas */}
            <div>
              <div className="flex items-center gap-2 pb-3 border-b-2 border-blue-200 mb-4">
                <span className="text-2xl">🎎</span>
                <h3 className="font-bold text-lg text-slate-800">Muñecas en este Lote</h3>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-slate-600">Cargando muñecas...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span>{error}</span>
                </div>
              ) : dolls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dolls.map((doll) => (
                    <div
                      key={doll.id}
                      onClick={() => handleDollClick(doll)}
                      className="flex items-center gap-3 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                    >
                      {doll.imagen ? (
                        <img
                          src={`http://localhost:5000${doll.imagen}`}
                          alt={doll.nombre}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-slate-200"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-slate-200">
                          <span className="text-3xl">📷</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{doll.nombre}</h4>
                        <p className="text-sm text-slate-600 truncate">
                          {doll.marca_nombre} - {doll.modelo}
                        </p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(doll.estado || '')}`}>
                          {doll.estado}
                        </span>
                      </div>
                      <span className="text-blue-400 text-xl">→</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-5xl mb-3">🎎</p>
                  <p className="text-lg font-semibold">No hay muñecas en este lote</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedDoll && isDollModalOpen && (
          <DollDetail 
            doll={selectedDoll} 
            isOpen={isDollModalOpen}
            onClose={() => {
              setIsDollModalOpen(false);
              setSelectedDoll(null);
            }}
            onLoteClick={handleLoteClickFromNestedDoll}
          />
        )}
      </div>
    </div>
  );
};

export default LoteDetail;