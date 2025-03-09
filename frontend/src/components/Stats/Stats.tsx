import React from "react";
import { Doll } from "../../types/Doll";
import { Lote } from "../../types/Lote";

interface StatsProps {
  dolls: Doll[];
  lotes: Lote[];
}

// Constantes y tipos auxiliares
const STATE_DISPLAY_NAMES: Record<string, string> = {
  guardada: "Guardada",
  "a la venta": "A la venta",
  vendida: "Vendida",
  fuera: "Fuera",
};

// Componentes auxiliares para la UI
const StatRow: React.FC<{
  label: string;
  value: string | number;
  isSmall?: boolean;
  description?: string;
}> = ({ label, value, isSmall = false, description }) => (
  <div>
    <div className={`flex justify-between ${isSmall ? "text-sm" : ""}`}>
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
    {description && (
      <div className="text-xs text-gray-500 mt-1">{description}</div>
    )}
  </div>
);

const Stats: React.FC<StatsProps> = ({ dolls, lotes }) => {
  // Verifica si los datos están cargados
  if (!dolls || dolls.length === 0) {
    return <div>Cargando datos...</div>;
  }

  // Cálculos generales
  const totalLotes = lotes.length;
  const savedDolls = dolls.filter((doll) => doll.estado === "guardada");
  const forSaleDolls = dolls.filter((doll) => doll.estado === "a la venta");
  const outDolls = dolls.filter((doll) => doll.estado === "fuera");

  // Cálculos financieros
  const totalDolls = dolls.length;
  const soldDolls = dolls.filter((doll) => doll.estado === "vendida");

  const unsoldDolls = dolls.filter((doll) => doll.estado !== "vendida");
  const soldPercentage = (soldDolls.length / totalDolls) * 100;
  const savedPercentage = (savedDolls.length / totalDolls) * 100;
  const forSalePercentage = (forSaleDolls.length / totalDolls) * 100;
  const outPercentage = (outDolls.length / totalDolls) * 100;

  // Inversión total (suma de todos los precios de compra)
  const totalInvestment = dolls.reduce((sum, doll) => {
    const price = Number(doll.precio_compra) || 0;
    return sum + price;
  }, 0);

  // Ventas totales (suma de precios de venta de muñecas vendidas)
  const totalSales = soldDolls.reduce((sum, doll) => {
    const price = Number(doll.precio_venta) || 0;
    return sum + price;
  }, 0);

  // Beneficio total (ventas - inversión en muñecas vendidas)
  const soldDollsInvestment = soldDolls.reduce((sum, doll) => {
    const price = Number(doll.precio_compra) || 0;
    return sum + price;
  }, 0);

  const totalProfit = totalSales - soldDollsInvestment;

  // Margen de beneficio (beneficio / ventas * 100)
  const profitMargin =
    totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : "0.0";

  // Precios medios
  const avgPurchasePrice =
    soldDolls.length > 0 ? soldDollsInvestment / soldDolls.length : 0;

  const avgSalePrice = soldDolls.length > 0 ? totalSales / soldDolls.length : 0;

  // Distribución por estado
  const dollsByState = dolls.reduce((acc, doll) => {
    const state = doll.estado || "No especificado";
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Distribución por marca
  const dollsByBrand = dolls.reduce((acc, doll) => {
    const brand = doll.marca_nombre || "Unknown";
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProfitDolls = dolls
    .filter(
      (doll) =>
        doll.estado === "vendida" && doll.precio_venta && doll.precio_compra
    )
    .map((doll) => ({
      ...doll,
      profit: Number(doll.precio_venta) - Number(doll.precio_compra),
      profitPercentage:
        ((Number(doll.precio_venta) - Number(doll.precio_compra)) /
          Number(doll.precio_compra)) *
        100,
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tarjeta de Estadísticas Generales */}
      <div className="bg-purple-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-purple-900 mb-4">
          Resumen General
        </h3>
        <div className="space-y-3">
          <StatRow label="Total Muñecas:" value={totalDolls} />
          <StatRow
            label="Muñecas Vendidas:"
            value={`${soldDolls.length} (${soldPercentage.toFixed(1)}%)`}
          />
          <StatRow label="Muñecas en Stock:" value={unsoldDolls.length} />
          <StatRow
            label="Muñecas Guardadas:"
            value={`${savedDolls.length} (${savedPercentage.toFixed(1)}%)`}
          />
          <StatRow
            label="Muñecas a la Venta:"
            value={`${forSaleDolls.length} (${forSalePercentage.toFixed(1)}%)`}
          />
          <StatRow
            label="Muñecas Fuera:"
            value={`${outDolls.length} (${outPercentage.toFixed(1)}%)`}
          />
          <StatRow label="Total Lotes:" value={totalLotes} />
        </div>
      </div>

      {/* Tarjeta de Estadísticas Financieras */}
      <div className="bg-green-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-green-900 mb-4">
          Datos Financieros
        </h3>
        <div className="space-y-3">
          <StatRow
            label="Inversión Total:"
            value={`${totalInvestment.toFixed(2)}€`}
            description="Suma del precio de compra de todas las muñecas"
          />
          <StatRow
            label="Inversión en Vendidas:"
            value={`${soldDollsInvestment.toFixed(2)}€`}
            description="Suma del precio de compra solo de las muñecas vendidas"
          />
          <StatRow
            label="Ventas Totales:"
            value={`${totalSales.toFixed(2)}€`}
            description="Suma del precio de venta de todas las muñecas vendidas"
          />
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span>Beneficio:</span>
              <span
                className={`font-bold ${
                  totalProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {totalProfit.toFixed(2)}€ ({profitMargin}%)
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Diferencia entre ventas totales e inversión en vendidas
            </div>
          </div>
          <StatRow
            label="Precio Medio Compra:"
            value={`${avgPurchasePrice.toFixed(2)}€`}
            description="Precio medio de compra de las muñecas vendidas"
          />
          <StatRow
            label="Precio Medio Venta:"
            value={`${avgSalePrice.toFixed(2)}€`}
            description="Precio medio de venta de las muñecas vendidas"
          />
        </div>
      </div>

      {/* Tarjeta de Distribución */}
      <div className="bg-blue-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          Distribución
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Por Estado:</h4>
            {Object.entries(dollsByState)
              .sort(([stateA], [stateB]) => stateA.localeCompare(stateB))
              .map(([state, count]) => (
                <div key={state} className="flex justify-between text-sm">
                  <span>{STATE_DISPLAY_NAMES[state] || state}</span>
                  <span className="font-bold">
                    {count} ({((count / totalDolls) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
          </div>
          <div>
            <h4 className="font-medium mb-2">Por Marca:</h4>
            {Object.entries(dollsByBrand)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([brand, count]) => (
                <div key={brand} className="flex justify-between text-sm">
                  <span>{brand}</span>
                  <span className="font-bold">
                    {count} ({((count / totalDolls) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Tarjeta de Top Ventas */}
      <div className="bg-yellow-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-yellow-900 mb-4">
          Top Ventas
        </h3>
        <div className="space-y-4">
          {topProfitDolls.map((doll) => (
            <div key={doll.id} className="border-b border-yellow-200 pb-3">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{doll.nombre}</span>
                <span className="text-green-600 font-bold">
                  +{doll.profit.toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Compra: {doll.precio_compra}€</span>
                <span>Venta: {doll.precio_venta}€</span>
                <span>ROI: {doll.profitPercentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
