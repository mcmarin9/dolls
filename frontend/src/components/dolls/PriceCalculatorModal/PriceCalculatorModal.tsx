import React, { useState, useMemo } from "react";
import Modal from "../../common/Modal/Modal";
import { Doll } from "../../../types/Doll";

interface PriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dolls: Doll[];
}

const PriceCalculatorModal: React.FC<PriceCalculatorModalProps> = ({
  isOpen,
  onClose,
  dolls,
}) => {
  const [selectedDollIds, setSelectedDollIds] = useState<Set<number>>(new Set());

  const selectedDolls = useMemo(
    () =>
      dolls.filter(
        (doll) => doll.id && selectedDollIds.has(doll.id)
      ),
    [dolls, selectedDollIds]
  );

  const totalCost = useMemo(
    () =>
      selectedDolls.reduce((sum, doll) => {
        return sum + (doll.precio_compra || 0);
      }, 0),
    [selectedDolls]
  );

  const handleDollToggle = (dollId: number) => {
    const newSelected = new Set(selectedDollIds);
    if (newSelected.has(dollId)) {
      newSelected.delete(dollId);
    } else {
      newSelected.add(dollId);
    }
    setSelectedDollIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDollIds.size === dolls.length) {
      setSelectedDollIds(new Set());
    } else {
      const allIds = new Set(dolls.map((d) => d.id).filter((id) => id !== undefined) as number[]);
      setSelectedDollIds(allIds);
    }
  };

  const handleClose = () => {
    setSelectedDollIds(new Set());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Calculadora de Precio Total
        </h2>

        <div className="mb-6 flex items-center gap-4 border-b pb-4">
          <input
            type="checkbox"
            id="selectAll"
            checked={selectedDollIds.size === dolls.length && dolls.length > 0}
            onChange={handleSelectAll}
            className="h-5 w-5 cursor-pointer rounded border-gray-300"
          />
          <label htmlFor="selectAll" className="cursor-pointer font-semibold text-gray-700">
            Seleccionar todo ({dolls.length} muñecas)
          </label>
        </div>

        <div className="mb-8 space-y-3 max-h-[40vh] overflow-y-auto">
          {dolls.length > 0 ? (
            dolls.map((doll) => (
              <div
                key={doll.id}
                className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  id={`doll-${doll.id}`}
                  checked={doll.id ? selectedDollIds.has(doll.id) : false}
                  onChange={() => doll.id && handleDollToggle(doll.id)}
                  className="h-5 w-5 cursor-pointer"
                />
                <label
                  htmlFor={`doll-${doll.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-semibold text-gray-800">
                    {doll.nombre} ({doll.personaje})
                  </div>
                  <div className="text-sm text-gray-600">
                    {doll.marca_nombre} - {doll.modelo}
                  </div>
                </label>
                <div className="text-right">
                  {doll.precio_compra ? (
                    <span className="font-semibold text-blue-600">
                      {doll.precio_compra.toFixed(2)} €
                    </span>
                  ) : (
                    <span className="text-gray-400">Sin precio</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-gray-500">No hay muñecas disponibles</p>
          )}
        </div>

        {selectedDolls.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="mb-4 font-semibold text-gray-800">
              Muñecas seleccionadas ({selectedDolls.length})
            </h3>
            <div className="mb-4 max-h-[20vh] overflow-y-auto space-y-2">
              {selectedDolls.map((doll) => (
                <div
                  key={doll.id}
                  className="flex items-center justify-between rounded-lg bg-blue-50 p-3"
                >
                  <div className="font-medium text-gray-800">{doll.nombre}</div>
                  <span className="font-semibold text-blue-600">
                    {doll.precio_compra?.toFixed(2) || "0.00"} €
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-800">Costo Total:</span>
                <span className="text-3xl font-bold text-green-600">
                  {totalCost.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PriceCalculatorModal;
