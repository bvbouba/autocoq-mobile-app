import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View, colors, fonts } from "@/components/Themed";
import { useModal } from "@/context/useModal";
import PartRequestForm from "./form";

const ContactUS = () => {
  const {openModal}= useModal()

  return (
    <View style={styles.wrapper}>
      <View style={{ ...styles.container}}>
      
      <TouchableOpacity
          onPress={()=>openModal({
            id:"Auth",
            content:<PartRequestForm />,
            height:"100%",
            marginTop:500,
            closeButtonVisible:true
          
          })}
          >
        <Text style={styles.text}>Vous ne trouvez pas votre pièce? 
         <Text style={{
          textDecorationLine:"underline"
        }}>{` Contactez nous.`}</Text>
        </Text>
        </TouchableOpacity>
      
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "inherit",
  },
  container: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
  },
  text: {
    fontSize: fonts.body,
    color: colors.textPrimary,
    textAlign: "center",
  },
});

export default ContactUS;
