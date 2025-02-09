import { TouchableOpacity, StyleSheet, Image } from "react-native";
import { Text, View, colors, fonts } from "@/components/Themed";

import CarFilterModal from "./Modal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { useCarFilter } from "@/context/useCarFilterContext";
import ImageExpand from "../ImageExpand";

interface ImageProps {
  url: string;
  alt: string;
}

const AddVehicleBasic = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const { isFiltered, selectedCar } = useCarFilter();
  const [expandedImage, setExpandedImage] = useState<ImageProps | null>(null);

  return (
    <>
      <View style={styles.selectVehicleContainer}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            onPress={() =>
              selectedCar?.model?.imageUrl &&
              setExpandedImage({
                url: selectedCar.model.imageUrl,
                alt: "",
              })
            }
          >
            {selectedCar?.model?.imageUrl ? (
              <Image
                style={styles.vehicleImage}
                source={{ uri: selectedCar.model.imageUrl }}
              />
            ) : (
              <View style={{ position: "relative" }}>
                <FontAwesome name="car" size={18} color={colors.secondary} />
                  <FontAwesome
                    name="exclamation-circle"
                    size={13}
                    color={colors.warning}
                    style={{
                      position: "absolute",
                      bottom: -4,
                      right: -6,
                    }}
                  />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.vehicleText}>
            {isFiltered && selectedCar ? selectedCar.name : "Sur quel véhicule travaillez-vous ?"}
          </Text>
        </View>

        {/* Section droite : Bouton */}
        <TouchableOpacity style={styles.button} onPress={() => setFilterOpen(true)}>
          <Text style={[styles.buttonText, (isFiltered && selectedCar) && {
            borderWidth: 1,
            textDecorationLine: "none",
            borderRadius: 5
          }]}>
            {isFiltered && selectedCar ? "Changer" : "Sélectionner un véhicule"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal d'agrandissement de l'image */}
      {expandedImage && (
        <View style={styles.modalContainer}>
          <ImageExpand image={expandedImage} onRemoveExpand={() => setExpandedImage(null)} />
        </View>
      )}

      {/* Modal de filtrage des véhicules */}
      {filterOpen && <CarFilterModal onClose={() => setFilterOpen(false)} open={filterOpen} />}
    </>
  );
};

const styles = StyleSheet.create({
  selectVehicleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    margin: 2
  },
  vehicleImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  vehicleText: {
    flex: 1,
    flexShrink: 1,
    maxWidth: "80%",
    fontSize: fonts.button,
    fontWeight: "500",
    marginLeft: 10
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: fonts.button,
    textDecorationLine: "underline",
    padding: 5
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddVehicleBasic;
