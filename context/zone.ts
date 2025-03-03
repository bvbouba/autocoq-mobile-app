import AsyncStorage from "@react-native-async-storage/async-storage";


const key = '@SaleorApp:ZoneName'

export const getZoneName = async () => {
    const zone = await AsyncStorage.getItem(
        key
    );
    return zone ?? "Abidjan";
}
export const setZoneName = async (name: string) => {
    await AsyncStorage.setItem(
        key,
        name
    );
}
export const removeZoneName = async () => {
    await AsyncStorage.removeItem(
        key
    );
}