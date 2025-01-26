import React from "react";
import { Doll } from "../../types/Doll";
import { Lote } from "../../types/Lote";

interface StatsProps {
  dolls: Doll[];
  lotes: Lote[];
}

const Stats: React.FC<StatsProps> = ({ dolls, lotes }) => {
  // General Stats
  const totalDolls = dolls.length;
  const totalLotes = lotes.length;
  const soldDolls = dolls.filter((doll) => doll.estado === "Vendida");
  const unsoldDolls = dolls.filter((doll) => doll.estado !== "Vendida");
  const totalSales = soldDolls.reduce((sum, doll) => {
    const price = doll.precio_venta
      ? parseFloat(doll.precio_venta.toString())
      : 0;
    return isNaN(price) ? sum : sum + price;
  }, 0);
  const avgSalePrice = soldDolls.length > 0 ? totalSales / soldDolls.length : 0;
  const soldPercentage = totalDolls > 0 ? (soldDolls.length / totalDolls) * 100 : 0;
  const savedDolls = dolls.filter((doll) => doll.estado === "Guardada");
const savedPercentage = totalDolls > 0 ? (savedDolls.length / totalDolls) * 100 : 0;


  // Financial Calculations
  const totalInvestment = dolls.reduce((sum, doll) => {
    const price = doll.precio_compra
      ? parseFloat(doll.precio_compra.toString())
      : 0;
    return isNaN(price) ? sum : sum + price;
  }, 0);
  const totalProfit = totalSales - totalInvestment;
  const profitMargin =
    totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : "0";

  const avgPurchasePrice = totalDolls > 0 ? totalInvestment / totalDolls : 0;

  console.log("Stats Debug:", {
    totalDolls,
    soldDolls: soldDolls.length,
    totalInvestment,
    totalSales,
    totalProfit,
    profitMargin,
    avgPurchasePrice,
    avgSalePrice,
  });

  // Distribution Stats
  const dollsByState = dolls.reduce((acc, doll) => {
    const state = doll.estado || "No especificado";
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dollsByBrand = dolls.reduce((acc, doll) => {
    const brand = doll.marca_nombre || "Unknown";
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dollsByYear = dolls.reduce((acc, doll) => {
    const year = doll.anyo || "Unknown";
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const yearStats = {
    oldest: Math.min(
      ...Object.keys(dollsByYear)
        .map(Number)
        .filter((year) => !isNaN(year))
    ),
    newest: Math.max(
      ...Object.keys(dollsByYear)
        .map(Number)
        .filter((year) => !isNaN(year))
    ),
    byDecade: dolls.reduce((acc, doll) => {
      const decade = Math.floor(doll.anyo / 10) * 10;
      acc[`${decade}s`] = (acc[`${decade}s`] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* General Stats Card */}
      <div className="bg-purple-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-purple-900 mb-4">
          Resumen General
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Total Muñecas:</span>
            <span className="font-bold">{totalDolls}</span>
          </div>
          <div className="flex justify-between">
            <span>Muñecas Vendidas:</span>
            <span className="font-bold">
              {soldDolls.length} ({soldPercentage}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span>Muñecas en Stock:</span>
            <span className="font-bold">{unsoldDolls.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Lotes:</span>
            <span className="font-bold">{totalLotes}</span>
          </div>
        </div>
        <div className="flex justify-between">
  <span>Muñecas Guardadas:</span>
  <span className="font-bold">
    {savedDolls.length} ({savedPercentage.toFixed(1)}%)
  </span>
</div>

      </div>

      {/* Financial Stats Card */}
      <div className="bg-green-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-green-900 mb-4">
          Datos Financieros
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Inversión Total:</span>
            <span className="font-bold">
              {Number(totalInvestment).toFixed(2)}€
            </span>
          </div>
          <div className="flex justify-between">
            <span>Ventas Totales:</span>
            <span className="font-bold">{Number(totalSales).toFixed(2)}€</span>
          </div>
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
          <div className="flex justify-between">
            <span>Precio Medio Compra:</span>
            <span className="font-bold">{avgPurchasePrice.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between">
            <span>Precio Medio Venta:</span>
            <span className="font-bold">{avgSalePrice.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {/* Distribution Stats Card */}
      <div className="bg-blue-50 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          Distribución
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Por Estado:</h4>
            {Object.entries(dollsByState).map(([state, count]) => (
              <div key={state} className="flex justify-between text-sm">
                <span>{state}</span>
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

      {/* Year Distribution Card */}
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
