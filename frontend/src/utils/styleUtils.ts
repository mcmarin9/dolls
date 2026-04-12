export const getTypeStyle = (type: "compra" | "venta"): string => {
    return type === "venta"
        ? "bg-green-100 text-green-800"
        : "bg-orange-100 text-orange-800";
};

export const getDollTypeStyle = (type: string | undefined): string => {
    switch ((type || "").toLowerCase()) {
        case 'muñeca':
            return 'bg-pink-100 text-pink-800';
        case 'figurita':
            return 'bg-purple-100 text-purple-800';
        case 'playset':
            return 'bg-blue-100 text-blue-800';
        case 'ropa':
            return 'bg-indigo-100 text-indigo-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const getDollTypeEmoji = (type: string | undefined): string => {
    switch ((type || "").toLowerCase()) {
        case 'muñeca':
            return '🎎';
        case 'figurita':
            return '🎀';
        case 'playset':
            return '🎮';
        case 'ropa':
            return '👗';
        default:
            return '📦';
    }
};

export const getStatusStyle = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'a la venta':
            return 'bg-orange-100 text-orange-800';
        case 'vendida':
            return 'bg-green-100 text-green-800';
        case 'guardada':
            return 'bg-yellow-100 text-yellow-800';
        case 'fuera':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};