import AsyncStorage from "@react-native-async-storage/async-storage";
import { carType } from "./useCarFilterContext";


const key = "@SaleorApp:SavedVehicles";

// ✅ Retrieve saved vehicles
export const getSavedVehicles = async (): Promise<carType[]> => {
  try {
    const savedVehicles = await AsyncStorage.getItem(key);
    return savedVehicles ? JSON.parse(savedVehicles) : [];
  } catch (error) {
    console.error("Error retrieving saved vehicles:", error);
    return [];
  }
};

// ✅ Save a vehicle (limit to last 5)
export const setSavedVehicles = async (car: carType) => {
  try {
    let savedVehicles = await getSavedVehicles();

    // Remove duplicate if already exists (checking by `name` as an identifier)
    savedVehicles = savedVehicles.filter((item) => item.name !== car.name);

    // Add new vehicle at the start
    savedVehicles.unshift(car);

    // Keep only the last 5
    if (savedVehicles.length > 5) {
      savedVehicles = savedVehicles.slice(0, 5);
    }

    // Save updated list
    await AsyncStorage.setItem(key, JSON.stringify(savedVehicles));
  } catch (error) {
    console.error("Error saving vehicle:", error);
  }
};

// ✅ Clear a specific vehicle from storage
export const clearSavedVehicle = async (carName: string) => {
  try {
    let savedVehicles = await getSavedVehicles();

    // Remove the specific vehicle using its name as identifier
    savedVehicles = savedVehicles.filter((item) => item.name !== carName);

    // Save the updated list
    await AsyncStorage.setItem(key, JSON.stringify(savedVehicles));
  } catch (error) {
    console.error("Error clearing vehicle:", error);
  }
};

// ✅ Clear all saved vehicles
export const clearSavedVehicles = async () => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing all saved vehicles:", error);
  }
};
