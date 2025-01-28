import { useRouter } from "expo-router";
import { Platform, SafeAreaView, StyleSheet, Text } from "react-native";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, colors } from "../Themed";
import LoadingIndicator from "./LoadingIndicator";

const SimpleBackHeader = ({ title }: { title?: string }) => {
  const router = useRouter();
  const statusBarInset = useSafeAreaInsets();

  return (
    <>
      <SafeAreaView
        style={{
          ...styles.container,
          marginTop: statusBarInset.top + 8,
        }}
      >
        <View style={styles.backContainer}>
          <IconButton
            icon="arrow-left"
            onPress={() => router.back()}
            style={{ marginLeft: Platform.OS === "android" ? -10 : 0 }}
            iconColor={colors.blue}
          />
          {title && <Text style={styles.title}>{title}</Text>}
        </View>
      </SafeAreaView>
      <LoadingIndicator />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: 50,
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  backContainer: {
    width: "100%",
    height: 50,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.blue,
    marginLeft: 10,
  },
  backButton: {
    color: colors.blue,
  },
});

export default SimpleBackHeader;
