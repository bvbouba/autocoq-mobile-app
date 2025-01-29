import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { useCategoryPathsQuery, useGetCollectionsQuery } from "../../saleor/api.generated";
import { Divider } from "../Themed";
import { getConfig } from "../../config";
import CategoriesScroll from "../Dashboard/CategoriesScroll";
import CollectionBanner from "../Dashboard/collections/CollectionBanner";
import { useCarFilter } from "@/context/useCarFilterContext";
import { FontAwesome } from "@expo/vector-icons";
import CarFilterModal from "../car/Modal";
import AuthPrompt from "../AuthPrompt";
import { useAuth } from "@/lib/providers/authProvider";

const DashboardScreen = () => {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const { selectedCarYear, selectedCarMake, selectedCarModel, clearFilter } = useCarFilter(); // Added clearFilter from context
  const {authenticated} = useAuth()

  const { data, loading, error:colError } = useGetCollectionsQuery({
    variables:{
      filter:{
        ...(selectedCarYear || selectedCarMake || selectedCarModel
          ? {
                ...(selectedCarYear && { carYear: [selectedCarYear.id] }), 
                ...(selectedCarMake && { carMake: [selectedCarMake.id] }), 
                ...(selectedCarModel && { carModel: [selectedCarModel.id] }),
            }
          : {})
      }
    }
  });
  const { data: categoriesData, error: catError } = useCategoryPathsQuery({
    variables: { channel: getConfig().channel },
  });
  useEffect(() => {
    if (colError) Alert.alert("Error loading collections", colError.message);
    if (catError) Alert.alert("Error loading categories", catError.message);
  }, [colError, catError]);


  if (loading) {
    return (
      <View style={styles.scrollContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.scrollContainer}>
      <ScrollView style={styles.scroll}>
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
            onPress={() => setFilterOpen(true)}
          >
            <Text style={styles.toggleButtonText}>
              {`Add a Car to Tailor Search`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Car Filter Component */}
        {filterOpen && (
          <CarFilterModal onClose={() => setFilterOpen(false)} open={filterOpen}  />
        )}

         {/* Categories */}
         <CategoriesScroll
          categories={categoriesData?.categories?.edges.map((cat) => cat.node) || []}
          onClick={(slug) => router.push("products/results?categories=" + slug)}
        />
               {!authenticated &&  <AuthPrompt />}

        <Divider />

        {/* Collections */}
        {data?.collections?.edges.map((collection) => (
          <CollectionBanner
            key={collection.node.id}
            collection={collection.node}
            onClick={(coll) => router.push("/products/results?collection=" + coll.slug)}
            onProductClick={console.log}
          />
        ))}

        <Divider />
       
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  scroll: {
    width: "100%",
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

export default DashboardScreen;
