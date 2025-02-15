import { StyleSheet, Alert, ScrollView, Dimensions, TouchableOpacity, FlatList, Animated } from "react-native";
import { Modal, Button, IconButton } from "react-native-paper";
import { useCarEnginesListQuery, useCarMakesListQuery, useCarModelsListQuery, useCarYearsListQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import { carType, useCarFilter } from "@/context/useCarFilterContext";
import { useState } from "react";
import { Text, View, colors, fonts } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { PrimaryButton } from "../button";
import { ActivityIndicator } from "react-native-paper";
import { useModal } from "@/context/useModal";



interface optionProps {
  id: string;
  name: number | string;
  vinSuffix?: string | null;
  imageUrl?: string | null;
}

const getLoadingTextColor = (loading: boolean, hasData: boolean) => {
  if (loading) return colors.textSecondary;
  return hasData ? colors.textPrimary : colors.textSecondary;
};

interface props {
  setSelectedLocalCar?: (car?: carType) => void
}

const CarFilterModal = ({setSelectedLocalCar}:props) => {
  const { selectedCar, setSelectedCar } = useCarFilter();
  const {closeModal} = useModal()


  // États temporaires pour les sélections du modal
  const [tempCarYear, setTempCarYear] = useState(selectedCar?.year);
  const [tempCarMake, setTempCarMake] = useState(selectedCar?.make);
  const [tempCarModel, setTempCarModel] = useState(selectedCar?.model);
  const [tempCarEngine, setTempCarEngine] = useState(selectedCar?.engine);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<"year" | "make" | "model" | "engine" | null>(null);

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
      if(setSelectedLocalCar) {
        setSelectedLocalCar({
          make: tempCarMake,
          year: tempCarYear,
          model: tempCarModel,
          engine: tempCarEngine,
          name: carName,
        });
      }else{
      setSelectedCar({
        make: tempCarMake,
        year: tempCarYear,
        model: tempCarModel,
        engine: tempCarEngine,
        name: carName,
      });
    }
      closeModal()
    } else {
      Alert.alert("Veuillez sélectionner toutes les options de filtrage.");
    }
  };

  const openSelectionModal = (type: "year" | "make" | "model" | "engine") => {
    setCurrentSelection(type);
    setModalVisible(true);
  };

  const handleSelect = (item: any) => {
    if (currentSelection === "year") {
      setTempCarYear(item);
      setTempCarMake(null);
      setTempCarModel(null);
      setTempCarEngine(null);
    } else if (currentSelection === "make") {
      setTempCarMake(item);
      setTempCarModel(null);
      setTempCarEngine(null);
    } else if (currentSelection === "model") {
      setTempCarModel(item);
      setTempCarEngine(null);
    } else if (currentSelection === "engine") {
      setTempCarEngine(item);
    }
    setModalVisible(false);
  };

  const getCurrentOptions = (): optionProps[] => {
    switch (currentSelection) {
      case "year":
        return carYears;
      case "make":
        return carMakes;
      case "model":
        return carModels;
      case "engine":
        return carEngines;
      default:
        return [];
    }
  };

  return (
    <>

              { 
                (!modalVisible) ?
                  <>
                    <View style={styles.filterContainer}>
          

                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome name="car" size={20} color={colors.secondary} style={styles.carIcon} />
                        <View>
                          <Text style={styles.filterText}>Filtrer par véhicule</Text>
                          <Text style={styles.instructionText}>Veuillez sélectionner par année, marque, modèle et moteur</Text>
                        </View>
                      </View>

                      <TouchableOpacity style={styles.dropdown} onPress={() => openSelectionModal("year")}>
                        {loadingYears ? (
                          <ActivityIndicator size="small" color={colors.textPrimary} />
                        ) : (
                          <Text style={{ color: getLoadingTextColor(loadingYears, (!!tempCarYear?.name)) }}>
                            {tempCarYear?.name || "Sélectionner une année"}
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.dropdown} onPress={() => openSelectionModal("make")} disabled={!tempCarYear}>
                        {loadingMakes ? (
                          <ActivityIndicator size="small" color={colors.textPrimary} />
                        ) : (
                          <Text style={{ color: getLoadingTextColor(loadingMakes, !!tempCarMake?.name) }}>
                            {tempCarMake?.name || "Sélectionner une marque"}
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.dropdown} onPress={() => openSelectionModal("model")} disabled={!tempCarMake}>
                        {loadingModels ? (
                          <ActivityIndicator size="small" color={colors.textPrimary} />
                        ) : (
                          <Text style={{ color: getLoadingTextColor(loadingModels, !!tempCarModel?.name) }}>
                            {tempCarModel?.name || "Sélectionner un modèle"}
                          </Text>
                        )}
                      </TouchableOpacity>

                      {carEngines.length > 0 && (
                        <TouchableOpacity style={styles.dropdown} onPress={() => openSelectionModal("engine")} disabled={!tempCarModel}>
                          {loadingEngines ? (
                            <ActivityIndicator size="small" color={colors.textPrimary} />
                          ) : (
                            <Text style={{ color: getLoadingTextColor(loadingEngines, !!tempCarEngine?.name) }}>
                              {tempCarEngine?.name || "Sélectionner un moteur"}
                            </Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>

                    <PrimaryButton title={`AJOUTER`}
                      style={styles.button} mode="contained" onPress={handleFilter} disabled={loadingEngines} />


                    <View style={[styles.buttonGroup, {
                      marginTop: 0
                    }]}>
                      <Button style={[styles.button,
                      {
                        backgroundColor: "white",
                        borderWidth: 1,
                        borderColor: "black"
                      }
                      ]} mode="contained" onPress={() => {
                        setSelectedCar({})
                        closeModal()
                      }
                      }
                        disabled={loadingEngines}
                      >
                        <Text
                          style={{
                            color: "black"
                          }}>
                          CHERCHER SANS VÉHICULE</Text>
                      </Button>
                    </View>
                  </> :

                  <View>
   
                    <Animated.FlatList
                      data={getCurrentOptions()}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.option} onPress={() => {
                          handleSelect(item);
                          setModalVisible(false);
                        }}>
                          <Text>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                      keyboardShouldPersistTaps="handled"
                    />
                  </View>

               }           


    </>
  );
};

const styles = StyleSheet.create({

  modalContainer: { backgroundColor: 'white', padding: 20, height: "100%"},

  dropdown: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginTop: 10,
  },
  selectionModal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    position: "absolute",
    zIndex: 10, // Bring the dropdown above other modal content
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: colors.border
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
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterText: {
    fontSize: fonts.h2,
    fontWeight: "bold",
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
    maxWidth: "95%",
  },
  buttonGroup: {
    width: "100%"
  },

});

export default CarFilterModal;
