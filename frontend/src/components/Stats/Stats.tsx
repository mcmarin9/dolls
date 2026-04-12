import React, { useState } from "react";
import { Doll } from "../../types/Doll";
import { Lote } from "../../types/Lote";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

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

const formatCurrency = (value: number) => `${value.toFixed(2)}€`;
const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const Stats: React.FC<StatsProps> = ({ dolls }) => {
  const [activeTab, setActiveTab] = useState<"stats" | "charts">("stats");

  // Verifica si los datos están cargados
  if (!dolls || dolls.length === 0) {
    return <div>Cargando datos...</div>;
  }

  // ==================== FUNCIONES AUXILIARES ====================

  // Agrupar marcas: las principales se muestran individualmente, el resto en "Otros"
  const getGroupedBrandData = () => {
    const MAIN_BRANDS = ["Barbie", "Bratz", "MyScene", "Rainbow High"];
    const dollsByBrand = dolls.reduce((acc, doll) => {
      const brand = doll.marca_nombre || "Unknown";
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const grouped: Record<string, number> = {};
    let otherCount = 0;

    Object.entries(dollsByBrand)
      .sort(([, a], [, b]) => b - a)
      .forEach(([brand, count]) => {
        if (MAIN_BRANDS.some((mb) => brand.toLowerCase().includes(mb.toLowerCase()) || mb.toLowerCase().includes(brand.toLowerCase()))) {
          grouped[brand] = count;
        } else {
          otherCount += count;
        }
      });

    if (otherCount > 0) {
      grouped["Otros"] = otherCount;
    }

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Colores para los gráficos
  const CHART_COLORS = [
    "#ec4899", // pink-500
    "#f59e0b", // amber-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#10b981", // emerald-500
    "#6366f1", // indigo-500
  ];

  // ==================== CÁLCULOS ====================
  const totalDolls = dolls.length;
  const soldDolls = dolls.filter((doll) => doll.estado === "vendida");
  const forSaleDolls = dolls.filter((doll) => doll.estado === "a la venta");
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
  // const profitMargin = totalSales > 0 
  //   ? (profitFromSold / totalSales) * 100 
  //   : 0;

  // ROI - Return on Investment (beneficio / inversión * 100)
  // const roi = soldDollsInvestment > 0 
  //   ? (profitFromSold / soldDollsInvestment) * 100 
  //   : 0;

  // Coste de inventario (muñecas no vendidas)
  const inventoryCost = unsoldDolls.reduce((sum, doll) => {
    const price = Number(doll.precio_compra) || 0;
    return sum + price;
  }, 0);

  // Porcentajes auxiliares
  // const soldPercentage = totalDolls > 0 ? (soldDolls.length / totalDolls) * 100 : 0;
  // const inventoryWeight = totalInvestment > 0 ? (inventoryCost / totalInvestment) * 100 : 0;

  // Precios medios
  const avgPurchasePrice = soldDolls.length > 0 
    ? soldDollsInvestment / soldDolls.length 
    : 0;

  const avgSalePrice = soldDolls.length > 0 
    ? totalSales / soldDolls.length 
    : 0;

  // Tasa de venta (sobre muñecas a la venta o vendidas)
  const activeListings = forSaleDolls.length + soldDolls.length;
  const sellRate = activeListings > 0 ? (soldDolls.length / activeListings) * 100 : 0;

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
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-6 py-3 font-semibold text-sm transition-all ${
            activeTab === "stats"
              ? "text-blue-600 border-b-2 border-blue-600 -mb-px"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📊 Estadísticas
        </button>
        <button
          onClick={() => setActiveTab("charts")}
          className={`px-6 py-3 font-semibold text-sm transition-all ${
            activeTab === "charts"
              ? "text-blue-600 border-b-2 border-blue-600 -mb-px"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📈 Gráficos
        </button>
      </div>

      {/* Contenido - Tab Estadísticas */}
      {activeTab === "stats" && (
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
          <p className="text-xs text-slate-600 mt-1">{soldDolls.length}/{activeListings} vendidas</p>
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
      )}

      {/* Contenido - Tab Gráficos */}
      {activeTab === "charts" && (
        <div className="space-y-4">
          {/* Gráfico de Marcas - Pie Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">🎨 Distribución de Marcas</h3>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={getGroupedBrandData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent = 0 }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getGroupedBrandData().map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value} muñecas`}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Leyenda detallada */}
              <div className="flex-1 space-y-3">
                <h4 className="font-semibold text-slate-900 mb-4">Detalles:</h4>
                {getGroupedBrandData().map((item, index) => {
                  const percentage = ((item.value / dolls.length) * 100).toFixed(1);
                  return (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.value} unidades • {percentage}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Gráfico de Estado - Bar Chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">📦 Distribución por Estado</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(dollsByState).map(([state, count]) => ({
                  estado: STATE_DISPLAY_NAMES[state] || state,
                  cantidad: count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estado" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} muñecas`} />
                <Bar dataKey="cantidad" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Estadísticas comparativas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Por marca - Tabla */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4">📊 Ranking de Marcas</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-slate-900">
                        #
                      </th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-900">
                        Marca
                      </th>
                      <th className="text-center px-3 py-2 font-semibold text-slate-900">
                        Cantidad
                      </th>
                      <th className="text-right px-3 py-2 font-semibold text-slate-900">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(dollsByBrand)
                      .sort(([, a], [, b]) => b - a)
                      .map(([brand, count], idx) => {
                        const pct =
                          totalDolls > 0
                            ? ((count / totalDolls) * 100).toFixed(1)
                            : "0.0";
                        return (
                          <tr
                            key={brand}
                            className="border-b border-slate-200 hover:bg-slate-50"
                          >
                            <td className="px-3 py-2 text-slate-500 font-semibold">
                              {idx + 1}
                            </td>
                            <td className="px-3 py-2 text-slate-900 font-medium">
                              {brand}
                            </td>
                            <td className="px-3 py-2 text-center text-slate-900 font-semibold">
                              {count}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-900 font-semibold">
                              {pct}%
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Estadísticas de venta por marca */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                💰 Venta por Marca (Top 5)
              </h3>
              <div className="space-y-3">
                {Object.entries(dollsByBrand)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([brand, count]) => {
                    const brandDolls = dolls.filter(
                      (d) => d.marca_nombre === brand
                    );
                    const sold = brandDolls.filter(
                      (d) => d.estado === "vendida"
                    ).length;
                    const sellRate =
                      count > 0 ? ((sold / count) * 100).toFixed(0) : "0";

                    return (
                      <div
                        key={brand}
                        className="flex items-between justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {brand}
                          </p>
                          <p className="text-xs text-slate-500">
                            {sold}/{count} vendidas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">
                            {sellRate}%
                          </p>
                          <p className="text-xs text-slate-500">
                            tasa venta
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;