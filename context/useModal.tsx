import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, Portal, Provider as PaperProvider, IconButton } from "react-native-paper";
import { View, StyleSheet, ScrollView } from "react-native";

type ModalType = "checkout"|"carFilter" | "productFilter" | "CartPreview" | "ImageExpand" | "Auth"|"shipping"|"ShippingMethod"|"PaymentMethod"; // Add more modal types as needed

interface ModalContextType {
  openModal: (type: ModalType, content?: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  const openModal = (type: ModalType, content?: ReactNode) => {
    setModalContent(content || <View />);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      <PaperProvider>
        {children}
        <Portal>
          <Modal visible={modalVisible} onDismiss={closeModal} contentContainerStyle={styles.modalContainer}>
          <View style={{ alignItems: "flex-end"}}>
                        <IconButton icon="close" size={20} onPress={closeModal} style={styles.closeButton} />
                      </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
           
              {modalContent}
            </ScrollView>
          </Modal>
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
     backgroundColor: 'white', padding: 20, height: "100%", marginTop:150,
     borderTopRightRadius:20,
     borderTopLeftRadius:20

  },
  closeButton: {
    top: 0,
    right: 0,
  },
});
