import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, Portal, Provider as PaperProvider, IconButton } from "react-native-paper";
import { View, StyleSheet, ScrollView } from "react-native";

type ModalType = "search" | "checkout" | "carFilter" | "productFilter" | "CartPreview" | "ImageExpand" | "Auth" | "shipping" | "ShippingMethod" | "PaymentMethod"; // Add more modal types as needed

interface ModalContextType {
  openModal: (
    type: ModalType,
    content?: ReactNode,
    disableScroll?: boolean,
    height?: number | `${number}%`,
    marginTop?: number,
    closeButtonVisible?:boolean,
  ) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [disableScroll, setDisableScroll] = useState(false);
  const [modalHeight, setModalHeight] = useState<number | `${number}%`>(100);
  const [modalMarginTop, setModalMarginTop] = useState<number>(150);
  const [isCloseButtonVisible, setIsCloseButtonVisible] = useState(true); 

  const openModal = (
    type: ModalType,
    content?: ReactNode,
    disableScroll?: boolean,
    height?: number | `${number}%`,
    marginTop?: number,
    closeButtonVisible?:boolean
  ) => {
    setModalContent(content || <View />);
    setModalVisible(true);
    setDisableScroll(disableScroll || false);
    setIsCloseButtonVisible(closeButtonVisible || false);

    if (height !== undefined) {
      if (typeof height === "number") {
        setModalHeight(height);
      } else if (/^\d+%$/.test(height)) { // Ensure it's a valid percentage like "80%"
        setModalHeight(height as `${number}%`);
      }
    }

    setModalMarginTop(marginTop ?? 150); // Default marginTop to 150 if not provided
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
          <Modal
            visible={modalVisible}
            onDismiss={closeModal}
            contentContainerStyle={[
              styles.modalContainer,
              { height: modalHeight, marginTop: modalMarginTop },
            ]}
          >
            {isCloseButtonVisible && <View style={{ alignItems: "flex-end" }}>
              <IconButton icon="close" size={20} onPress={closeModal} style={styles.closeButton} />
            </View>}

            {disableScroll ? (
              <View style={{ flex: 1 }}>{modalContent}</View> // No ScrollView if disableScroll is true
            ) : (
              <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                {modalContent}
              </ScrollView>
            )}
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
    backgroundColor: 'white',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  closeButton: {
    top: 0,
    right: 0,
  },
});
