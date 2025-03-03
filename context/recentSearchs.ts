import AsyncStorage from "@react-native-async-storage/async-storage";

const key = "@SaleorApp:RecentSearchs";

// ✅ Retrieve recent searches
export const getRecentSearchs = async (): Promise<string[]> => {
    const recentSearchs = await AsyncStorage.getItem(key);
    return recentSearchs ? JSON.parse(recentSearchs) : [];
};

// ✅ Save a new search term (limit to last 5 searches)
export const setRecentSearchs = async (keyword: string) => {
    try {
        let recentSearches = await getRecentSearchs();

        // Remove duplicate if already exists
        recentSearches = recentSearches.filter((item) => item !== keyword);

        // Add new keyword at the start
        recentSearches.unshift(keyword);

        // Keep only the last 5 searches
        if (recentSearches.length > 5) {
            recentSearches = recentSearches.slice(0, 5);
        }

        // Save updated list
        await AsyncStorage.setItem(key, JSON.stringify(recentSearches));
    } catch (error) {
        console.error("Error saving recent searches:", error);
    }
};

// ✅ Clear a specific recent search item
export const clearRecentSearchItem = async (keyword: string) => {
    try {
        let recentSearches = await getRecentSearchs();

        // Remove the specific keyword from the list
        recentSearches = recentSearches.filter((item) => item !== keyword);

        // Save the updated list
        await AsyncStorage.setItem(key, JSON.stringify(recentSearches));
    } catch (error) {
        console.error("Error clearing specific recent search:", error);
    }
};

// ✅ Clear all recent searches
export const clearRecentSearchs = async () => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error("Error clearing recent searches:", error);
    }
};
