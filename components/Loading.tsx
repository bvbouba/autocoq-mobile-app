import { StyleSheet } from "react-native"
import {Text, View } from "@/components/Themed"


const Loading =()=>{
    return(
      <View style={styles.scrollContainer}>
      <Text>Chargement...</Text>
  </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 0,
      width: "100%",
      paddingBottom: 16,
      minHeight: 400,
    },
    scroll: {
      width: "100%",
    },
  
  });

  export default Loading;