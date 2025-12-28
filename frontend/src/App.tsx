import React from "react";
import { useApp } from "./context";
import Layout from './components/layout/Layout/Layout';
import Section from './components/common/Section/Section';
import Modal from './components/common/Modal/Modal';
import Button from './components/common/Button/Button';
import DollsList from "./components/dolls/DollsList/DollsList";
import AddDollModal from "./components/dolls/AddDollModal/AddDollModal";
import DollDetail from "./components/dolls/DollDetail/DollDetail";
import AddLoteModal from "./components/lotes/AddLoteModal/AddLoteModal";
import EditDoll from "./components/dolls/EditDoll/EditDoll";
import EditLote from "./components/lotes/EditLote/EditLote";
import LoteList from "./components/lotes/LoteList/LoteList";
import LoteDetail from "./components/lotes/LoteDetail/LoteDetail";
import AddMarcaModal from "./components/marcas/AddMarcaModal/AddMarcaModal";
import Stats from "./components/Stats/Stats";

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    dolls,
    selectedDoll,
    lotes,
    selectedLote,
    isModalOpen,
    isDetailModalOpen,
    isLoteModalOpen,
    isLoteDetailOpen,
    isMarcaModalOpen,
    isEditModalOpen,
    isEditLoteModalOpen,
    openDollModal,
    closeDollModal,
    closeDollDetail,
    closeEditDoll,
    openLoteModal,
    closeLoteModal,
    closeLoteDetail,
    closeEditLote,
    openMarcaModal,
    closeMarcaModal,
    openLoteDetail,
  } = useApp();

  const handleLoteClickFromDoll = (loteId: number) => {
    const lote = lotes.find((l) => l.id === loteId);
    if (lote) {
      closeDollDetail();
      openLoteDetail(lote);
    }
  };

  const getAddClickHandler = () => {
    switch (activeTab) {
      case 'dolls':
        return openDollModal;
      case 'lotes':
        return openLoteModal;
      default:
        return undefined;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      openMarcaModal={openMarcaModal}
      onAddClick={getAddClickHandler()}
    >
      {activeTab === "dolls" && (
        <div className="p-6">
          <DollsList />
        </div>
      )}
  
      {activeTab === "lotes" && (
        <div className="p-6">
          <LoteList />
        </div>
      )}
  
      {activeTab === "stats" && (
        <div className="p-6">
          <Stats dolls={dolls} lotes={lotes} />
        </div>
      )}
  
      {/* Modals */}
      <AddDollModal
        isOpen={isModalOpen}
        closeModal={closeDollModal}
      />
      <AddLoteModal
        isOpen={isLoteModalOpen}
        closeModal={closeLoteModal}
      />
      
      {isDetailModalOpen && selectedDoll && (
        <DollDetail
          doll={selectedDoll}
          isOpen={isDetailModalOpen}
          onClose={closeDollDetail}
          onLoteClick={handleLoteClickFromDoll}
        />
      )}
  
      {selectedLote && (
        <LoteDetail
          lote={selectedLote}
          isOpen={isLoteDetailOpen}
          onClose={closeLoteDetail}
        />
      )}
  
      <AddMarcaModal
        isOpen={isMarcaModalOpen}
        closeModal={closeMarcaModal}
      />
  
      {selectedDoll && (
        <EditDoll
          isOpen={isEditModalOpen}
          closeModal={closeEditDoll}
          doll={selectedDoll}
        />
      )}
  
      {selectedLote && (
        <EditLote
          isOpen={isEditLoteModalOpen}
          closeModal={closeEditLote}
          lote={selectedLote}
        />
      )}
    </Layout>
  );
};

export default AppContent;

