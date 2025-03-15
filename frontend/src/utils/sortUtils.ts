export interface SortConfig<T> {
    key: keyof T | null;
    direction: "asc" | "desc";
  }
  
  export const compareValues = (
    aValue: string | number | undefined,
    bValue: string | number | undefined,
    direction: "asc" | "desc"
  ): number => {
    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }
  
    const aString = String(aValue || "").toLowerCase();
    const bString = String(bValue || "").toLowerCase();
  
    if (aString < bString) return direction === "asc" ? -1 : 1;
    if (aString > bString) return direction === "asc" ? 1 : -1;
    return 0;
  };
  
  export const calculateUnitPrice = (total: number, quantity: number): number => {
    return quantity > 0 ? total / quantity : 0;
  };
  
  export const getSortIcon = <T>(
    currentKey: keyof T,
    sortConfig: SortConfig<T>
  ): string => {
    if (sortConfig.key !== currentKey) {
      return "";
    }
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };
  
  export const getNextSortDirection = <T>(
    currentKey: keyof T,
    sortConfig: SortConfig<T>
  ): "asc" | "desc" => {
    return sortConfig.key === currentKey && sortConfig.direction === "asc"
      ? "desc"
      : "asc";
  };