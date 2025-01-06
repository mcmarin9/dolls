export interface Lote {
    id?: number;
    nombre: string;
    type: 'compra' | 'venta';
    total_price: number;
    dolls?: number[];
    quantity?: number;
    created_at?: string;
}