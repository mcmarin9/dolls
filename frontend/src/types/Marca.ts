import { Fabricante } from './Fabricante';
export interface Marca {
    id: number;
    nombre: string;
    fabricantes?: Fabricante[];
    created_at?: string;
}