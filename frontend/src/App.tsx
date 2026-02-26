import React from "react";
import { useApp } from "./context";
import { getLote } from "./services/api";
import Layout from './components/layout/Layout/Layout';
import DollsList from "./components/dolls/DollsList/DollsList";
import AddDollModal from "./components/dolls/AddDollModal/AddDollModal";
import CopyDollModal from "./components/dolls/CopyDollModal/CopyDollModal";
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
    isCopyDollModalOpen,
    openDollModal,
    closeDollModal,
    closeDollDetail,
    closeEditDoll,
    openCopyDollModal,
    closeCopyDollModal,
    openPriceCalculator,
    openLoteModal,
    closeLoteModal,
    closeLoteDetail,
    closeEditLote,
    openMarcaModal,
    closeMarcaModal,
    openLoteDetail,
  } = useApp();

  const handleLoteClickFromDoll = async (lote: Lote) => {
    if (!lote?.id) return;

    closeDollDetail();

    try {
      const loteDetallado = await getLote(lote.id);
      openLoteDetail(loteDetallado);
    } catch (err) {
      // Fallback al lote recibido si la petición falla
      const loteDesdeEstado = lotes.find((item) => item.id === lote.id);
      openLoteDetail(loteDesdeEstado ?? lote);
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
      onCopyClick={activeTab === 'dolls' ? openCopyDollModal : undefined}
      onPriceCalculatorClick={activeTab === 'dolls' ? openPriceCalculator : undefined}
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
      <CopyDollModal
        isOpen={isCopyDollModalOpen}
        closeModal={closeCopyDollModal}
        dolls={dolls}
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

