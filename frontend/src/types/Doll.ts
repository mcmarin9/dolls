import { Lote } from './Lote';

export interface Doll {
    id?: number;
    nombre: string;
    marca_id: number;
    marca_nombre?: string;
    fabricante_id?: number;
    fabricante_nombre?: string;
    modelo: string;
    personaje: string;
    anyo: number;
    comentarios?: string;
    imagen?: string | File;
    created_at?: string;
    estado?: string;
    fecha_compra?: string;
    precio_compra?: number;
    fecha_venta?: string;
    precio_venta?: number;
    lotes?: Lote[];  // Array of related lotes
    lote_ids?: number[];  // Array of lote IDs
}