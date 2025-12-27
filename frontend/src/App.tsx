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
  } = useApp();

  const handleLoteClickFromDoll = (loteId: number) => {
    const lote = lotes.find((l) => l.id === loteId);
    if (lote) {
      closeDollDetail();
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
            onClick={openDollModal}
            variant="primary"
            icon={<span>+</span>}
          >
            Añadir muñeca
          </Button>
          <div className="mt-6">
            <DollsList />
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
            <LoteList />
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
        closeModal={closeDollModal}
      />
      <AddLoteModal
        isOpen={isLoteModalOpen}
        closeModal={closeLoteModal}
      />
      
      {isDetailModalOpen && selectedDoll && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={closeDollDetail}
          title="Detalle de Muñeca"
          size="lg"
        >
          <DollDetail
            doll={selectedDoll}
            isOpen={isDetailModalOpen}
            onClose={closeDollDetail}
            onLoteClick={handleLoteClickFromDoll}
          />
        </Modal>
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

