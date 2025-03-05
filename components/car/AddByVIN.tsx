import { StyleSheet, Alert, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { IconButton } from "react-native-paper";
import { useState } from "react";
import { Text, View, colors, fonts } from "@/components/Themed";
import { PrimaryButton } from "../button";
import { useModal } from "@/context/useModal";
import { useLoading } from "@/context/LoadingContext";

const AddByVIN = ({ setSelectedLocalCar }: { setSelectedLocalCar?: (car?: any) => void }) => {
  const { closeModal } = useModal();
  const { setLoading } = useLoading();
  const [vin, setVin] = useState<string>("");

  const onSubmit = () => {
    if (vin.length === 17) {
      Alert.alert("Véhicule ajouté avec succès!", `VIN: ${vin}`);
      closeModal("AddByCarInformation");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="close" size={30} iconColor={colors.primary} onPress={() => closeModal("AddByCarInformation")} />
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={styles.title}>Entrer le VIN</Text>
        </View>
        <View></View>
      </View>

      <Text style={styles.instructionText}>Saisir votre Numéro de Châssis du Véhicule (VIN)</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: 1HGCM82633A123456"
        placeholderTextColor="gray"
        value={vin}
        onChangeText={setVin}
        maxLength={17}
        autoCapitalize="characters"
      />

      <PrimaryButton 
        title="AJOUTER VÉHICULE" 
        onPress={onSubmit} 
        disabled={vin.length !== 17} 
        style={[styles.button, vin.length !== 17 && styles.disabledButton]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginVertical: 5,
  },
  instructionText: {
    fontSize: fonts.body,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: 10,
    fontSize: fonts.body,
    color: colors.textPrimary,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  button: {
    padding: 10,
  },
  disabledButton: {
    backgroundColor: "gray",
    opacity: 0.6,
  },
});

export default AddByVIN;
