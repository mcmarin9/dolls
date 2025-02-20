import React, { useState, useEffect } from "react";
import Navbar from './components/Navbar/Navbar';
import DollsList from "./components/DollsList/DollsList";
import AddDollModal from "./components/AddDollModal/AddDollModal";
import DollDetail from "./components/DollDetail/DollDetail";
import AddLoteModal from "./components/AddLoteModal/AddLoteModal";
import EditDoll from "./components/EditDoll/EditDoll";
import EditLote from "./components/EditLote/EditLote"; // Ensure this path is correct or update it to the correct path
import LoteList from "./components/LoteList/LoteList";
import LoteDetail from "./components/LoteDetail/LoteDetail";
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
import AddMarcaModal from "./components/AddMarcaModal/AddMarcaModal";
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
      const newMarca = { ...marca, id: Date.now() };
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
    <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
    <Navbar 
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      openMarcaModal={openMarcaModal}
    />

      {/* Content based on active tab */}
      <div className="flex-1 overflow-auto">
        {activeTab === "dolls" && (
          <div className="p-4">
            <section className="bg-white rounded-lg shadow-sm p-6 flex-1 min-h-[400px]">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Muñequitas</h1>
              </div>
              <button
                onClick={openModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="mr-2">+</span> Añadir muñeca
              </button>
              <div className="mt-6">
                <DollsList
                  dolls={dolls}
                  brands={brands}
                  onDelete={handleDeleteDoll}
                  onView={handleViewDoll}
                  onEdit={handleEditDoll}
                />
              </div>
            </section>
          </div>
        )}

        {activeTab === "lotes" && (
          <div className="p-4">
            <section className="bg-white rounded-lg shadow-sm p-6 flex-1 min-h-[400px]">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestión de Lotes
                </h1>
              </div>
              <button
                onClick={openLoteModal}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="mr-2">+</span> Crear Lote
              </button>
              <div className="mt-6">
                <LoteList
                  lotes={lotes}
                  onDelete={handleDeleteLote}
                  onView={handleViewLote}
                  onEdit={handleEditLote}
                />
              </div>
            </section>
          </div>
        )}
      </div>

      {activeTab === "stats" && (
        <div className="p-4">
          <section className="bg-white rounded-lg shadow-sm p-6 flex-1 min-h-[400px]">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Estadísticas</h1>
            </div>
            <Stats dolls={dolls} lotes={lotes} />
          </section>
        </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <DollDetail
                doll={selectedDoll}
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                onLoteClick={handleLoteClickFromDoll}
              />
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default App;
