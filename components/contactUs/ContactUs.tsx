import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View, colors, fonts } from "@/components/Themed";
import { useModal } from "@/context/useModal";
import PartRequestForm from "./form";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const ContactUS = () => {
  const { openModal } = useModal();

  const handlePress = () =>
    openModal({
      id: "Auth",
      content: <PartRequestForm />,
      height: "100%",
      marginTop: 500,
      closeButtonVisible: true,
    });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.question}>Vous ne trouvez pas votre pièce ?</Text>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
        <FontAwesome
              name="envelope" // or "phone", "info-circle", etc.
              size={18}
              color="#fff"
              style={{ marginRight: 8 }}
            />
          <Text style={styles.buttonText}>Contactez-nous</Text>
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
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  question: {
    fontSize: fonts.body,
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary, // pick your accent color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection:"row"
  },
  buttonText: {
    fontSize: fonts.body * 1.1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ContactUS;
