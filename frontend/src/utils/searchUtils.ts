interface SearchConfig<T> {
    searchTerm: string;
    searchFields: (keyof T)[];
  }
  
  // TODO: arreglar
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const searchItems = <T extends Record<string, any>>(
    items: T[],
    config: SearchConfig<T>
  ): T[] => {
    const { searchTerm, searchFields } = config;
    
    if (!searchTerm) return items;
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    
    return items.filter((item) => 
      searchFields.some((field) => {
        const value = item[field];
        return value?.toString().toLowerCase().includes(lowercaseSearchTerm);
      })
    );
  };