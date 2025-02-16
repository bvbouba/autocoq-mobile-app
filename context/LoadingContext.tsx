import React, { createContext, useContext, useState, ReactNode } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

// Create Context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Loading Provider Component
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      <View style={{ flex: 1 }}>
        {children}
        {isLoading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </LoadingContext.Provider>
  );
};

// Custom Hook to use Loading Context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)", // Dark transparent overlay
    alignItems: "center",
    justifyContent: "center",
  },
});
