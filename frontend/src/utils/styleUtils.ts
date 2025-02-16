export const getTypeStyle = (type: "compra" | "venta"): string => {
    return type === "compra"
        ? "bg-green-100 text-green-800"
        : "bg-blue-100 text-blue-800";
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