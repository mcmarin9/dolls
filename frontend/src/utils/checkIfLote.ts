import { Doll } from "../types/Doll";
import { Lote } from "../types/Lote";

export const fetchDollLotes = async (
  dollId: number | undefined
): Promise<Lote[]> => {
  if (!dollId) {
    return [];
  }

  const response = await fetch(
    `http://localhost:5000/api/dolls/${dollId}/lotes`
  );
  if (!response.ok) throw new Error("Error al cargar los lotes");
  return await response.json();
};

// Versiones asíncronas
export const checkEnLoteCompra = async (doll: Doll): Promise<boolean> => {
  if (!doll?.id) {
    return false;
  }
  try {
    const lotes = await fetchDollLotes(doll.id);
    return lotes.some((lote) => lote?.tipo?.toLowerCase() === "compra");
  } catch (error) {
    console.error("Error al verificar lote de compra:", error);
    return false;
  }
};

export const checkEnLoteVenta = async (doll: Doll): Promise<boolean> => {
  if (!doll?.id) {
    return false;
  }
  try {
    const lotes = await fetchDollLotes(doll.id);
    return lotes.some((lote) => lote?.tipo?.toLowerCase() === "venta");
  } catch (error) {
    console.error("Error al verificar lote de venta:", error);
    return false;
  }
};