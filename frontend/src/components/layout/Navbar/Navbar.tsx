import React from 'react';

interface NavbarProps {
  activeTab: 'dolls' | 'lotes' | 'stats';
  setActiveTab: (tab: 'dolls' | 'lotes' | 'stats') => void;
  openMarcaModal: () => void;
  onAddClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openMarcaModal, onAddClick }) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'dolls': return '🎎 Muñequitas';
      case 'lotes': return '📦 Gestión de Lotes';
      case 'stats': return '📊 Estadísticas';
      default: return '';
    }
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case 'dolls': return '+ Añadir Muñeca';
      case 'lotes': return '+ Crear Lote';
      default: return null;
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header único con todo */}
        <div className="flex justify-between items-center py-4">
          {/* Lado izquierdo: Tabs */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("dolls")}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "dolls"
                    ? "bg-pink-100 text-pink-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <svg 
                  className={`mr-2 h-5 w-5`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Muñecas
              </button>
              <button
                onClick={() => setActiveTab("lotes")}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "lotes"
                    ? "bg-blue-100 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <svg 
                  className={`mr-2 h-5 w-5`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Lotes
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === "stats"
                    ? "bg-purple-100 text-purple-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <svg 
                  className={`mr-2 h-5 w-5`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Estadísticas
              </button>
            </div>
            
            {/* Título dinámico */}
            <div className="hidden lg:block border-l border-gray-300 pl-4">
              <h1 className="text-xl font-bold text-gray-900">
                {getTitle()}
              </h1>
            </div>
          </div>

          {/* Lado derecho: Botones de acción */}
          <div className="flex items-center gap-3">
            <button
              onClick={openMarcaModal}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all duration-200"
            >
              Añadir Marca
            </button>
            {getAddButtonText() && onAddClick && (
              <button
                onClick={onAddClick}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg ${
                  activeTab === 'dolls' 
                    ? 'bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                {getAddButtonText()}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;