export interface Doll {
    id?: number; // ID de la muñeca
    nombre: string; // Nombre de la muñeca
    marca_id: number; // ID de la marca (clave foránea)
    marca_nombre?: string; // Nombre de la marca, opcional si deseas mostrarlo directamente
    modelo: string; // Modelo de la muñeca
    personaje: string; // Personaje asociado a la muñeca
    anyo: number; // Año de la muñeca
    estado: 'vendida' | 'guardada' | 'a la venta'; // Estado actual de la muñeca
    commentarios?: string; // Comentarios opcionales
    imagen?: File | string;
    created_at?: string; // Fecha de creación
    lote_id?: number; // ID del lote asociado
}
