import AsyncStorage from "@react-native-async-storage/async-storage";

const SHIPPING_KEY = "@SaleorApp:ShippingAddress";
const BILLING_KEY = "@SaleorApp:BillingAddress";

// Address type definition
export interface AddressType {
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress1: string;
  streetAddress2?: string;
  postalCode: string;
  city: string;
}

// ✅ Retrieve the saved shipping address
export const getSavedShippingAddress = async (): Promise<AddressType | null> => {
  try {
    const savedAddress = await AsyncStorage.getItem(SHIPPING_KEY);
    return savedAddress ? JSON.parse(savedAddress) : null;
  } catch (error) {
    console.error("Error retrieving shipping address:", error);
    return null;
  }
};

// ✅ Save a shipping address
export const setSavedShippingAddress = async (address: AddressType) => {
  try {
    await AsyncStorage.setItem(SHIPPING_KEY, JSON.stringify(address));
  } catch (error) {
    console.error("Error saving shipping address:", error);
  }
};

// ✅ Retrieve the saved billing address
export const getSavedBillingAddress = async (): Promise<AddressType | null> => {
  try {
    const savedAddress = await AsyncStorage.getItem(BILLING_KEY);
    return savedAddress ? JSON.parse(savedAddress) : null;
  } catch (error) {
    console.error("Error retrieving billing address:", error);
    return null;
  }
};

// ✅ Save a billing address
export const setSavedBillingAddress = async (address: AddressType) => {
  try {
    await AsyncStorage.setItem(BILLING_KEY, JSON.stringify(address));
  } catch (error) {
    console.error("Error saving billing address:", error);
  }
};

// ✅ Clear the saved shipping address
export const clearSavedShippingAddress = async () => {
  try {
    await AsyncStorage.removeItem(SHIPPING_KEY);
  } catch (error) {
    console.error("Error clearing shipping address:", error);
  }
};

// ✅ Clear the saved billing address
export const clearSavedBillingAddress = async () => {
  try {
    await AsyncStorage.removeItem(BILLING_KEY);
  } catch (error) {
    console.error("Error clearing billing address:", error);
  }
};

// ✅ Clear both shipping and billing addresses
export const clearAllSavedAddresses = async () => {
  try {
    await AsyncStorage.multiRemove([SHIPPING_KEY, BILLING_KEY]);
  } catch (error) {
    console.error("Error clearing all addresses:", error);
  }
};
