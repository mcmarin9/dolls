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
}> = ({ label, value, isSmall = false }) => (
  <div className={`flex justify-between ${isSmall ? "text-sm" : ""}`}>
    <span>{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const Stats: React.FC<StatsProps> = ({ dolls, lotes }) => {
  // Verifica si los datos están cargados
  if (!dolls || dolls.length === 0) {
    return <div>Cargando datos...</div>;
  }

  // Cálculos generales
  const totalDolls = dolls.length;
  const totalLotes = lotes.length;
  const soldDolls = dolls.filter((doll) => doll.estado === "vendida");
  const unsoldDolls = dolls.filter((doll) => doll.estado !== "vendida");
  const savedDolls = dolls.filter((doll) => doll.estado === "guardada");
  const forSaleDolls = dolls.filter((doll) => doll.estado === "a la venta");
  const outDolls = dolls.filter((doll) => doll.estado === "fuera");

  // Cálculos financieros
  const totalSales = soldDolls.reduce((sum, doll) => {
    const price = doll.precio_venta !== null ? Number(doll.precio_venta) : 0; // Maneja null
    return sum + price;
  }, 0);
  
  const totalInvestment = dolls.reduce((sum, doll) => {
    const price = doll.precio_compra !== null ? Number(doll.precio_compra) : 0; // Maneja null
    return sum + price;
  }, 0);
  
  const totalProfit = totalSales - totalInvestment;
  const profitMargin =
    totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : "0";
  
  const avgSalePrice =
    soldDolls.length > 0 ? totalSales / soldDolls.length : 0;
  
  const avgPurchasePrice = totalDolls > 0 ? totalInvestment / totalDolls : 0;
  
  const currentStockValue = unsoldDolls.reduce((sum, doll) => {
    const price = doll.precio_compra !== null ? Number(doll.precio_compra) : 0; // Maneja null
    return sum + price;
  }, 0);

  const soldPercentage =
    totalDolls > 0 ? (soldDolls.length / totalDolls) * 100 : 0;
  const savedPercentage =
    totalDolls > 0 ? (savedDolls.length / totalDolls) * 100 : 0;
  const forSalePercentage =
    totalDolls > 0 ? (forSaleDolls.length / totalDolls) * 100 : 0;
  const outPercentage =
    totalDolls > 0 ? (outDolls.length / totalDolls) * 100 : 0;


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

  // Distribución por año
  const dollsByYear = dolls.reduce((acc, doll) => {
    const year = doll.anyo || "Unknown";
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  // Estadísticas de años
  const numericYears = Object.keys(dollsByYear)
    .map(Number)
    .filter((year) => !isNaN(year));

  const yearStats = {
    oldest: numericYears.length > 0 ? Math.min(...numericYears) : 0,
    newest: numericYears.length > 0 ? Math.max(...numericYears) : 0,
    byDecade: dolls.reduce((acc, doll) => {
      if (doll.anyo) {
        const decade = Math.floor(doll.anyo / 10) * 10;
        const key = `${decade}s`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
  };

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
            value={`${Number(totalInvestment).toFixed(2)}€`}
          />
          <StatRow
            label="Valor Stock Actual:"
            value={`${Number(currentStockValue).toFixed(2)}€`}
          />
          <StatRow
            label="Ventas Totales:"
            value={`${Number(totalSales).toFixed(2)}€`}
          />
          <div className="flex justify-between">
            <span>Beneficio:</span>
            <span
              className={`font-bold ${
                totalProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {Number(totalProfit).toFixed(2)}€ ({profitMargin}%)
            </span>
          </div>
          <StatRow
            label="Precio Medio Compra:"
            value={`${avgPurchasePrice.toFixed(2)}€`}
          />
          <StatRow
            label="Precio Medio Venta:"
            value={`${avgSalePrice.toFixed(2)}€`}
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

      {/* Tarjeta de Distribución por Año */}
      <div className="bg-yellow-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-yellow-900 mb-4">
          Distribución por Año
        </h3>
        <div className="space-y-3">
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              Rango de años: {yearStats.oldest} - {yearStats.newest}
            </span>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {Object.entries(dollsByYear)
              .filter(([year]) => year !== "Unknown")
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([year, count]) => {
                const percentage = (count / totalDolls) * 100;
                return (
                  <div
                    key={year}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="w-16">{year}</span>
                    <div className="flex-1 mx-4">
                      <div
                        className={`h-5 rounded ${
                          percentage > 15
                            ? "bg-yellow-400"
                            : percentage > 10
                            ? "bg-yellow-300"
                            : "bg-yellow-200"
                        }`}
                        style={{ width: `${Math.max(percentage * 3, 20)}px` }}
                      />
                    </div>
                    <span className="font-bold w-24 text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
          </div>
          <div className="mt-6 pt-4 border-t border-yellow-200">
            <h4 className="font-medium mb-2">Por Década:</h4>
            {Object.entries(yearStats.byDecade)
              .filter(([decade]) => decade !== "undefineds")
              .sort(
                ([a], [b]) => Number(b.slice(0, -1)) - Number(a.slice(0, -1))
              )
              .map(([decade, count]) => {
                const percentage = (count / totalDolls) * 100;
                return (
                  <div
                    key={decade}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-sm">{decade}</span>
                    <div className="flex-1 mx-4">
                      <div
                        className="bg-yellow-300 h-4 rounded"
                        style={{ width: `${Math.max(percentage * 3, 20)}px` }}
                      />
                    </div>
                    <span className="font-bold text-sm w-24 text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;