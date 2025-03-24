import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useGetMainMenuQuery } from "@/saleor/api.generated";
import { colors, Divider, PaddedView } from "@/components/Themed";
import { getConfig } from "@/config";
import CategoriesScroll from "../Dashboard/CategoriesScroll";
import { useLoading } from "@/context/LoadingContext";
import HomepageCarousel from "../layout/HomepageCarousel";
import { useMessage } from "@/context/MessageContext";
import ContactUS from "../contactUs/ContactUs";



const DashboardScreen = () => {
  const router = useRouter();
  // const { authenticated } = useAuth();
  const { setLoading } = useLoading()
  const { showMessage } = useMessage();

  const { data: categoriesData, error: catError, loading, previousData } = useGetMainMenuQuery({
    variables: { channel: getConfig().channel },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-and-network", // Fetches fresh data in the background while showing cache first
  });

  useEffect(() => {
    if (catError) showMessage("Erreur lors du chargement des catégories", 10000);
  }, [catError]);

  

  useEffect(() => {
  if (loading !== null) setLoading(loading);
   }, [loading]);


  return (
    <View style={styles.scrollContainer}>
      <ScrollView style={styles.scroll}>

        <HomepageCarousel />
        <PaddedView style={{
          backgroundColor: colors.background
        }}>

          {/* {!authenticated && (
            <>
              <AuthPrompt redirectUrl="/" />
              <Divider />
            </>
          )} */}


          {/* <AddVehicleSection
          />
          <Divider /> */}
          {/* Catégories */}
          <CategoriesScroll
            menus={categoriesData?.menu?.items || previousData?.menu?.items ||[]}
            onClick={(slug) => router.push(`/categories/${slug}`)}
            loading={loading}
          />
          <Divider />
          
          <ContactUS />

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
