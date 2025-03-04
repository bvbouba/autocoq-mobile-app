import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, Portal, Provider as PaperProvider, IconButton } from "react-native-paper";
import { View, StyleSheet, ScrollView } from "react-native";

type ModalId = "search" | "checkout" | "carFilter" | "productFilter" | "CartPreview" | "ImageExpand" | 
                "Auth" | "shipping" | "ShippingMethod" | "PaymentMethod" | "AddVehicle" | "AddByCarInformation" | 
                "AddByVIN";

interface OpenModalParams {
  id: ModalId;
  content?: ReactNode;
  disableScroll?: boolean;
  height?: number | `${number}%`;
  marginTop?: number;
  closeButtonVisible?: boolean;
}

interface ModalContextType {
  openModal: (params: OpenModalParams) => void;
  closeModal: (id: ModalId) => void; // Close only a specific modal
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<OpenModalParams[]>([]);

  const openModal = (params: OpenModalParams) => {
    setModals((prev) => [...prev, params]); // Add a new modal to the array
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id)); // Remove only the modal with the matching ID
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <PaperProvider>
        {children}
        <Portal>
          {modals.map(({ id, content, disableScroll, height, marginTop, closeButtonVisible }) => (
            <Modal
              key={id}
              visible
              onDismiss={() => closeModal(id)}
              contentContainerStyle={[
                styles.modalContainer,
                { height: height || "100%", marginTop: marginTop || 150 },
              ]}
            >
              {closeButtonVisible && (
                <View style={{ alignItems: "flex-end" }}>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => closeModal(id)}
                    style={styles.closeButton}
                  />
                </View>
              )}

              {disableScroll ? (
                <View style={{ flex: 1 }}>{content}</View>
              ) : (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                  {content}
                </ScrollView>
              )}
            </Modal>
          ))}
        </Portal>
      </PaperProvider>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  closeButton: {
    top: 0,
    right: 0,
  },
});
