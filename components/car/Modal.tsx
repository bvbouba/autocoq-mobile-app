import { View, Text, StyleSheet, Alert, ScrollView, Dimensions } from "react-native";
import { Modal, Button, IconButton } from "react-native-paper";
import { useCarEnginesListQuery, useCarMakesListQuery, useCarModelsListQuery, useCarYearsListQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import { Picker } from "@react-native-picker/picker";
import { useCarFilter } from "@/context/useCarFilterContext";
import { useState } from "react";
import { colors } from "../Themed";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const CarFilterModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const {
    selectedCar,
    setSelectedCar,
    setIsFiltered,
  } = useCarFilter();

  // États temporaires pour les sélections du modal
  const [tempCarYear, setTempCarYear] = useState(selectedCar?.year);
  const [tempCarMake, setTempCarMake] = useState(selectedCar?.make);
  const [tempCarModel, setTempCarModel] = useState(selectedCar?.model);
  const [tempCarEngine, setTempCarEngine] = useState(selectedCar?.engine);

  const { data: yearsData, loading: loadingYears } = useCarYearsListQuery();
  const carYears = mapEdgesToItems(yearsData?.carYears);

  const { data: makesData, loading: loadingMakes } = useCarMakesListQuery({ skip: !tempCarYear });
  const carMakes = mapEdgesToItems(makesData?.carMakes);

  const { data: modelsData, loading: loadingModels } = useCarModelsListQuery({
    skip: !tempCarMake,
    variables: { filter: { makeIds: [tempCarMake?.id || ""] } },
  });
  const carModels = mapEdgesToItems(modelsData?.carModels);

  const { data: enginesData, loading: loadingEngines } = useCarEnginesListQuery({
    skip: !tempCarModel,
    variables: { filter: { modelIds: [tempCarModel?.id || ""] } },
  });
  const carEngines = mapEdgesToItems(enginesData?.carEngines);



  const handleFilter = () => {
    if (tempCarYear && tempCarMake && tempCarModel && (carEngines.length === 0 || tempCarEngine)) {
      const carNameParts = [tempCarMake?.name, tempCarModel?.name, tempCarEngine?.name, tempCarYear?.name].filter(Boolean);
      const carName = carNameParts.length > 0 ? carNameParts.join(" ") : null;
      // Mettre à jour le contexte avec l'état temporaire
      setSelectedCar({
        make:tempCarMake,
        year:tempCarYear,
        model:tempCarModel,
        engine:tempCarEngine,
        name:carName,
      });
      setIsFiltered(true)
      onClose();
    } else {
      Alert.alert("Veuillez sélectionner toutes les options de filtrage.");
    }
  };

  return (
    <>
      {open && (
        <View style={styles.overlay}>
          <Modal visible={open} onDismiss={() => onClose()} contentContainerStyle={styles.modalContainer}>
            <ScrollView>
              <View style={styles.filterContainer}>
                <View style={{alignItems:"flex-end"}}>
                <IconButton
                    icon="close"
                    size={20}
                    onPress={onClose}
                    style={styles.closeButton}
                  />
                </View>
                <View style={styles.headerContainer}>
                  <Text style={styles.filterText}>Filtrer par véhicule</Text>
                </View>

                <Text style={styles.instructionText}>Veuillez sélectionner par année, marque, modèle et moteur</Text>

                <Picker
                  selectedValue={tempCarYear?.id || ""}
                  onValueChange={(itemValue) =>
                    setTempCarYear(carYears.find((year) => year.id === itemValue) || null)
                  }
                  enabled={!loadingYears}
                >
                  <Picker.Item label="Année" value="" />
                  {carYears?.map((year) => (
                    <Picker.Item key={year.id} label={`${year.name}`} value={year.id} />
                  ))}
                </Picker>

                <Picker
                  selectedValue={tempCarMake?.id || ""}
                  onValueChange={(itemValue) =>
                    setTempCarMake(carMakes.find((make) => make.id === itemValue) || null)
                  }
                  enabled={!!tempCarYear && !loadingMakes}
                >
                  <Picker.Item label="Marque" value="" />
                  {carMakes?.map((make) => (
                    <Picker.Item key={make.id} label={make.name} value={make.id} />
                  ))}
                </Picker>

                <Picker
                  selectedValue={tempCarModel?.id || ""}
                  onValueChange={(itemValue) =>
                    setTempCarModel(carModels.find((model) => model.id === itemValue) || null)
                  }
                  enabled={!!tempCarMake && !loadingModels}
                >
                  <Picker.Item label="Modèle" value="" />
                  {carModels?.map((model) => (
                    <Picker.Item key={model.id} label={model.name} value={model.id} />
                  ))}
                </Picker>
                {carEngines.length > 0 && 
                <Picker
                  selectedValue={tempCarEngine?.id || ""}
                  onValueChange={(itemValue) =>
                    setTempCarEngine(carEngines.find((engine) => engine.id === itemValue) || null)
                  }
                  enabled={!!tempCarModel && !loadingEngines}
                >
                  <Picker.Item label="Type" value="" />
                  {carEngines?.map((engine) => (
                    <Picker.Item key={engine.id} label={engine.name} value={engine.id} />
                  ))}
                </Picker>}
              </View>

              <View style={styles.buttonGroup}>
                <Button style={styles.button} mode="contained" onPress={handleFilter}
                disabled={loadingEngines}
                >
                  AJOUTER
                </Button>
              </View>
              <View style={[styles.buttonGroup,{
                marginTop:25
              }]}>
                <Button style={[styles.button,
                  {
                    backgroundColor:"white",
                    borderWidth:1,
                    borderColor:"black"
                  }
                ]} mode="contained" onPress={()=>{
                  setIsFiltered(false)
                  setSelectedCar({})
                  onClose()
                }
              }
                disabled={loadingEngines}
                >
                  <Text
                  style={{
                    color:"black"
                  }}>
                    CHERCHER SANS VÉHICULE</Text>
                </Button>
              </View>
            </ScrollView>
          </Modal>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "90%", 
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5, 
  },
  filterContainer: {
    marginBottom: 20,
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    top: 0,
    right: 0,
  },
  instructionText: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10,
  },
  buttonGroup: {
    width:"100%"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  button:{
    backgroundColor: colors.secondary,
    marginTop:10,
    borderRadius: 15,
    alignItems: "center",
  }
});

export default CarFilterModal;
