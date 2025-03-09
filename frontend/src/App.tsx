import React, { useState, useEffect } from "react";
import Layout from './components/layout/Layout/Layout';
import Section from './components/common/Section/Section';
import Modal from './components/common/Modal/Modal';
import Button from './components/common/Button/Button';
import DollsList from "./components/dolls/DollsList/DollsList";
import AddDollModal from "./components/dolls/AddDollModal/AddDollModal";
import DollDetail from "./components/dolls/DollDetail/DollDetail";
import AddLoteModal from "./components/lotes/AddLoteModal/AddLoteModal";
import EditDoll from "./components/dolls/EditDoll/EditDoll";
import EditLote from "./components/lotes/EditLote/EditLote"; // Ensure this path is correct or update it to the correct path
import LoteList from "./components/lotes/LoteList/LoteList";
import LoteDetail from "./components/lotes/LoteDetail/LoteDetail";
import {
  getDolls,
  createDoll,
  deleteDoll,
  getLotes,
  deleteLote,
  createMarca,
  updateDoll,
  updateLote,
} from "./services/api";
import { Doll } from "./types/Doll";
import { Lote } from "./types/Lote";
import AddMarcaModal from "./components/marcas/AddMarcaModal/AddMarcaModal";
import Stats from "./components/Stats/Stats";
import { Marca } from "./types/Marca";

