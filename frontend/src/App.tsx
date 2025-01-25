import React, { useState, useEffect } from "react";
import DollsList from "./components/DollsList/DollsList";
import AddDollModal from "./components/AddDollModal/AddDollModal";
import DollDetail from "./components/DollDetail/DollDetail";
import AddLoteModal from "./components/AddLoteModal/AddLoteModal";
import LoteList from "./components/LoteList/LoteList";
import LoteDetail from "./components/LoteDetail/LoteDetail";
import {
  getDolls,
  createDoll,
  deleteDoll,
  getLotes,
  deleteLote,
  createMarca,
} from "./services/api";
import { Doll } from "./types/Doll";
import { Lote } from "./types/Lote";
import AddMarcaModal from "./components/AddMarcaModal/AddMarcaModal";
import Stats from "./components/Stats/Stats";

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
  const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false);

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

  // Initial data loading
  useEffect(() => {
    fetchDolls();
    fetchLotes();
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

  const handleViewDoll = (doll: Doll) => {
    setSelectedDoll(doll);
    setIsDetailModalOpen(true);
  };

  const handleMarcaAdded = async (marca: {
    nombre: string;
    fabricante?: string;
  }) => {
    try {
      const newMarca = { ...marca, id: Date.now() }; // Assuming id is generated as a timestamp
      await createMarca(newMarca);
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

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Tabs navigation */}
      <nav className="flex justify-center bg-white shadow-md">
        <button
          onClick={() => setActiveTab("dolls")}
          className={`px-6 py-3 font-medium ${
            activeTab === "dolls"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          Muñecas
        </button>
        <button
          onClick={() => setActiveTab("lotes")}
          className={`px-6 py-3 font-medium ${
            activeTab === "lotes"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600"
          }`}
        >
          Lotes
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-6 py-3 font-medium ${
            activeTab === "stats"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600"
          }`}
        >
          Estadísticas
        </button>
        <button
          onClick={openMarcaModal}
          className="px-6 py-3 font-medium text-purple-600 hover:text-purple-800"
        >
          Añadir Marca
        </button>
      </nav>

      {/* Content based on active tab */}
      <div className="flex-1 overflow-auto">
        {activeTab === "dolls" && (
          <div className="p-4">
            <section className="bg-white rounded-lg shadow-sm p-6 flex-1 min-h-[400px]">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Muñequitas
                </h1>
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
                  onDelete={handleDeleteDoll}
                  onView={handleViewDoll}
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
    </div>
  );
};

export default App;
