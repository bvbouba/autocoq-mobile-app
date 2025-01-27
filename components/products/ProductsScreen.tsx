import { useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity,Text } from 'react-native';
import { Portal, Provider } from "react-native-paper";
import { View } from "../Themed";
import ProductListComponent from "./ProductListComponent";
import ProductFilter from "./filter/ProductFilter";
import ProductFilterBottomSheet from "./filter/ProductFilterBottomSheet";
import { useRouter, useLocalSearchParams } from "expo-router";
import CarFilterModal from "../car/Modal";
import { useCarFilter } from "@/context/useCarFilterContext";
import { FontAwesome } from "@expo/vector-icons";

const ProductsScreen = () => {
    const {
        search: searchQueryString,
        collection: collectionsQueryString,
        categories: categoriesQueryString,
    } = useLocalSearchParams();
    const router = useRouter()
    const [filterOpen1, setFilterOpen1] = useState(false);
  const { selectedCarYear, selectedCarMake, selectedCarModel, clearFilter } = useCarFilter(); // Added clearFilter from context


    const [filterOpen, setFilterOpen] = useState(false);

    const changeCollectionAndCategories = useCallback((collectionValue: string | undefined | null, categories: string[]) => {
        const params = new URLSearchParams();

        if (searchQueryString !== undefined) {
            params.append("search", searchQueryString as string)
        }

        if (collectionValue !== undefined) {
            params.append("collection", collectionValue as string)
        }

        if (categories !== undefined) {
            params.append("categories", categories.join(","))
        } else if (categoriesQueryString !== undefined) {
            params.append("categories", categoriesQueryString as string)
        }

        router.push("/products/results?" + params.toString())
    }, [categoriesQueryString, searchQueryString, collectionsQueryString]);

    return <>
        <Provider>
            <Portal>
                <ProductFilterBottomSheet onClose={() => setFilterOpen(false)} open={filterOpen} onApply={(data) => {
                    setFilterOpen(false)
                    changeCollectionAndCategories(data.collection?.slug, data.categories.map(cat => cat.slug))
                }} />
            </Portal>

            <View style={styles.container}>
                <ProductFilter openFilters={() => setFilterOpen(true)} />
                    {/* Filter Toggle */}
        {selectedCarYear && selectedCarMake && selectedCarModel ? (
          <View style={styles.currentFilterContainer}>
            <Text style={styles.currentFilterText}>
              {`Current parts displayed are for ${selectedCarMake.name} ${selectedCarModel.name} ${selectedCarYear.name}`}
            </Text>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
              <FontAwesome name="close" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setFilterOpen1(true)}
          >
            <Text style={styles.toggleButtonText}>
              {`Add a Car to Tailor Search`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Car Filter Component */}
        {filterOpen1 && (
          <CarFilterModal onClose={() => setFilterOpen1(false)} open={filterOpen1}  />
        )}
                <ProductListComponent  />
            </View>
        </Provider>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    toggleButton: {
        margin: 10,
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
      },
      toggleButtonText: {
        color: "#fff",
        fontWeight: "bold",
      },
      currentFilterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 10,
        padding: 10,
        backgroundColor: "#e8f4f8",
        borderRadius: 8,
      },
    currentFilterText: {
        fontSize: 14,
        color: "#333",
        flex: 1,
        marginRight: 10,
      },
      clearButton: {
        padding: 5,
        borderRadius: 20,
        backgroundColor: "#ffe6e6",
      },
});

export default ProductsScreen