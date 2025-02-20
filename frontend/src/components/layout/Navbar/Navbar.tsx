import React from 'react';

interface NavbarProps {
  activeTab: 'dolls' | 'lotes' | 'stats';
  setActiveTab: (tab: 'dolls' | 'lotes' | 'stats') => void;
  openMarcaModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openMarcaModal }) => {
  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("dolls")}
              className={`inline-flex items-center px-6 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "dolls"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <svg 
                className={`mr-2 h-5 w-5 ${activeTab === "dolls" ? "text-blue-600" : "text-gray-400"}`}
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
              className={`inline-flex items-center px-6 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "lotes"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <svg 
                className={`mr-2 h-5 w-5 ${activeTab === "lotes" ? "text-green-600" : "text-gray-400"}`}
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
              className={`inline-flex items-center px-6 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === "stats"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <svg 
                className={`mr-2 h-5 w-5 ${activeTab === "stats" ? "text-purple-600" : "text-gray-400"}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Estadísticas
            </button>
          </div>
          <div className="flex items-center">
            <button
              onClick={openMarcaModal}
              className="inline-flex items-center px-4 py-2 border border-purple-600 rounded-md text-sm font-medium text-purple-600 bg-white hover:bg-purple-50 transition-colors duration-200"
            >
              <svg 
                className="mr-2 h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Añadir Marca
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;