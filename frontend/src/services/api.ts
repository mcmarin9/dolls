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
  const response = await fetch(`${API_URL}/dolls`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to create doll");
  }
  return data;
};

export const updateDoll = async (id: number, formData: FormData): Promise<Doll> => {
  try {
    const response = await fetch(`${API_URL}/dolls/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update doll');
    }

    return await response.json();
  } catch (error) {
    console.error('Update doll error:', error);
    throw error;
  }
};

export const deleteDoll = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/dolls/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete doll");
};

// Lotes Endpoints
export const getLotes = async (): Promise<Lote[]> => {
  const response = await fetch(`${API_URL}/lotes`);
  if (!response.ok) throw new Error("Failed to fetch lotes");
  const data = await response.json();
  // Ensure dolls array exists
  return data.map((lote: Lote) => ({
    ...lote,
    dolls: lote.dolls || []
  }));
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
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create lote");
  }
  return response.json();
};

export const deleteLote = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/lotes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete lote");
};

export const updateLote = async (
  id: number,
  data: {
    nombre: string;
    tipo: string;
    precio_total: number;
    dolls: number[];
  }
) => {
  const response = await fetch(`http://localhost:5000/api/lotes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return await response.json();
};

// Lote-Doll Association Endpoints
export const getLoteDolls = async (loteId: number): Promise<Doll[]> => {
  const response = await fetch(`${API_URL}/lotes/${loteId}/dolls`);
  if (!response.ok) throw new Error("Failed to fetch dolls for lote");
  return response.json();
};

export const addDollToLote = async (loteId: number, dollId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/lote-doll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lote_id: loteId, doll_id: dollId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to add doll to lote");
  }
};

export const removeDollFromLote = async (loteId: number, dollId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/lote-doll`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lote_id: loteId, doll_id: dollId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove doll from lote");
  }
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