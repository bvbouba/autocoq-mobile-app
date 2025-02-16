import { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useGetMainMenuQuery } from "@/saleor/api.generated";
import { colors, Divider, PaddedView } from "@/components/Themed";
import { getConfig } from "@/config";
import CategoriesScroll from "../Dashboard/CategoriesScroll";
import AuthPrompt from "../AuthPrompt";
import { useAuth } from "@/lib/providers/authProvider";
import { useLoading } from "@/context/LoadingContext";
import HomepageCarousel from "../layout/HomepageCarousel";



const DashboardScreen = () => {
  const router = useRouter();
  const { authenticated } = useAuth();
  const { setLoading } = useLoading()

  const { data: categoriesData, error: catError, loading } = useGetMainMenuQuery({
    variables: { channel: getConfig().channel },
  });
  useEffect(() => {
    if (catError) Alert.alert("Erreur lors du chargement des catégories", catError.message);
  }, [
    catError]);



  // Set loading state globally
  useEffect(() => {
    setLoading(loading);
  }, [loading]);


  return (
    <View style={styles.scrollContainer}>
      <ScrollView style={styles.scroll}>

        <HomepageCarousel />
        <PaddedView style={{
          backgroundColor: colors.background
        }}>

          {!authenticated && (
            <>
              <AuthPrompt redirectUrl="/" />
              <Divider />
            </>
          )}


          {/* <AddVehicleSection
          />
          <Divider /> */}
          {/* Catégories */}
          <CategoriesScroll
            menus={categoriesData?.menu?.items || []}
            onClick={(slug) => router.push(`/categories/${slug}`)}
            loading={loading}
          />
          <Divider />


        </PaddedView>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scroll: {
    width: "100%",
  },

});

export default DashboardScreen;
