import { useRouter } from "expo-router";
import { Platform, StyleSheet, Text } from "react-native";
import { Divider, IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {  View, colors, fonts } from "@/components/Themed";

const SimpleCloseHeader = ({ title, subTitle }: { title?: string; subTitle?: string }) => {
  const router = useRouter();
  const statusBarInset = useSafeAreaInsets();

  return (
    <View style={{ display: "flex", justifyContent: "flex-start", backgroundColor: "white" }}>
      <View style={{ ...styles.container, 
        marginTop: statusBarInset.top ,
        }}>
        <View style={styles.headerContainer}>
          <IconButton
            icon="close"
            onPress={() => router.back()}
            style={styles.closeButton}
            iconColor={colors.primary}
          />

          {/* Title and Subtitle Centered */}
          <View style={styles.titleContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
          </View>
        </View>
      </View>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: "center",
    marginBottom:1
  },
  headerContainer: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    padding:10
  },
  closeButton: {
    marginLeft: Platform.OS === "android" ? -10 : 0,
    paddingLeft:10
  },
  titleContainer: {
    flex: 1, // Ensures it takes up remaining space
    alignItems: "center",
    justifyContent: "center",
    left:-15
  },
  title: {
    fontSize:fonts.h2,
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    fontSize:fonts.caption,
    textAlign: "center",
  },
});

export default SimpleCloseHeader;
