import { EngineDetailsFragment, MakeDetailsFragment, ModelDetailsFragment, YearDetailsFragment } from "@/saleor/api.generated";
import React, { createContext, useState, useContext, ReactNode } from "react";

type CarFilterContextType = {
  setSelectedCar: (car?: car) => void;
  clearFilter: () => void; 
  isFiltered:boolean,
  setIsFiltered:(isFiltered:boolean)=>void,
  selectedCar?:car
  filterOpen:boolean,
  setFilterOpen:(filterOpen:boolean)=>void
};

interface car {
  make?: MakeDetailsFragment|null,
  model?:ModelDetailsFragment|null,
  engine?:EngineDetailsFragment|null,
  year?:YearDetailsFragment|null,
  name?:string|null,
}
const CarFilterContext = createContext<CarFilterContextType | null>(null);

export const CarFilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCar, setSelectedCar] = useState<{}>()
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Function to clear all selected filters
  const clearFilter = () => {
    setIsFiltered(false);
  };

  return (
    <CarFilterContext.Provider
      value={{
        selectedCar,
        setSelectedCar,
        isFiltered,
        setIsFiltered,
        setFilterOpen,
        filterOpen,
        clearFilter, // Provide clearFilter in the context
      }}
    >
      {children}
    </CarFilterContext.Provider>
  );
};

export const useCarFilter = () => {
  const context = useContext(CarFilterContext);
  if (!context) {
    throw new Error("useCarFilter must be used within a CarFilterProvider");
  }
  return context;
};
