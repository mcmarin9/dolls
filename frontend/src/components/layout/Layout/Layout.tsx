import React from 'react';
import Navbar from '../Navbar/Navbar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: "dolls" | "lotes" | "stats";
  setActiveTab: (tab: "dolls" | "lotes" | "stats") => void;
  openMarcaModal: () => void;
  onAddClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  openMarcaModal,
  onAddClick
}) => {
  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openMarcaModal={openMarcaModal}
        onAddClick={onAddClick}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;