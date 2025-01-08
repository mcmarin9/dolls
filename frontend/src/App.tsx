import React, { useState, useEffect } from "react";
import DollsList from "./components/DollsList/DollsList";
import AddDollModal from "./components/AddDollModal/AddDollModal";
import DollDetail from "./components/DollDetail/DollDetail";
import AddLoteModal from "./components/AddLoteModal/AddLoteModal";
import LoteList from "./components/LoteList/LoteList";
import { getDolls, addDoll } from "./services/api";
import { Doll } from "./types/Doll";
import { Lote } from "./types/Lote";

const App: React.FC = () => {
  // States
  const [activeTab, setActiveTab] = useState<"dolls" | "lotes">("dolls");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);
  const [dolls, setDolls] = useState<Doll[]>([]);
  const [selectedDoll, setSelectedDoll] = useState<Doll | null>(null);
  const [lotes, setLotes] = useState<Lote[]>([]);

  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openLoteModal = () => setIsLoteModalOpen(true);
  const closeLoteModal = () => setIsLoteModalOpen(false);
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDoll(null);
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
      const response = await fetch("http://localhost:5000/api/lotes");
      if (!response.ok) throw new Error("Failed to fetch lotes");
      const data = await response.json();
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
    await fetchLotes(); // Refresh lotes after adding
    closeLoteModal();
  };

  const handleDeleteLote = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/lotes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete lote");
      setLotes(lotes.filter((lote) => lote.id !== id));
    } catch (error) {
      console.error("Error deleting lote:", error);
    }
  };

  const handleViewLote = (lote: Lote) => {
    console.log("Viewing lote:", lote);
    // Implement lote detail view logic here
  };

  const addNewDoll = async (dollData: Doll) => {
    try {
      const newDoll = await addDoll(dollData);
      setDolls((prevDolls) => [...prevDolls, newDoll]);
      closeModal();
    } catch (error) {
      console.error("Error adding doll:", error);
      alert("Failed to add doll");
    }
  };

  const handleDeleteDoll = (id: number) => {
    setDolls((prevDolls) => prevDolls.filter((doll) => doll.id !== id));
  };

  const handleViewDoll = (doll: Doll) => {
    setSelectedDoll(doll);
    setIsDetailModalOpen(true);
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
      </nav>

      {/* Content based on active tab */}
      <div className="flex-1 overflow-auto">
        {activeTab === "dolls" && (
          <div className="p-4">
            <section className="bg-white rounded-lg shadow-sm p-6 flex-1 min-h-[400px]">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dolls Manager</h1>
              </div>
              <button
                onClick={openModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="mr-2">+</span> Add New Doll
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

      {/* Modals */}
      <AddDollModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        onDollAdded={addNewDoll}
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
              <DollDetail doll={selectedDoll} />
              <button
                onClick={closeDetailModal}
                className="mt-6 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors duration-200 shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
