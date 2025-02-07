import { View,StyleSheet,ScrollView } from "react-native"
import AddVehicleBasic from "../car/AddVehicleBasic";
import CategoryList from "../layout/CategoryList";
import CategoryShortList from "../layout/CategoryShortList";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import HeaderBack from "../layout/HeaderBack";

const uri = require("../../assets/images/mechanic.jpg");



const ShopScreen = () => {
   
    return(
        <View style={styles.container}>
            <AddVehicleBasic />
            <ScrollView>
            <View 
            style={{
                width:"100%",
            }}
            >
            {/* <Image source={uri} style={styles.banner} /> */}

            </View>
           <CategoryShortList  />
           <CategoryList  />
           </ScrollView>
            
        </View>
    )
}
    

export default ShopScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
      },
    banner: {
        width: "100%",
        height: 200, 
        resizeMode: "stretch",
      },
})