const App: React.FC = () => {
  // States
  const [activeTab, setActiveTab] = useState<"dolls" | "lotes" | "stats">(
    "dolls"
  );
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

  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openLoteModal = () => setIsLoteModalOpen(true);
  const closeLoteModal = () => setIsLoteModalOpen(false);
  const openMarcaModal = () => setIsMarcaModalOpen(true);
  const closeMarcaModal = () => setIsMarcaModalOpen(false);

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDoll(null);
  };

  const handleCloseLoteDetail = () => {
    setIsLoteDetailOpen(false);
    setSelectedLote(null);
  };

  // Fetch functions
  const fetchDolls = async () => {
    try {
      const data = await getDolls();
      setDolls(data);
    } catch (error) {
      console.error("Error fetching dolls:", error);
    }
  };

  const fetchLotes = async () => {
    try {
      const data = await getLotes();
      setLotes(data);
    } catch (error) {
      console.error("Error fetching lotes:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/marcas");
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchDolls();
    fetchLotes();
    fetchBrands();
  }, []);

  // Handlers
  const handleLoteAdded = async () => {
    await fetchLotes();
    closeLoteModal();
  };

  const handleDeleteLote = async (id: number) => {
    try {
      await deleteLote(id);
      await fetchLotes();
    } catch (error) {
      console.error("Error deleting lote:", error);
      alert("Failed to delete lote");
    }
  };

  const handleViewLote = (lote: Lote) => {
    setSelectedLote(lote);
    setIsLoteDetailOpen(true);
  };

  const handleDollAdded = async (formData: FormData) => {
    try {
      await createDoll(formData);
      await fetchDolls(); // Refresh the list
      closeModal();
    } catch (error) {
      console.error("Error adding doll:", error);
      alert("Failed to add doll");
    }
  };

  const handleDeleteDoll = async (id: number) => {
    try {
      await deleteDoll(id);
      await fetchDolls();
    } catch (error) {
      console.error("Error deleting doll:", error);
      alert("Failed to delete doll");
    }
  };

  const handleEditDoll = async (doll: Doll) => {
    setSelectedDoll(doll);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (id: number, formData: FormData) => {
    try {
      await updateDoll(id, formData);
      fetchDolls();
      setIsEditModalOpen(false);
      setSelectedDoll(null);
    } catch (error) {
      console.error("Error updating doll:", error);
    }
  };

  const handleViewDoll = (doll: Doll) => {
    setSelectedDoll(doll);
    setIsDetailModalOpen(true);
  };

  const handleMarcaAdded = async (marca: {
    nombre: string;
    fabricante?: string;
  }) => {
    try {
      const newMarca = { ...marca, id: Date.now(), fabricanteIds: [] };
      await createMarca(newMarca);
      await fetchDolls();
      await fetchBrands(); // Add this line
      closeMarcaModal();
    } catch (error) {
      console.error("Error adding marca:", error);
      alert("Failed to add marca");
    }
  };

  const handleLoteClickFromDoll = (loteId: number) => {
    const lote = lotes.find((l) => l.id === loteId);
    if (lote) {
      setSelectedDoll(null);
      setIsDetailModalOpen(false);
      setSelectedLote(lote);
      setIsLoteDetailOpen(true);
    }
  };
  const handleEditLote = (lote: Lote) => {
    setSelectedLote(lote);
    setIsEditLoteModalOpen(true);
  };

  const handleEditLoteSubmit = async (
    id: number,
    loteData: Pick<Lote, "nombre" | "tipo"> & {
      precio_total: number;
      dolls: number[];
    }
  ) => {
    try {
      console.log('Updating lote with data:', loteData); // Debug log
      const response = await updateLote(id, loteData);
      console.log('Update response:', response); // Debug log
      await fetchLotes();
      setIsEditLoteModalOpen(false);
      setSelectedLote(null);
    } catch (error) {
      console.error("Error updating lote:", error);
      throw new Error(error instanceof Error ? 
        error.message : 
        "No se pudo actualizar el lote. Verifica la conexión con el servidor."
      );
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      openMarcaModal={openMarcaModal}
    >
      {activeTab === "dolls" && (
        <Section title="Muñequitas">
          <Button
            onClick={openModal}
            variant="primary"
            icon={<span>+</span>}
          >
            Añadir muñeca
          </Button>
          <div className="mt-6">
            <DollsList
              dolls={dolls}
              brands={brands}
              onDelete={handleDeleteDoll}
              onView={handleViewDoll}
              onEdit={handleEditDoll}
            />
          </div>
        </Section>
      )}
  
      {activeTab === "lotes" && (
        <Section title="Gestión de Lotes">
          <Button
            onClick={openLoteModal}
            variant="success"
            icon={<span>+</span>}
          >
            Crear Lote
          </Button>
          <div className="mt-6">
            <LoteList
              lotes={lotes}
              onDelete={handleDeleteLote}
              onView={handleViewLote}
              onEdit={handleEditLote}
            />
          </div>
        </Section>
      )}
  
      {activeTab === "stats" && (
        <Section title="Estadísticas">
          <Stats dolls={dolls} lotes={lotes} />
        </Section>
      )}
  
      {/* Modals */}
      <AddDollModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        onDollAdded={handleDollAdded}
      />
      <AddLoteModal
        isOpen={isLoteModalOpen}
        closeModal={closeLoteModal}
        onLoteAdded={handleLoteAdded}
      />
      
      {isDetailModalOpen && selectedDoll && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          title="Detalle de Muñeca"
          size="lg"
        >
          <DollDetail
            doll={selectedDoll}
            isOpen={isDetailModalOpen}
            onClose={closeDetailModal}
            onLoteClick={handleLoteClickFromDoll}
          />
        </Modal>
      )}
  
      {selectedLote && (
        <LoteDetail
          lote={selectedLote}
          isOpen={isLoteDetailOpen}
          onClose={handleCloseLoteDetail}
        />
      )}
  
      <AddMarcaModal
        isOpen={isMarcaModalOpen}
        closeModal={closeMarcaModal}
        onMarcaAdded={handleMarcaAdded}
      />
  
      {selectedDoll && (
        <EditDoll
          isOpen={isEditModalOpen}
          closeModal={() => {
            setIsEditModalOpen(false);
            setSelectedDoll(null);
          }}
          doll={selectedDoll}
          onEdit={handleEditSubmit}
        />
      )}
  
      {selectedLote && (
        <EditLote
          isOpen={isEditLoteModalOpen}
          closeModal={() => {
            setIsEditLoteModalOpen(false);
            setSelectedLote(null);
          }}
          lote={selectedLote}
          onEdit={handleEditLoteSubmit}
        />
      )}
    </Layout>
  );
};

export default App;
