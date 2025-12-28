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

const STATE_COLORS: Record<string, string> = {
  vendida: "bg-emerald-500",
  "a la venta": "bg-amber-500",
  guardada: "bg-sky-500",
  fuera: "bg-slate-400",
};

// Componentes auxiliares para la UI
const StatRow: React.FC<{
  label: string;
  value: string | number;
  isSmall?: boolean;
  valueColor?: string;
}> = ({ label, value, isSmall = false, valueColor = "" }) => (
  <div className={`flex justify-between items-center ${isSmall ? "text-sm" : ""} py-2 border-b border-gray-200 last:border-0`}>
    <span className="text-gray-700">{label}</span>
    <span className={`font-bold ${valueColor || "text-gray-900"}`}>{value}</span>
  </div>
);

const StatCard: React.FC<{
  title: string;
  subtitle?: string;
  accent?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, accent = "from-slate-100 via-white to-slate-50", children }) => (
  <div className="h-full">
    <div className={`h-full flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden`}>
      <div className={`px-5 py-4 bg-gradient-to-r ${accent}`}>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex-1 p-5 bg-white">{children}</div>
    </div>
  </div>
);

const formatCurrency = (value: number) => `${value.toFixed(2)}€`;
const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const Stats: React.FC<StatsProps> = ({ dolls, lotes }) => {
  // Verifica si los datos están cargados
  if (!dolls || dolls.length === 0) {
    return <div>Cargando datos...</div>;
  }

  // Cálculos generales
  const totalDolls = dolls.length;
  const soldDolls = dolls.filter((doll) => doll.estado === "vendida");
  const unsoldDolls = dolls.filter((doll) => doll.estado !== "vendida");

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

  // Inversión en muñecas vendidas
  const soldDollsInvestment = soldDolls.reduce((sum, doll) => {
    const price = Number(doll.precio_compra) || 0;
    return sum + price;
  }, 0);

  // Beneficio sobre muñecas vendidas
  const profitFromSold = totalSales - soldDollsInvestment;

  // Beneficio neto real (considerando todo lo invertido)
  const netProfit = totalSales - totalInvestment;

  // Margen de beneficio (beneficio / ventas * 100)
  const profitMargin = totalSales > 0 
    ? (profitFromSold / totalSales) * 100 
    : 0;

  // ROI - Return on Investment (beneficio / inversión * 100)
  const roi = soldDollsInvestment > 0 
    ? (profitFromSold / soldDollsInvestment) * 100 
    : 0;

  // Coste de inventario (muñecas no vendidas)
  const inventoryCost = unsoldDolls.reduce((sum, doll) => {
    const price = Number(doll.precio_compra) || 0;
    return sum + price;
  }, 0);

  // Porcentajes auxiliares
  const soldPercentage = totalDolls > 0 ? (soldDolls.length / totalDolls) * 100 : 0;
  const inventoryWeight = totalInvestment > 0 ? (inventoryCost / totalInvestment) * 100 : 0;

  // Precios medios
  const avgPurchasePrice = soldDolls.length > 0 
    ? soldDollsInvestment / soldDolls.length 
    : 0;

  const avgSalePrice = soldDolls.length > 0 
    ? totalSales / soldDolls.length 
    : 0;

  // Estadísticas de lotes
  const lotesCompra = lotes.filter(l => l.tipo.toLowerCase() === 'compra').length;
  const lotesVenta = lotes.filter(l => l.tipo.toLowerCase() === 'venta').length;

  // Tasa de venta
  const sellRate = totalDolls > 0 ? (soldDolls.length / totalDolls) * 100 : 0;

  // Valor medio de inventario por muñeca
  const avgInventoryValue = unsoldDolls.length > 0 ? inventoryCost / unsoldDolls.length : 0;

  // Ratio de rentabilidad
  const profitability = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

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

  // Muñecas en cada estado con valor
  const forSaleDolls = dolls.filter(d => d.estado === "a la venta");
  const storedDolls = dolls.filter(d => d.estado === "guardada");

  // Top muñecas con mayor beneficio
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
    <div className="space-y-4">
      {/* KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200 p-4">
          <p className="text-xs text-blue-600 font-semibold mb-1">INVENTARIO</p>
          <p className="text-3xl font-bold text-slate-900">{totalDolls}</p>
          <p className="text-xs text-slate-600 mt-1">{unsoldDolls.length} disponibles</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-200 p-4">
          <p className="text-xs text-red-600 font-semibold mb-1">INVERSIÓN</p>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalInvestment)}</p>
          <p className="text-xs text-slate-600 mt-1">{formatCurrency(avgPurchasePrice)} media</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-200 p-4">
          <p className="text-xs text-emerald-600 font-semibold mb-1">VENTAS</p>
          <p className="text-3xl font-bold text-emerald-700">{formatCurrency(totalSales)}</p>
          <p className="text-xs text-slate-600 mt-1">{soldDolls.length} vendidas</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-200 p-4">
          <p className="text-xs text-amber-600 font-semibold mb-1">BENEFICIO</p>
          <p className="text-3xl font-bold text-emerald-700">{formatCurrency(netProfit)}</p>
          <p className="text-xs text-slate-600 mt-1">{formatPercent(profitability)} ROI</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200 p-4">
          <p className="text-xs text-purple-600 font-semibold mb-1">TASA VENTA</p>
          <p className="text-3xl font-bold text-slate-900">{formatPercent(sellRate)}</p>
          <p className="text-xs text-slate-600 mt-1">{soldDolls.length}/{totalDolls} vendidas</p>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Resumen financiero */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">💰 Resumen Financiero</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Inversión total</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalInvestment)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Ventas totales</span>
              <span className="font-bold text-emerald-700">{formatCurrency(totalSales)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Ben. en ventas</span>
              <span className="font-bold text-emerald-600">{formatCurrency(profitFromSold)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600">Beneficio neto</span>
              <span className={`font-bold ${netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* Análisis de precios */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">📊 Análisis Precios</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Precio medio compra</span>
                <span className="font-semibold text-slate-900">{formatCurrency(avgPurchasePrice)}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${avgPurchasePrice > 0 ? Math.min((avgPurchasePrice / avgSalePrice) * 100, 100) : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Precio medio venta</span>
                <span className="font-semibold text-slate-900">{formatCurrency(avgSalePrice)}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Margen medio</span>
                <span className={`font-bold ${(avgSalePrice - avgPurchasePrice) >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {formatCurrency(avgSalePrice - avgPurchasePrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Inventario actual */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">📦 Inventario Actual</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600">En venta</span>
              <span className="font-bold text-amber-600">{forSaleDolls.length} uds</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600">Guardadas</span>
              <span className="font-bold text-blue-600">{storedDolls.length} uds</span>
            </div>
            <div className="flex justify-between items-center py-1 border-t border-slate-100 pt-2">
              <span className="text-slate-600">Valor inventario</span>
              <span className="font-bold text-orange-600">{formatCurrency(inventoryCost)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-600">Valor medio/ud</span>
              <span className="font-bold text-slate-900">{formatCurrency(avgInventoryValue)}</span>
            </div>
          </div>
        </div>

        {/* Estado visual */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">📈 Estado del Inventario</h3>
          <div className="space-y-2.5">
            {Object.entries(dollsByState)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([state, count]) => {
                const pct = totalDolls > 0 ? (count / totalDolls) * 100 : 0;
                return (
                  <div key={state}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{STATE_DISPLAY_NAMES[state] || state}</span>
                      <span className="font-bold text-slate-900">{count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${STATE_COLORS[state] || "bg-slate-400"} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Top marcas */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">🏷️ Top Marcas</h3>
          <div className="space-y-2">
            {Object.entries(dollsByBrand)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([brand, count], index) => {
                const pct = totalDolls > 0 ? (count / totalDolls) * 100 : 0;
                const colors = ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-slate-400'];
                return (
                  <div key={brand} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5">#{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-900 truncate">{brand}</span>
                        <span className="font-semibold text-slate-900">{count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[index] || 'bg-slate-400'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Top ventas */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-bold text-slate-900 mb-3">🏆 Top 5 Mejores Ventas por Beneficio</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {topProfitDolls.length > 0 ? (
            topProfitDolls.slice(0, 5).map((doll, index) => {
              const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
              return (
                <div key={doll.id} className="rounded-lg bg-gradient-to-br from-amber-50 to-white border border-amber-200 p-3 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{medals[index]}</span>
                    <p className="font-bold text-slate-900 text-sm truncate flex-1">{doll.nombre}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Compra</span>
                      <span className="font-semibold text-slate-700">{formatCurrency(Number(doll.precio_compra) || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Venta</span>
                      <span className="font-semibold text-slate-700">{formatCurrency(Number(doll.precio_venta) || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1.5 border-t border-amber-200">
                      <span className="text-emerald-600 font-semibold">Beneficio</span>
                      <span className="font-bold text-emerald-600">+{formatCurrency(doll.profit)}</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                        ROI {formatPercent(doll.profitPercentage)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-5 text-center py-8 text-slate-400">
              <p className="text-2xl mb-2">📦</p>
              <p className="text-sm">No hay ventas registradas todavía</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;