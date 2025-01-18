// Lote.ts
import { Doll } from "./Doll";
export interface Lote {
  id: number;
  nombre: string;
  tipo: "compra" | "venta";
  precio_total?: number; // Match DB field
  created_at?: string; // Match DB field
  dolls?: Doll[];
}
