export interface Doll {
    id?: number;
    nombre: string;
    marca: string;
    modelo: string;
    personaje: string;
    anyo: number;
    estado: 'vendida' | 'guardada' | 'a la venta';
    commentarios?: string;
    imagen?: string;
    created_at?: string;
    lote_id?: number;
}