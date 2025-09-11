import { useEffect,useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useGetMainMenuQuery } from "@/saleor/api.generated";
import { colors, Divider, PaddedView } from "@/components/Themed";
import { getConfig } from "@/config";
// import { useLoading } from "@/context/LoadingContext";
import HomepageCarousel from "../layout/HomepageCarousel";
import { useMessage } from "@/context/MessageContext";
import ContactUS from "../contactUs/ContactUs";
import PopularCategoryGrid from "./PopularCategoryGrid";



const DashboardScreen = () => {
  // const { setLoading } = useLoading()
  const { showMessage } = useMessage();
  
  const variables = useMemo(() => ({
    channel: getConfig().channel,
  }), [getConfig().channel]);

  const { data: categoriesData, error: catError, loading, previousData } = useGetMainMenuQuery({
    variables,
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (catError) showMessage("Erreur lors du chargement des catégories", 10000);
  }, [catError]);

  
  // useEffect(() => {
  // if (loading !== null) setLoading(loading);
  //  }, [loading]);


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
          <PopularCategoryGrid
            menus={categoriesData?.menu?.items || previousData?.menu?.items ||[]}
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
