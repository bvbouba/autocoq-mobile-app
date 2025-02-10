import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getSortingOptions, UrlSorting } from "./sorting"; 
import { OrderDirection, ProductOrderField } from "@/saleor/api.generated";
import { colors, fonts } from "@/components/Themed";

export interface SortingDropdownProps {
  optionToggle: (field?: ProductOrderField, direction?: OrderDirection) => void;
  chosen: UrlSorting | null;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({ optionToggle, chosen }) => {
  const options = getSortingOptions(chosen);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Étiquette de tri avec icônes */}
      <View style={styles.labelContainer}>
        <FontAwesome name="arrow-up" size={10} color={colors.primary} />
        <FontAwesome name="arrow-down" size={10} color={colors.primary} style={{ marginLeft: -5, marginBottom: -15 }} />
        <Text style={styles.label}>Trier par </Text>
      </View>

      {/* Champ de saisie (cliquable pour ouvrir le modal) */}
      <TouchableOpacity style={styles.inputContainer} onPress={() => setModalVisible(true)}>
        <TextInput
          style={styles.input}
          value={chosen ? chosen.direction : "Popularité"}
          editable={false} // Empêcher l'ouverture du clavier
        />
        <FontAwesome name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>

      {/* Liste déroulante du Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setModalVisible(false)} />
        <View style={styles.modal}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, item.chosen && styles.selectedOption]}
                onPress={() => {
                  optionToggle(item.field, item.direction);
                  setModalVisible(false);
                }}
              >
                <Text style={[styles.optionText, item.chosen && styles.selectedText]}>
                  {item.label}
                </Text>
                {item.chosen && <FontAwesome name="check" size={16} color={colors.primary} />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center", 
    marginVertical: 10,
    width: '100%',
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: fonts.body,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white",
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: fonts.caption,
    color: "#333",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectedOption: {
    backgroundColor: colors.background,
  },
  optionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  selectedText: {
    fontWeight: "bold",
    color:colors.primary,
  },
});

export default SortingDropdown;
