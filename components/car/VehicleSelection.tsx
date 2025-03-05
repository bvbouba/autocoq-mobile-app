import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View, colors, fonts } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useModal } from "@/context/useModal";
import AddByCarInformation from "./AddByCarInformation";
import { carType } from "@/context/useCarFilterContext";

const AddVehicle = ({ setSelectedLocalCar }: { setSelectedLocalCar?: (car?: carType) => void }) => {
  const { openModal } = useModal();

  return (
    <View style={styles.filterContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FontAwesome name="car" size={20} color={colors.secondary} style={styles.carIcon} />
        <View>
          <Text style={styles.filterText}>Ajouter un véhicule</Text>
          <Text style={styles.instructionText}>Veuillez sélectionner une option ci-dessous</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.option}
        onPress={() =>
          openModal({
            id: "AddByCarInformation",
            content: <AddByCarInformation setSelectedLocalCar={setSelectedLocalCar}/>,
            closeButtonVisible: false,
            height: "130%",
            marginTop: 0,
            disableScroll: true,
          })
        }
      >
        <Text style={styles.optionText}>Marque & Modèle</Text>
        <Text style={styles.optionSubText}>Rechercher par Année, Marque, Modèle, Type et Version</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.option} 
      onPress={() =>
        openModal({
          id: "AddByCarInformation",
          content: <AddByVIN />,
          closeButtonVisible: false,
          height: "130%",
          marginTop: 0,
          disableScroll: true,
        })
      }
      >
        <Text style={styles.optionText}>Saisir le VIN manuellement</Text>
        <Text style={styles.optionSubText}>Entrer votre Numéro d'Identification du Véhicule</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: { backgroundColor: "white", padding: 20, height: "100%" },

  option: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: fonts.h2,
    fontWeight: "bold",
  },
  optionSubText: {
    fontSize: fonts.body,
    color: "gray",
    marginBottom: 20,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  selectionModal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    position: "absolute",
    zIndex: 10, // Pour placer la boîte modale au-dessus des autres contenus
  },

  button: {
    marginTop: 20,
  },
  carIcon: {
    padding: 5,
    backgroundColor: colors.background,
    borderRadius: 20,
    marginRight: 10,
  },

  filterContainer: {
    marginBottom: 20,
    width: "100%",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterText: {
    fontSize: fonts.h1,
    fontWeight: "bold",
    marginBottom: 5,
  },
  closeButton: {
    top: 0,
    right: 0,
  },
  instructionText: {
    fontSize: fonts.caption,
    color: "gray",
    marginBottom: 10,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  buttonGroup: {
    width: "100%",
  },
});

export default AddVehicle;
