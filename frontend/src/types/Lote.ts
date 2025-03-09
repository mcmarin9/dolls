// Lote.ts
import { Doll } from "./Doll";
export interface Lote {
  id: number;
  nombre: string;
  tipo: "compra" | "venta";
  precio_total?: number; 
  created_at?: string; 
  dolls?: Doll[];
  cantidad_munecas?: number; 
  precio_unitario?: number; 
}
