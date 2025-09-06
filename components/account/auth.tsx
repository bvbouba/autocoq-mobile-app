import { useState,useRef } from "react";
import { TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useLazyQuery } from "@apollo/client/main.cjs";
import { CheckPhoneNumberDocument } from "@/saleor/api.generated";
import { Text, View, colors, fonts } from "@/components/Themed";
import { useModal } from "@/context/useModal";
import SignIn from "./signin";
import SignUp from "./signup";
import Logo from "../Logo";
import { useMessage } from "@/context/MessageContext";
import PhoneInput from "react-native-phone-number-input";

const Auth = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shortNumber, setShortNumber] = useState("")
  const [error, setError] = useState<string | null>(null);
  const { openModal, closeModal } = useModal();
  const { showMessage } = useMessage();
  const phoneInput = useRef<PhoneInput>(null);

  const [checkPhoneExists, { loading }] = useLazyQuery(CheckPhoneNumberDocument, {
    fetchPolicy: "network-only", // avoid cached responses
    onCompleted: (data) => {
      if (data?.checkPhoneExists?.exists) {
        openModal({
          id: "SignIn",
          content: <SignIn fullPhoneNumber={phoneNumber} />,
          height: "115%",
          closeButtonVisible: true,
        });
        closeModal("Auth");
      } else {
        openModal({
          id: "SignUp",
          content: <SignUp phoneNumber={shortNumber} fullPhoneNumber={phoneNumber} defaultCC={phoneInput.current?.getCountryCode()} />,
          height: "115%",
          closeButtonVisible: true,
        });
        closeModal("Auth");
      }
    },
    onError: (err) => {
      console.error("GraphQL Error:", err);
      showMessage("Une erreur est survenue. Veuillez réessayer.");
    },
  });

  // Function to check phone number existence
  const handleCheckNumber = async () => {
    const isValid = phoneInput.current?.isValidNumber(phoneNumber);
    if (isValid) {
      setError(null);
      await checkPhoneExists({ variables: { phoneNumber } });
  } else {
    setError("Le numéro de téléphone n'est pas valide.");
  }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <View>
        <Text style={styles.title}>Se connecter ou créer un compte</Text>
        <Text style={styles.subtitle}>
          Entrez votre numéro de téléphone ci-dessous pour commencer
        </Text>
      </View>

      <View style={styles.inputContainer}>
    
           <PhoneInput
                                ref={phoneInput}
                                defaultValue={phoneNumber}
                                defaultCode="CI"
                                layout="first"
                                onChangeText={(text)=>{
                                  setShortNumber(text)
                                }}
                                  onChangeFormattedText={(text) => {
                                    setPhoneNumber(text);
                                  }}
                                containerStyle={styles.input}
                                textContainerStyle={{
                                    borderRadius: 5,
                                    backgroundColor: "white",
                                }}
                                countryPickerProps={{
                                    countryCodes: ["CI", "CA"],
                                    translation: "fra",
                                }}
                            />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity onPress={handleCheckNumber} style={styles.button} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>CONTINUER</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginTop: 5,
    backgroundColor: "white",
  },
  title: {
    fontSize: fonts.body,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: fonts.body,
    color: "#666",
    marginBottom: 20,
    textAlign: "left",
  },
  inputContainer: {
    alignItems: "center",
    width: "100%",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: fonts.h2,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: fonts.body,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default Auth;
