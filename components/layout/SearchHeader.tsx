import { View, colors, fonts } from "@/components/Themed";
import { IconButton } from "react-native-paper";
import ProductSearch from "../products/ProductsSearch";
import { SafeAreaView, StyleSheet, Text, Image } from "react-native";
import { FC, } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Banner from "./BannerSimple";
import AddVehicleBasic from "../car/AddVehicleBasic";
import { useNavigationContext } from "@/context/NavigationContext";

interface Props {
  withBack?: boolean;
  cleanSearch?: boolean;
  searchOnLoad?: boolean;
  companyName?: string;
  withVehicle?:boolean;
  carIconColor?:string;
}

const SearchHeaderWithBack = ({withVehicle,carIconColor}:{withVehicle:boolean,  carIconColor?:string;}) => {
  const statusBarInset = useSafeAreaInsets();
  const {handleBackNavigation} = useNavigationContext()
 

  return (
    <View style={{ display: "flex", justifyContent: "flex-start", backgroundColor: "white" }}>
      <SafeAreaView
        style={{
          ...styles.container,
          marginTop: statusBarInset.top,
        }}
      >
        {/* Banner Section */}
        <Banner />
        <View style={styles.containerWithBack}>
          <View style={styles.searchBarWrapper}>
            <IconButton
              icon="arrow-left"
              onPress={() => handleBackNavigation()}
              iconColor={colors.primary}
            />
            <ProductSearch carIconColor={carIconColor}/>
          </View>
        </View>
      </SafeAreaView>
      {withVehicle && <AddVehicleBasic />}
      </View>
  );
};

const SearchHeader: FC<Props> = ({
  withBack,
  cleanSearch,
  companyName,
  searchOnLoad = true,
  withVehicle=true,
  carIconColor
}) => {
  const statusBarInset = useSafeAreaInsets();
  
  const logoUri = require("@/assets/images/logo.png"); // Path to logo image

  // Fallback for logo if unavailable
  const renderLogoOrName = () => {
    try {
      return <Image source={logoUri} style={styles.logo} />;
    } catch {
      return <Text style={styles.companyName}>{companyName}</Text>;
    }
  };

  if (withBack) {
    return <SearchHeaderWithBack withVehicle={withVehicle} carIconColor={carIconColor}/>;
  }
  return (
    <View style={{ display: "flex", justifyContent: "flex-start", backgroundColor: "white" }}>

      <View
        style={{
          ...styles.container,
          paddingBottom: 16,
          paddingHorizontal:16,
          marginTop: statusBarInset.top,
          minHeight: 100,
        }}
      >
              <Banner />

        <View style={{ alignItems:"center"}}>{renderLogoOrName()}</View>
        <View style={styles.searchBarWrapperFull}>
          <ProductSearch cleanSearch={cleanSearch} searchOnLoad={searchOnLoad}
          carIconColor={carIconColor}
          />
        </View>
      </View>
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
    elevation:2,
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Moves shadow downwards
    shadowOpacity: 0.2, // Adjust transparency
    shadowRadius: 2, // Blur effect
  },
  containerWithBack: {
    width: "100%",
    height: 40,
    marginTop: 0,
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
    fontSize:fonts.h1,
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
    fontSize:fonts.caption,
    fontWeight: "bold",
  },
});

export default SearchHeader;
