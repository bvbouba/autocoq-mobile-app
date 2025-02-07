import { useRouter } from "expo-router";
import { Platform, SafeAreaView, StyleSheet, Text,Image } from "react-native";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, colors } from "../Themed";
import LoadingIndicator from "./LoadingIndicator";

const SimpleBackHeader = ({ title,hasLogo }: { title?: string,hasLogo?:boolean }) => {
  const router = useRouter();
  const statusBarInset = useSafeAreaInsets();
  const logoUri = require("../../assets/images/logo.png");

  return (
    <>
      <SafeAreaView
        style={{
          ...styles.container,
          marginTop: statusBarInset.top+10,
        }}
      >
        <View style={styles.backContainer}>
          <IconButton
            icon="arrow-left"
            onPress={() => router.back()}
            style={{ marginLeft: Platform.OS === "android" ? -10 : 0 }}
            iconColor={colors.primary}
          />
          {title && <Text style={styles.title}>{title}</Text>}
        </View>
        <View style={{ width:"100%", alignItems:"center"}}>
        {hasLogo && <Image source={logoUri} style={styles.logo} />}
        </View>
      </SafeAreaView>
      <LoadingIndicator />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    margin: 10,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  backContainer: {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginLeft: 10,
  },
  backButton: {
    color: colors.primary,
  },
  logo: {
    width: 150,
    height: 25, 
    resizeMode: "contain",
    marginBottom: 10,
  },
});

export default SimpleBackHeader;
