import {   Image, View, StyleSheet } from "react-native";

const logoUri = require("../assets/images/logo.png");

const Logo = ()=> <View style={{ width:"100%", alignItems:"center"}}>
<Image source={logoUri} style={styles.logo} />
  </View>


const styles = StyleSheet.create({
    logo: {
        width: 150,
        height: 25, 
        resizeMode: "contain",
        marginBottom: 10,
      },
})

export default Logo