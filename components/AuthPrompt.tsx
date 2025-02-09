import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import SecondaryButton from "./button/SecondaryButton";
import {fonts, SurfaceView, Text, View  } from "@/components/Themed"

interface props {
  redirectUrl:string
}

const AuthPrompt = ({redirectUrl}:props) => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push(`/account/auth?redirectUrl=${redirectUrl}`);
  };

  return (
    <SurfaceView style={styles.wrapper}>
      <View>
      <Text style={styles.promptText}>
      Rejoignez Autocoq et commencez à économiser dès aujourd'hui.
      </Text>
      </View>
      <View style={{width:"100%"}}>
      <SecondaryButton
                title={`SE CONNECTER OU CRÉER UN COMPTE`}
                onPress={handleSignIn}
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
