import React, { useState } from "react";
import {   TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useLazyQuery } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router"; // Used for navigation
import { CheckPhoneNumberDocument } from "@/saleor/api.generated";
import {Text, View,colors } from "@/components/Themed"


const AuthScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Router for navigation
  const { redirectUrl } = useLocalSearchParams();

  // Apollo useLazyQuery for checking phone number
  const [checkPhoneExists, { loading }] = useLazyQuery(CheckPhoneNumberDocument, {
    onCompleted: (data) => {
      if (data?.checkPhoneExists?.error) {
        setError(data.checkPhoneExists.error);
      } else {
        // Redirect user based on phone number existence
        if (data.checkPhoneExists.exists) {
          router.push(`/account/signin?phone=${phoneNumber}&redirectUrl=${redirectUrl}`);
        } else {
          router.push(`/account/signup?phone=${phoneNumber}&redirectUrl=${redirectUrl}`);
        }
      }
    },
    onError: (err) => {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error(err);
    },
  });

  // Function to check phone number existence
  const handleCheckNumber = () => {
    setError(null);

    // Validate phone number length (must be 10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Le numéro de téléphone doit comporter exactement 10 chiffres.");
      return;
    }

    checkPhoneExists({
      variables: { phoneNumber },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter ou créer un compte</Text>
      <Text style={styles.subtitle}>
        Entrez votre numéro de téléphone ci-dessous pour commencer
      </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
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
    marginTop:5,
    backgroundColor:"white"
  },
  title: {
    fontSize:15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
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
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "400",
    fontSize: 13,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default AuthScreen;
