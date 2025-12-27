import React, { createContext, useState, useCallback, useEffect } from "react";
import { Doll } from "../types/Doll";
import { Lote } from "../types/Lote";
import { Marca } from "../types/Marca";
import {
  getDolls,
  createDoll,
  deleteDoll,
  getLotes,
  deleteLote,
  createMarca,
  updateDoll,
  updateLote,
  getMarcas,
} from "../services/api";

export interface AppContextType {
  // State
  activeTab: "dolls" | "lotes" | "stats";
  dolls: Doll[];
  selectedDoll: Doll | null;
  lotes: Lote[];
  selectedLote: Lote | null;
  brands: Marca[];
  isModalOpen: boolean;
  isDetailModalOpen: boolean;
  isLoteModalOpen: boolean;
  isLoteDetailOpen: boolean;
  isMarcaModalOpen: boolean;
  isEditModalOpen: boolean;
  isEditLoteModalOpen: boolean;
  loading: boolean;

  // Actions - Tab
  setActiveTab: (tab: "dolls" | "lotes" | "stats") => void;

  // Actions - Dolls
  fetchDolls: () => Promise<void>;
  setSelectedDoll: (doll: Doll | null) => void;
  openDollModal: () => void;
  closeDollModal: () => void;
  openDollDetail: (doll: Doll) => void;
  closeDollDetail: () => void;
  openEditDoll: (doll: Doll) => void;
  closeEditDoll: () => void;
  addDoll: (formData: FormData) => Promise<void>;
  removeDoll: (id: number) => Promise<void>;
  editDoll: (id: number, formData: FormData) => Promise<void>;

  // Actions - Lotes
  fetchLotes: () => Promise<void>;
  setSelectedLote: (lote: Lote | null) => void;
  openLoteModal: () => void;
  closeLoteModal: () => void;
  openLoteDetail: (lote: Lote) => void;
  closeLoteDetail: () => void;
  openEditLote: (lote: Lote) => void;
  closeEditLote: () => void;
  removeLote: (id: number) => Promise<void>;
  editLote: (id: number, data: Pick<Lote, "nombre" | "tipo"> & { precio_total: number; dolls: number[] }) => Promise<void>;

  // Actions - Brands
  fetchBrands: () => Promise<void>;
  openMarcaModal: () => void;
  closeMarcaModal: () => void;
  addMarca: (marca: { nombre: string; fabricanteIds: number[] }) => Promise<Marca>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export { AppContext };

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State
  const [activeTab, setActiveTab] = useState<"dolls" | "lotes" | "stats">("dolls");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
  const [isLoteDetailOpen, setIsLoteDetailOpen] = useState(false);
  const [dolls, setDolls] = useState<Doll[]>([]);
  const [selectedDoll, setSelectedDoll] = useState<Doll | null>(null);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [brands, setBrands] = useState<Marca[]>([]);
  const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditLoteModalOpen, setIsEditLoteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch functions
  const fetchDolls = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDolls();
      setDolls(data);
    } catch (error) {
      console.error("Error fetching dolls:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLotes();
      setLotes(data);
    } catch (error) {
      console.error("Error fetching lotes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMarcas();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchDolls();
    fetchLotes();
    fetchBrands();
  }, [fetchDolls, fetchLotes, fetchBrands]);

  // Modal handlers
  const openDollModal = useCallback(() => setIsModalOpen(true), []);
  const closeDollModal = useCallback(() => setIsModalOpen(false), []);

  const openDollDetail = useCallback((doll: Doll) => {
    setSelectedDoll(doll);
    setIsDetailModalOpen(true);
  }, []);

  const closeDollDetail = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedDoll(null);
  }, []);

  const openEditDoll = useCallback((doll: Doll) => {
    setSelectedDoll(doll);
    setIsEditModalOpen(true);
  }, []);

  const closeEditDoll = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedDoll(null);
  }, []);

  const openLoteModal = useCallback(() => setIsLoteModalOpen(true), []);
  const closeLoteModal = useCallback(() => setIsLoteModalOpen(false), []);

  const openLoteDetail = useCallback((lote: Lote) => {
    setSelectedLote(lote);
    setIsLoteDetailOpen(true);
  }, []);

  const closeLoteDetail = useCallback(() => {
    setIsLoteDetailOpen(false);
    setSelectedLote(null);
  }, []);

  const openEditLote = useCallback((lote: Lote) => {
    setSelectedLote(lote);
    setIsEditLoteModalOpen(true);
  }, []);

  const closeEditLote = useCallback(() => {
    setIsEditLoteModalOpen(false);
    setSelectedLote(null);
  }, []);

  const openMarcaModal = useCallback(() => setIsMarcaModalOpen(true), []);
  const closeMarcaModal = useCallback(() => setIsMarcaModalOpen(false), []);

  // API operations
  const addDoll = useCallback(
    async (formData: FormData) => {
      try {
        setLoading(true);
        await createDoll(formData);
        await fetchDolls();
        closeDollModal();
      } catch (error) {
        console.error("Error adding doll:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchDolls, closeDollModal]
  );

  const removeDoll = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        await deleteDoll(id);
        await fetchDolls();
      } catch (error) {
        console.error("Error deleting doll:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchDolls]
  );

  const editDoll = useCallback(
    async (id: number, formData: FormData) => {
      try {
        setLoading(true);
        await updateDoll(id, formData);
        await fetchDolls();
        closeEditDoll();
      } catch (error) {
        console.error("Error updating doll:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchDolls, closeEditDoll]
  );

  const removeLote = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        await deleteLote(id);
        await fetchLotes();
      } catch (error) {
        console.error("Error deleting lote:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchLotes]
  );

  const editLote = useCallback(
    async (
      id: number,
      loteData: Pick<Lote, "nombre" | "tipo"> & {
        precio_total: number;
        dolls: number[];
      }
    ) => {
      try {
        setLoading(true);
        await updateLote(id, loteData);
        await fetchLotes();
        closeEditLote();
      } catch (error) {
        console.error("Error updating lote:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchLotes, closeEditLote]
  );

  const addMarca = useCallback(
    async (marca: { nombre: string; fabricanteIds: number[] }) => {
      try {
        setLoading(true);
        const newMarca = await createMarca({
          nombre: marca.nombre,
          fabricanteIds: marca.fabricanteIds,
        });
        await fetchBrands();
        closeMarcaModal();
        return newMarca;
      } catch (error) {
        console.error("Error adding marca:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchBrands, closeMarcaModal]
  );

  const value: AppContextType = {
    // State
    activeTab,
    dolls,
    selectedDoll,
    lotes,
    selectedLote,
    brands,
    isModalOpen,
    isDetailModalOpen,
    isLoteModalOpen,
    isLoteDetailOpen,
    isMarcaModalOpen,
    isEditModalOpen,
    isEditLoteModalOpen,
    loading,

    // Actions
    setActiveTab,
    setSelectedDoll,
    fetchDolls,
    openDollModal,
    closeDollModal,
    openDollDetail,
    closeDollDetail,
    openEditDoll,
    closeEditDoll,
    addDoll,
    removeDoll,
    editDoll,
    fetchLotes,
    setSelectedLote,
    openLoteModal,
    closeLoteModal,
    openLoteDetail,
    closeLoteDetail,
    openEditLote,
    closeEditLote,
    removeLote,
    editLote,
    fetchBrands,
    openMarcaModal,
    closeMarcaModal,
    addMarca,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
