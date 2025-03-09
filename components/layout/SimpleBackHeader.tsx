import { useRouter } from "expo-router";
import { Platform, SafeAreaView, StyleSheet, Image } from "react-native";
import { Text, View, colors, fonts } from "@/components/Themed";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationContext } from "@/context/NavigationContext";

const SimpleBackHeader = ({ title, hasLogo }: { title?: string; hasLogo?: boolean }) => {
  const statusBarInset = useSafeAreaInsets();
  const logoUri = require("@/assets/images/logo.png");
  const router = useRouter()
  const {navigationLink,setNavigationLink} = useNavigationContext()

  return (
    <View style={{ display: "flex", justifyContent: "flex-start", backgroundColor: "white" }}>
      <SafeAreaView
        style={{
          ...styles.container,
          marginTop: statusBarInset.top + 10,
        }}
      >
        <View style={styles.backContainer}>
          <IconButton
            icon="arrow-left"
            onPress={() => {
              if(navigationLink) {
              router.push(navigationLink)
              }else {
                router.back()
              }
              setNavigationLink(undefined)
            }}
            style={{ marginLeft: Platform.OS === "android" ? -10 : 0 }}
            iconColor={colors.primary}
          />
          {title && <Text style={styles.title}>{title}</Text>}
        </View>
        <View style={{ width: "100%", alignItems: "center" }}>
          {hasLogo && <Image source={logoUri} style={styles.logo} />}
        </View>
      </SafeAreaView>
    </View>
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
    justifyContent: "space-between", 
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    color: colors.secondary,
    flex: 1, 
    textAlign: "center", 
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
