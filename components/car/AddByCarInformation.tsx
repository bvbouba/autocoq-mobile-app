import { StyleSheet, Alert, TouchableOpacity, ScrollView } from "react-native";
import {  IconButton } from "react-native-paper";
import {
  useCarEnginesListQuery,
  useCarMakesListQuery,
  useCarModelsListQuery,
  useCarVariantsListQuery,
  useCarYearsListQuery,
} from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import { carType, useCarFilter } from "@/context/useCarFilterContext";
import { useEffect, useState } from "react";
import { Divider, Text, View, colors, fonts } from "@/components/Themed";
import { PrimaryButton } from "../button";
import { useModal } from "@/context/useModal";
import { useLoading } from "@/context/LoadingContext";
import ImageExpand from "../ImageExpand";
import { setSavedVehicles } from "@/context/savedVehicles";

interface optionProps {
  id: string;
  name: number | string;
  vinSuffix?: string | null;
  imageUrl?: string | null;
}

const AddByCarInformation = ({ setSelectedLocalCar }: { setSelectedLocalCar?: (car?: carType) => void }) => {
  const { selectedCar, setSelectedCar } = useCarFilter();
  const { closeModal } = useModal();
  const { setLoading } = useLoading();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Temp state for selections
  const [tempCarYear, setTempCarYear] = useState(selectedCar?.year);
  const [tempCarMake, setTempCarMake] = useState(selectedCar?.make);
  const [tempCarModel, setTempCarModel] = useState(selectedCar?.model);
  const [tempCarVariant, setTempCarVariant] = useState(selectedCar?.variant);
  const [tempCarEngine, setTempCarEngine] = useState(selectedCar?.engine);

  const { data: yearsData, loading: loadingYears } = useCarYearsListQuery();
  const carYears = mapEdgesToItems(yearsData?.carYears);

  const { data: makesData, loading: loadingMakes } = useCarMakesListQuery({ skip: !tempCarYear });
  const carMakes = mapEdgesToItems(makesData?.carMakes);

  const { data: modelsData, loading: loadingModels } = useCarModelsListQuery({
    skip: !tempCarMake,
    variables: { filter: { makeIds: [tempCarMake?.id || ""], yearRange: [tempCarYear?.id || ""] } },
  });
  const carModels = mapEdgesToItems(modelsData?.carModels);

  const { data: variantsData, loading: loadingVariants } = useCarVariantsListQuery({
    skip: !tempCarModel,
    variables: { filter: { modelIds: [tempCarModel?.id || ""] } },
  });
  const carVariants = mapEdgesToItems(variantsData?.carVariants);

  const { data: enginesData, loading: loadingEngines } = useCarEnginesListQuery({
    skip: !tempCarVariant,
    variables: { filter: { variantIds: [tempCarVariant?.id || ""] } },
  });
  const carEngines = mapEdgesToItems(enginesData?.carEngines);

  useEffect(() => {
    setLoading(loadingYears || loadingMakes || loadingModels || loadingEngines || loadingVariants);
  }, [loadingYears, loadingMakes, loadingModels, loadingEngines, loadingVariants]);

  const handleSelect = (item: optionProps) => {
    const formattedItem = { ...item, name: String(item.name) }; // Convert name to string for consistency

    if (!tempCarYear) {
      setTempCarYear(formattedItem);
    } else if (!tempCarMake) {
      setTempCarMake(formattedItem);
    } else if (!tempCarModel) {
      setTempCarModel(formattedItem);
    } else if (!tempCarVariant) {
      setTempCarVariant(formattedItem);
    } else {
      setTempCarEngine(formattedItem);
    }
  };

  const onSubmit = () => {
    setIsSaving(true);
    if (tempCarYear && tempCarMake && tempCarModel && (carEngines.length === 0 || tempCarEngine)) {
      const carNameParts = [tempCarMake?.name, tempCarModel?.name, tempCarEngine?.name, tempCarYear?.name].filter(Boolean);
      const carName = carNameParts.length > 0 ? carNameParts.join(" ") : null;

      if (setSelectedLocalCar) {
        setSelectedLocalCar({ make: tempCarMake, year: tempCarYear, model: tempCarModel, variant: tempCarVariant, engine: tempCarEngine, name: carName });
      } else {
        setSelectedCar({ make: tempCarMake, year: tempCarYear, model: tempCarModel, variant: tempCarVariant, engine: tempCarEngine, name: carName });
      }
      setSavedVehicles({
        year:tempCarYear,
        make:tempCarMake,
        model:tempCarModel,
        variant:tempCarVariant,
        engine:tempCarEngine,
        name:carName
      })
      setIsSaving(false);
      closeModal("AddByCarInformation");
      closeModal("AddVehicle");
    } else {
      setIsSaving(false);
      Alert.alert("Veuillez sélectionner toutes les options de filtrage.");
    }
  };

  const getActiveStep = () => {
    if (!tempCarYear) return "year";
    if (!tempCarMake) return "make";
    if (!tempCarModel) return "model";
    if (!tempCarVariant) return "variant";
    return "engine";
  };

  const activeStep = getActiveStep();

  const getCurrentStepOptions = (): { title: string; options: optionProps[]; subTitle: string } => {
    if (activeStep === "year") return { title: "Sélectionner l'année", options: carYears as optionProps[], subTitle: "" };
    if (activeStep === "make") return { title: "Sélectionner la marque", options: carMakes as optionProps[], subTitle: `${tempCarYear?.name}` };
    if (activeStep === "model") return { title: "Sélectionner le modèle", options: carModels as optionProps[], subTitle: `${tempCarYear?.name} ${tempCarMake?.name} ` };
    if (activeStep === "variant") return { title: "Sélectionner le type", options: carVariants as optionProps[], subTitle: `${tempCarYear?.name} ${tempCarMake?.name} ${tempCarModel?.name} ` };
    return { title: "Sélectionner la version", options: carEngines as optionProps[], subTitle: `${tempCarYear?.name} ${tempCarMake?.name} ${tempCarModel?.name} ${tempCarVariant?.name} ` };
  };

  const { title, options, subTitle } = getCurrentStepOptions();
  const expandedImage = {
    url: tempCarModel?.imageUrl || "",
    alt: ""
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="close" size={30} iconColor={colors.primary} onPress={() => closeModal("AddByCarInformation")} />
        <View style={{
          flexDirection: "column",
          alignItems: "center"
        }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
        <View></View>
      </View>

      <Divider />

      <View style={styles.steps}>
        <TouchableOpacity onPress={() => {
          setTempCarYear(undefined)
          setTempCarMake(undefined)
          setTempCarModel(undefined)
          setTempCarVariant(undefined)
          setTempCarEngine(undefined)
        }}>
          <Text style={[styles.stepText, activeStep === "year" ? styles.activeStep : styles.inactiveStep]}>Année</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={!tempCarYear} onPress={() => {
          setTempCarMake(undefined)
          setTempCarModel(undefined)
          setTempCarVariant(undefined)
          setTempCarEngine(undefined)
        }}>
          <Text style={[styles.stepText, activeStep === "make" ? styles.activeStep : styles.inactiveStep]}>Marque</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={!tempCarMake} onPress={() => {
          setTempCarModel(undefined)
          setTempCarVariant(undefined)
          setTempCarEngine(undefined)
        }}>
          <Text style={[styles.stepText, activeStep === "model" ? styles.activeStep : styles.inactiveStep]}>Modèle</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={!tempCarModel} onPress={() => {
          setTempCarVariant(undefined)
          setTempCarVariant(undefined)
        }}>
          <Text style={[styles.stepText, activeStep === "variant" ? styles.activeStep : styles.inactiveStep]}>Type</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={!tempCarModel} onPress={() => setTempCarEngine(undefined)}>
          <Text style={[styles.stepText, activeStep === "engine" ? styles.activeStep : styles.inactiveStep]}>Version</Text>
        </TouchableOpacity>
      </View>

      <Divider />

      {tempCarYear && tempCarMake && tempCarModel && tempCarVariant && tempCarEngine ? (
        <>
          {/* Display the selected car image */}
          {expandedImage &&
            <ImageExpand image={expandedImage} 
            />
          }

          <View style={{
            padding: 10,
          }}>
            <PrimaryButton
              style={styles.button}
              title={setSelectedLocalCar ? "VÉRIFIER LA COMPATIBILITÉ" : "FILTRE POUR CE VÉHICULE"}
              onPress={onSubmit}
              loading={isSaving}
              mode="contained"
            />
          </View>

        </>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {options.map((item) => (
            <View key={item.id}>
              <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                <Text style={styles.optionText}>{String(item.name)}</Text>
              </TouchableOpacity>
              <Divider />
            </View>
          ))}
        </ScrollView>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 0,
    flex: 1
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginVertical: 5
  },
  subTitle: {
    fontSize: fonts.body,
    color: colors.textSecondary,
  },
  steps: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  stepText: {
    fontSize: fonts.body,
  },
  option: {
    padding: 15,
  },
  optionText: {
    fontSize: fonts.body,
  },
  button: {
    marginVertical: 0,
    padding: 0
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
  },
  activeStep: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  inactiveStep: {
    color: colors.textSecondary,
  },
  scrollView: {
    paddingBottom: 200,
  },
});

export default AddByCarInformation;
