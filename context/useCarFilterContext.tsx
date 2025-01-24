import { MakeDetailsFragment, ModelDetailsFragment, YearDetailsFragment } from "@/saleor/api.generated";
import React, { createContext, useState, useContext, ReactNode } from "react";

type CarFilterContextType = {
  selectedCarYear?: YearDetailsFragment|null;
  setSelectedCarYear: (year?: YearDetailsFragment|null) => void;
  selectedCarMake?: MakeDetailsFragment|null;
  setSelectedCarMake: (make?: MakeDetailsFragment|null) => void;
  selectedCarModel?: ModelDetailsFragment|null;
  setSelectedCarModel: (model?: ModelDetailsFragment|null) => void;
  clearFilter: () => void; // Added clearFilter
};

const CarFilterContext = createContext<CarFilterContextType | null>(null);

export const CarFilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCarYear, setSelectedCarYear] = useState<YearDetailsFragment|null>();
  const [selectedCarMake, setSelectedCarMake] = useState<MakeDetailsFragment|null>();
  const [selectedCarModel, setSelectedCarModel] = useState<ModelDetailsFragment|null>();

  // Function to clear all selected filters
  const clearFilter = () => {
    setSelectedCarYear(null);
    setSelectedCarMake(null);
    setSelectedCarModel(null);
  };

  return (
    <CarFilterContext.Provider
      value={{
        selectedCarYear,
        setSelectedCarYear,
        selectedCarMake,
        setSelectedCarMake,
        selectedCarModel,
        setSelectedCarModel,
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
