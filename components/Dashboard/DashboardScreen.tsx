import { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View, Text } from "react-native";
import {  useRouter } from "expo-router";
import {  useGetHomepageQuery } from "../../saleor/api.generated";
import { Divider } from "../Themed";
import { getConfig } from "../../config";
import CategoriesScroll from "../Dashboard/CategoriesScroll";
import AuthPrompt from "../AuthPrompt";
import { useAuth } from "@/lib/providers/authProvider";
import AddVehicleSection from "../car/AddVehicle";
import Loading from "../Loading";
import { useLoading } from "@/context/Loading";



const DashboardScreen = () => {
  const router = useRouter();
  const { authenticated } = useAuth();
  const {setIsLoading} = useLoading()

  const { data: categoriesData, error: catError, loading } = useGetHomepageQuery({
    variables: { channel: getConfig().channel },
  });
  useEffect(() => {
    if (catError) Alert.alert("Erreur lors du chargement des catégories", catError.message);
  }, [
    catError]);

    // Set loading state globally
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);
  

  if (loading) {
    return (
      <Loading />
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
          onClick={(slug) => router.push(`categories/${slug}`)}
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
    marginTop: 0,
    marginHorizontal:15,
  },
  scroll: {
    width: "100%",
  },

});

export default DashboardScreen;
