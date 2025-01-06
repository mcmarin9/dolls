import React, { useState, useEffect } from 'react';
import DollsList from './components/DollsList/DollsList';
import AddDollModal from './components/AddDollModal/AddDollModal';
import DollDetail from './components/DollDetail/DollDetail';
import { getDolls, addDoll } from './services/api';
import { Doll } from './types/Doll';
import AddLoteModal from './components/AddLoteModal/AddLoteModal';
import { Lote } from './types/Lote';

const App: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);

    const [dolls, setDolls] = useState<Doll[]>([]);
    const [selectedDoll, setSelectedDoll] = useState<Doll | null>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openLoteModal = () => setIsLoteModalOpen(true);
    const closeLoteModal = () => setIsLoteModalOpen(false);

    const fetchDolls = async () => {
        try {
            const data = await getDolls();
            setDolls(data);
        } catch (error) {
            console.error("Error fetching dolls:", error);
        }
    };

    useEffect(() => {
        fetchDolls();
    }, []);

    const addNewDoll = async (dollData: Doll) => {
        try {
            const newDoll = await addDoll(dollData);
            setDolls((prevDolls) => [...prevDolls, newDoll]);
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

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedDoll(null);
    };

    const handleLoteAdded = (newLote: Lote) => {
        console.log("New lote added:", newLote);
        // Aquí puedes implementar lógica para mostrar lotes si decides listarlos
    };

    return (
        
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Gestión de Lotes */}
                <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Lotes</h1>
                    </div>
                    <button
                        onClick={openLoteModal}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 
                                 text-white font-medium rounded-md transition-colors duration-200 
                                 shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <span className="mr-2">+</span> Crear Lote
                    </button>
                    <AddLoteModal
                        isOpen={isLoteModalOpen}
                        closeModal={closeLoteModal}
                        onLoteAdded={handleLoteAdded}
                    />
                </section>
                
                {/* Gestión de Muñecas */}
                <section className="bg-white rounded-lg shadow-sm p-6">
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Dolls Manager</h1>
                    </div>
                    <button
                        onClick={openModal}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 
                                 text-white font-medium rounded-md transition-colors duration-200 
                                 shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <span className="mr-2">+</span> Add New Doll
                    </button>
                    <div className="mt-6">
                        <AddDollModal
                            isOpen={isModalOpen}
                            closeModal={closeModal}
                            onDollAdded={addNewDoll}
                        />
                        <DollsList
                            dolls={dolls}
                            onDelete={handleDeleteDoll}
                            onView={handleViewDoll}
                        />
                    </div>
                    {isDetailModalOpen && selectedDoll && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm 
                                    flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] 
                                        overflow-y-auto shadow-xl transform transition-all">
                                <div className="p-6">
                                    <DollDetail doll={selectedDoll} />
                                    <button
                                        onClick={closeDetailModal}
                                        className="mt-6 w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 
                                                text-white font-medium rounded-md transition-colors 
                                                duration-200 shadow-sm focus:ring-2 focus:ring-offset-2 
                                                focus:ring-gray-500"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default App;
