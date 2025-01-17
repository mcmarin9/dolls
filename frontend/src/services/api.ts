import { Doll } from "../types/Doll";
import { Lote } from "../types/Lote";
import { Marca } from "../types/Marca";

const API_URL = "http://localhost:5000/api";

// Dolls Endpoints
export const getDolls = async (): Promise<Doll[]> => {
  const response = await fetch(`${API_URL}/dolls`);
  if (!response.ok) throw new Error("Failed to fetch dolls");
  return response.json();
};

export const getDoll = async (id: number): Promise<Doll> => {
  const response = await fetch(`${API_URL}/dolls/${id}`);
  if (!response.ok) throw new Error("Failed to fetch doll");
  return response.json();
};

export const createDoll = async (formData: FormData): Promise<Doll> => {
  // Debug FormData contents
  console.log('Debug - FormData contents:');
  Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
  });

  const response = await fetch(`${API_URL}/dolls`, {
      method: 'POST',
      // Remove any Content-Type header to let browser handle multipart/form-data
      body: formData
  });

  const data = await response.json();
  console.log('Server response:', data);

  if (!response.ok) {
      throw new Error(data.error || 'Failed to create doll');
  }

  return data;
};

export const updateDoll = async (id: number, doll: Partial<Doll>): Promise<Doll> => {
  const response = await fetch(`${API_URL}/dolls/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doll),
  });
  if (!response.ok) throw new Error("Failed to update doll");
  return response.json();
};

export const deleteDoll = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/dolls/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete doll");
};

// Lots Endpoints
export const getLotes = async (): Promise<Lote[]> => {
  const response = await fetch(`${API_URL}/lotes`);
  if (!response.ok) throw new Error("Failed to fetch lotes");
  return response.json();
};

export const getLote = async (id: number): Promise<Lote> => {
  const response = await fetch(`${API_URL}/lotes/${id}`);
  if (!response.ok) throw new Error("Failed to fetch lote");
  return response.json();
};

export const createLote = async (lote: Lote): Promise<Lote> => {
  const response = await fetch(`${API_URL}/lotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lote),
  });
  if (!response.ok) throw new Error("Failed to create lote");
  return response.json();
};

export const deleteLote = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/lotes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete lote");
};

export const getLoteDolls = async (loteId: number): Promise<Doll[]> => {
  const response = await fetch(`${API_URL}/lotes/${loteId}/dolls`);
  if (!response.ok) throw new Error("Failed to fetch lote dolls");
  return response.json();
};

export const addDollToLote = async (loteId: number, dollId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/dolls/${dollId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lote_id: loteId }),
  });
  if (!response.ok) throw new Error("Failed to add doll to lote");
};

// Brands Endpoints
export const getMarcas = async (): Promise<Marca[]> => {
  const response = await fetch(`${API_URL}/marcas`);
  if (!response.ok) throw new Error("Failed to fetch brands");
  return response.json();
};

export const getMarca = async (id: number): Promise<Marca> => {
  const response = await fetch(`${API_URL}/marcas/${id}`);
  if (!response.ok) throw new Error("Failed to fetch brand");
  return response.json();
};

export const createMarca = async (marca: Marca): Promise<Marca> => {
  const response = await fetch(`${API_URL}/marcas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(marca),
  });
  if (!response.ok) throw new Error("Failed to create brand");
  return response.json();
};

export const updateMarca = async (id: number, marca: Partial<Marca>): Promise<Marca> => {
  const response = await fetch(`${API_URL}/marcas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(marca),
  });
  if (!response.ok) throw new Error("Failed to update brand");
  return response.json();
};

export const deleteMarca = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/marcas/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete brand");
};

export const deleteImage = async (imagePath: string | null): Promise<void> => {
  if (!imagePath) return;

  try {
    const response = await fetch(`${API_URL}/delete-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imagePath }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};