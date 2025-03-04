import { StyleSheet } from "react-native";
import SecondaryButton from "./button/SecondaryButton";
import {colors, fonts, SurfaceView, Text, View  } from "@/components/Themed"
import { useModal } from "@/context/useModal";
import Auth from "./account/auth";

interface props {
  redirectUrl:string
}

const AuthPrompt = ({redirectUrl}:props) => {
  const {openModal} = useModal()

  return (
    <SurfaceView style={styles.wrapper}>
      <View style={{
        alignItems:"center",
      }}>
        <Text style={{
          marginBottom:10,
          fontSize:fonts.h2,
          color:colors.textPrimary
        }}>
        DES RÉCOMPENSES <Text style={{
          fontWeight:"bold",
          color:colors.primary,
          fontSize:fonts.h2
        }}>VOUS ATTENDENT</Text>
        </Text>
      <Text style={styles.promptText}>
      Rejoignez AutoCoq et commencez à gagner des points dès aujourd'hui !
      </Text>
      </View>
      <View style={{width:"100%"}}>
      <SecondaryButton
                title={`SE CONNECTER OU CRÉER UN COMPTE`}
                onPress={()=>openModal({
                  id:"Auth",
                  content:<Auth />})}
                />    
      </View>
    </SurfaceView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection:"column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
  },

  promptText: {
    fontSize:fonts.body,
    color: "#666",
    marginBottom: 10,
  },

});

export default AuthPrompt;
