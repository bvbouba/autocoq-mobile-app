import { View,StyleSheet,ScrollView } from "react-native"
import CategoryList from "../layout/CategoryList";
import CategoryShortList from "../layout/CategoryShortList";

const uri = require("../../assets/images/mechanic.jpg");



const ShopScreen = () => {
   
    return(
        <View style={styles.container}>
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