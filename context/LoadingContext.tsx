import { colors } from "@/components/Themed";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from 'react-native-paper';

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
            <ActivityIndicator size="large" animating={true} color={colors.primary} />  
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
    backgroundColor: "rgba(255,255,255,0.6)", // Lighter transparent white
    alignItems: "center",
    justifyContent: "center",
  },
});
