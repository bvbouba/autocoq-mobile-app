import { StyleSheet } from "react-native"
import {colors, Text, View } from "@/components/Themed"
import FontAwesome from "@expo/vector-icons/FontAwesome";


const ItemNotAvailable =()=>{
    return(
      <View style={styles.scrollContainer}>
        <FontAwesome name="warning" size={15} color="red"
                  />
      <Text style={{
        marginLeft:10        
      }}>Cet article n'est pas disponible.</Text>
  </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection:"row",
      marginTop: 10,
      width: "100%",
      padding:10,
      backgroundColor:colors.warningBg
    },
  });

  export default ItemNotAvailable;