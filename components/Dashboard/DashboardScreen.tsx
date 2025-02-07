import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useCategoryPathsQuery, useGetHomepageQuery } from "../../saleor/api.generated";
import { colors, Divider } from "../Themed";
import { getConfig } from "../../config";
import CategoriesScroll from "../Dashboard/CategoriesScroll";
import { useCarFilter } from "@/context/useCarFilterContext";
import AuthPrompt from "../AuthPrompt";
import { useAuth } from "@/lib/providers/authProvider";
import AddVehicleSection from "../car/AddVehicle";


const DashboardScreen = () => {
  const router = useRouter();
  const { authenticated } = useAuth();

  const { data: categoriesData, error: catError, loading } = useGetHomepageQuery({
    variables: { channel: getConfig().channel },
  });

  useEffect(() => {
    if (catError) Alert.alert("Erreur lors du chargement des catégories", catError.message);
  }, [
    catError]);

  if (loading) {
    return (
      <View style={styles.scrollContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.scrollContainer}>
      <ScrollView style={styles.scroll}>
        <Divider />
        
        <AddVehicleSection 
        />
        
        <Divider />
        {/* Catégories */}
        <CategoriesScroll
          menus={categoriesData?.menu?.items || []}
          onClick={(slug) => router.push("products/results?categories=" + slug)}
        />
        <Divider />
        {!authenticated && (
          <>
            <AuthPrompt redirectUrl="/" />
            <Divider />
          </>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    width: "100%",
    paddingBottom: 16,
  },
  scroll: {
    width: "100%",
  },

});

export default DashboardScreen;
