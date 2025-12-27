import axios from "axios";
import { Doll } from "../types/Doll";
import { Lote } from "../types/Lote";
import { Fabricante } from "../types/Fabricante";
import { Marca } from "../types/Marca";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Dolls Endpoints
export const getDolls = async (): Promise<Doll[]> => {
  const response = await api.get("/dolls");
  return response.data;
};

export const getDoll = async (id: number): Promise<Doll> => {
  const response = await api.get(`/dolls/${id}`);
  return response.data;
};

export const createDoll = async (formData: FormData): Promise<Doll> => {
  const response = await api.post("/dolls", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateDoll = async (id: number, formData: FormData): Promise<Doll> => {
  const response = await api.put(`/dolls/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteDoll = async (id: number): Promise<void> => {
  await api.delete(`/dolls/${id}`);
};

// Lotes Endpoints
export const getLotes = async (): Promise<Lote[]> => {
  const response = await api.get("/lotes");
  const data = response.data;
  return data.map((lote: Lote) => ({
    ...lote,
    dolls: lote.dolls || []
  }));
};

export const getLote = async (id: number): Promise<Lote> => {
  const response = await api.get(`/lotes/${id}`);
  return response.data;
};

export const createLote = async (lote: Lote): Promise<Lote> => {
  const response = await api.post("/lotes", lote);
  return response.data;
};

export const deleteLote = async (id: number): Promise<void> => {
  await api.delete(`/lotes/${id}`);
};

export const updateLote = async (
  id: number,
  data: {
    nombre: string;
    tipo: string;
    precio_total: number;
    dolls: number[];
  }
): Promise<Lote> => {
  const response = await api.put(`/lotes/${id}`, data);
  return response.data;
};

// Lote-Doll Association Endpoints
export const getLoteDolls = async (loteId: number): Promise<Doll[]> => {
  const response = await api.get(`/lotes/${loteId}/dolls`);
  return response.data;
};

export const addDollToLote = async (loteId: number, dollId: number): Promise<void> => {
  await api.post("/lote-doll", { lote_id: loteId, doll_id: dollId });
};

export const removeDollFromLote = async (loteId: number, dollId: number): Promise<void> => {
  await api.delete("/lote-doll", {
    data: { lote_id: loteId, doll_id: dollId },
  });
};

// Brands Endpoints
export const getMarcas = async (): Promise<Marca[]> => {
  const response = await api.get("/marcas");
  return response.data;
};

export const getMarca = async (id: number): Promise<Marca> => {
  const response = await api.get(`/marcas/${id}`);
  return response.data;
};

export const getFabricantes = async (): Promise<Fabricante[]> => {
  const response = await api.get("/fabricantes");
  return response.data;
};

export const createMarca = async (data: { 
  nombre: string; 
  fabricanteIds: number[] 
}): Promise<Marca> => {
  const response = await api.post("/marcas", data);
  return response.data;
};

export const updateMarca = async (
  id: number, 
  data: { 
    nombre?: string; 
    fabricanteIds?: number[] 
  }
): Promise<Marca> => {
  const response = await api.put(`/marcas/${id}`, data);
  return response.data;
};

export const deleteMarca = async (id: number): Promise<void> => {
  await api.delete(`/marcas/${id}`);
};

export const deleteImage = async (imagePath: string | null): Promise<void> => {
  if (!imagePath) return;
  await api.post("/delete-image", { imagePath });
};