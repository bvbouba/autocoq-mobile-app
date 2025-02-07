import {  useRouter } from "expo-router";
import { View, colors } from "../Themed";
import { IconButton } from "react-native-paper";
import ProductSearch from "../products/ProductsSearch";
import { SafeAreaView, StyleSheet, Text, Image } from "react-native";
import { FC, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoadingIndicator from "./LoadingIndicator";
import Banner from "./BannerSimple";
import AddVehicleBasic from "../car/AddVehicleBasic";
import { useLocalSearchParams, usePathname } from "expo-router/build/hooks";
import { usePath } from "@/context/backUrl";

interface Props {
  withBack?: boolean;
  cleanSearch?: boolean;
  searchOnLoad?: boolean;
  companyName?: string;
}

const SearchHeaderWithBack = () => {
  const statusBarInset = useSafeAreaInsets();
  const {goBack} = usePath()
 

  return (
    <>
      <SafeAreaView
        style={{
          ...styles.container,
          marginTop: statusBarInset.top - 7,
        }}
      >
        {/* Banner Section */}
        <Banner />
        <View style={styles.containerWithBack}>
          <View style={styles.searchBarWrapper}>
            <IconButton
              icon="arrow-left"
              onPress={() => goBack()}
              iconColor={colors.primary}
            />
            <ProductSearch />
          </View>
        </View>
      </SafeAreaView>
      <LoadingIndicator style={{ marginTop: 12 }} />
      <AddVehicleBasic />
    </>
  );
};

const SearchHeader: FC<Props> = ({
  withBack,
  cleanSearch,
  companyName,
  searchOnLoad = true,
}) => {
  const statusBarInset = useSafeAreaInsets();
  
  const logoUri = require("../../assets/images/logo.png"); // Path to logo image

  // Fallback for logo if unavailable
  const renderLogoOrName = () => {
    try {
      return <Image source={logoUri} style={styles.logo} />;
    } catch {
      return <Text style={styles.companyName}>{companyName}</Text>;
    }
  };

  if (withBack) {
    return <SearchHeaderWithBack />;
  }

  return (
    <View style={{ display: "flex", justifyContent: "flex-start", backgroundColor: "white" }}>
      <Banner />

      <View
        style={{
          ...styles.container,
          padding: 16,
          marginTop: statusBarInset.top,
          minHeight: 100,
        }}
      >
        <View style={{ alignItems:"center"}}>{renderLogoOrName()}</View>
        <View style={styles.searchBarWrapperFull}>
          <ProductSearch cleanSearch={cleanSearch} searchOnLoad={searchOnLoad} />
        </View>
      </View>
      <LoadingIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor:"white",
  },
  containerWithBack: {
    width: "100%",
    height: 40,
    marginTop: 30,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  searchBarWrapperFull: {
    width: "100%",
  },
  searchBarWrapper: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    color: colors.primary,
  },
  companyName: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  logo: {
    width: 300,
    height: 50, 
    resizeMode: "contain",
    marginBottom: 10,
  },
  banner: {
    backgroundColor: "#fffff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  bannerText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default SearchHeader;
