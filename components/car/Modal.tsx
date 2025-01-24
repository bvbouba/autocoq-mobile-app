import { View, Text, StyleSheet, Alert, ScrollView, Dimensions } from "react-native";
import { Modal, Button } from "react-native-paper";
import { useCarMakesListQuery, useCarModelsListQuery, useCarYearsListQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import { Picker } from "@react-native-picker/picker";
import { useCarFilter } from "@/context/useCarFilterContext";
import { useState } from "react";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const CarFilterModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const {
    selectedCarYear,
    setSelectedCarYear,
    selectedCarMake,
    setSelectedCarMake,
    selectedCarModel,
    setSelectedCarModel,
  } = useCarFilter();

  // Temporary states for modal selections
  const [tempCarYear, setTempCarYear] = useState(selectedCarYear);
  const [tempCarMake, setTempCarMake] = useState(selectedCarMake);
  const [tempCarModel, setTempCarModel] = useState(selectedCarModel);

  const { data: yearsData, loading: loadingYears } = useCarYearsListQuery();
  const carYears = mapEdgesToItems(yearsData?.carYears);

  const { data: makesData, loading: loadingMakes } = useCarMakesListQuery({ skip: !tempCarYear });
  const carMakes = mapEdgesToItems(makesData?.carMakes);

  const { data: modelsData, loading: loadingModels } = useCarModelsListQuery({
    skip: !tempCarMake,
    variables: { filter: { makeIds: [tempCarMake?.id || ""] } },
  });
  const carModels = mapEdgesToItems(modelsData?.carModels);

  const handleFilter = () => {
    if (tempCarYear && tempCarMake && tempCarModel) {
      // Update context with temporary state
      setSelectedCarYear(tempCarYear);
      setSelectedCarMake(tempCarMake);
      setSelectedCarModel(tempCarModel);
      onClose();
    } else {
      Alert.alert("Please select all filter options.");
    }
  };

  return (
    <>
      {open && (
        <View style={styles.overlay}>
          <Modal visible={open} onDismiss={() => onClose()} contentContainerStyle={styles.modalContainer}>
            <ScrollView>
              <View style={styles.filterContainer}>
                <Text style={styles.filterText}>Filter by Car:</Text>

                <Picker
                  selectedValue={tempCarYear?.id || ""}
                  onValueChange={(itemValue) =>
                    setTempCarYear(carYears.find((year) => year.id === itemValue) || null)
                  }
                  enabled={!loadingYears}
                >
                  <Picker.Item label="Year" value="" />
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
                  <Picker.Item label="Make" value="" />
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
                  <Picker.Item label="Model" value="" />
                  {carModels?.map((model) => (
                    <Picker.Item key={model.id} label={model.name} value={model.id} />
                  ))}
                </Picker>
              </View>
            </ScrollView>
            <View style={styles.buttonGroup}>
              <Button mode="contained" onPress={handleFilter}>
                Apply
              </Button>
              <Button mode="text" onPress={() => onClose()}>
                Cancel
              </Button>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    zIndex: 1000,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
});

export default CarFilterModal;
