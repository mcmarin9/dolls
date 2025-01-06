import { Doll } from "../types/Doll";

const API_URL = "http://localhost:5000/api";

export const getDolls = async (): Promise<Doll[]> => {
  const response = await fetch(`${API_URL}/dolls`);
  if (!response.ok) {
    throw new Error("Failed to fetch dolls");
  }
  return response.json();
};

export const addDoll = async (doll: Doll): Promise<Doll> => {
  const response = await fetch(`${API_URL}/dolls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doll),
  });
  if (!response.ok) {
    throw new Error("Failed to add doll");
  }
  return response.json();
};

export const deleteDoll = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/dolls/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete doll");
  }
};
