import { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { Text, View, colors, fonts } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useModal } from "@/context/useModal";
import { getSavedVehicles, clearSavedVehicle } from "@/context/savedVehicles";
import { carType, useCarFilter } from "@/context/useCarFilterContext";
import AddVehicle from "./VehicleSelection";

const SelectVehicle = ({ setSelectedLocalCar }: { setSelectedLocalCar?: (car?: carType) => void }) => {
  const { openModal, closeModal } = useModal();
  const { setSelectedCar, selectedCar, clearFilter } = useCarFilter();

  const [savedVehicles, setSavedVehicles] = useState<carType[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const vehicles = await getSavedVehicles();
      setSavedVehicles(vehicles || []);
    };
    fetchVehicles();
  }, []);

  const handleSelect = (item: carType) => {
    if(setSelectedLocalCar) {
      setSelectedLocalCar({
        make: item.make,
        year: item.year,
        model: item.model,
        variant: item.variant,
        engine: item.engine,
        name: item.name,
      });
    } else {
    setSelectedCar({
      make: item.make,
      year: item.year,
      model: item.model,
      variant: item.variant,
      engine: item.engine,
      name: item.name,
    });
  }
    closeModal("selectVehicle")
  };

  const handleDeleteVehicle = async (carName: string) => {
    await clearSavedVehicle(carName);
    setSavedVehicles((prev) => prev.filter((vehicle) => vehicle.name !== carName));
  };

  return (
    <View style={styles.filterContainer}>
      {/* Header Section */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
        <FontAwesome name="car" size={20} color={colors.secondary} style={styles.carIcon} />
        <Text style={styles.filterText}>{selectedCar?.name ? "Changer de véhicule" : "Sélectionner un véhicule"}</Text>
      </View>

      {/* Currently Selected Car */}
      {selectedCar && (
        <View style={styles.currentVehicle}>
          <View style={{ flexDirection: "row", alignItems: "center",flexWrap: "wrap", marginBottom:5 }}>
            <Text style={styles.currentVehicleText}>Actuellement en recherche pour 

            <Text style={[styles.boldText,{ flexShrink: 1 }]}> {selectedCar.name}</Text>
            </Text>
            
          </View>
          <TouchableOpacity onPress={()=>{
            clearFilter()
            closeModal("selectVehicle")
            }}>
            <Text style={styles.shopWithoutVehicle}>CHERCHER SANS VÉHICULE</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Saved Vehicles */}
      <View style={styles.savedVehiclesContainer}>
        {savedVehicles.length > 0 && <Text style={styles.sectionInstruction}>Choisir un autre véhicule</Text>}
        {(savedVehicles.length>0) && <Text style={styles.vehicleCount}>{`${savedVehicles.length} véhicule(s)`}</Text>}
        {/* Add New Vehicle Button */}
        <TouchableOpacity
          style={styles.addVehicleButton}
          onPress={() => {
            closeModal("selectVehicle");
            openModal({
              id: "AddVehicle",
              content: <AddVehicle setSelectedLocalCar={setSelectedLocalCar}/>,
              closeButtonVisible: true,
              marginTop: 700,
            });
          }}
        >
          <Text style={styles.addVehicleText}>+ Ajouter un véhicule</Text>
        </TouchableOpacity>

        {/* Vehicle List */}
        <FlatList
          data={savedVehicles}
          keyExtractor={(item) => item.name || Math.random().toString()}
          style={{
            marginTop:10
          }}
          renderItem={({ item }) => (
            <View style={styles.vehicleItem}>
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Image source={{ uri: item.model?.imageUrl || "" }} style={styles.vehicleImage} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelect(item)} style={styles.vehicleNameContainer}>
                <Text style={styles.vehicleName}>{item.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteVehicle(item.name || "")}>
                <FontAwesome name="remove" size={20} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: 20,
    width: "100%",
    padding: 0,
  },
  carIcon: {
    padding: 5,
    backgroundColor: colors.background,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginBottom: 5,
  },
  currentVehicle: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currentVehicleText: {
    fontSize: fonts.caption,
  },
  boldText: {
    fontWeight: "bold",
  },
  shopWithoutVehicle: {
    color: colors.primary,
    textDecorationLine: "underline",
    marginTop: 5,
  },
  savedVehiclesContainer: {
    marginTop: 20,
    backgroundColor: colors.background,
    padding: 10,
  },
  sectionInstruction: {
    fontSize: fonts.body,
  },
  vehicleCount: {
    fontSize: fonts.caption,
  },
  vehicleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  vehicleImage: {
    width: 100,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  vehicleNameContainer: {
    flex: 1,
    justifyContent: "center", // Center text vertically
  },
  vehicleName: {
    fontSize: fonts.body,
    textAlign: "center", // Center text horizontally
  },
  addVehicleButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    alignItems: "center",
  },
  addVehicleText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SelectVehicle;
