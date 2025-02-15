import { EngineDetailsFragment, MakeDetailsFragment, ModelDetailsFragment, YearDetailsFragment } from "@/saleor/api.generated";
import React, { createContext, useState, useContext, ReactNode } from "react";

type CarFilterContextType = {
  setSelectedCar: (car?: carType) => void;
  clearFilter: () => void; 
  selectedCar?:carType

};

export interface carType {
  make?: MakeDetailsFragment|null,
  model?:ModelDetailsFragment|null,
  engine?:EngineDetailsFragment|null,
  year?:YearDetailsFragment|null,
  name?:string|null,
}
const CarFilterContext = createContext<CarFilterContextType | null>(null);

export const CarFilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCar, setSelectedCar] = useState<carType | undefined>()
  // Function to clear all selected filters
  const clearFilter = () => {
    setSelectedCar(undefined)
  };

  return (
    <CarFilterContext.Provider
      value={{
        selectedCar,
        setSelectedCar,
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
