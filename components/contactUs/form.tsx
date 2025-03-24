import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform 
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAddPartRequestMutation } from "@/saleor/api.generated";
import { colors } from "../Themed";

// Define Type for Form Values
interface FormValues {
  name: string;
  contact: string;
  partDetails: string;
  carDetails: string;
}

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Nom requis"),
  contact: Yup.string()
    .matches(/^\d{10}$/, "Le contact doit être un numéro de téléphone valide (10 chiffres).")
    .required("Contact requis"),
  partDetails: Yup.string().required("Détails de la pièce requis"),
  carDetails: Yup.string().required("Détails du véhicule requis"),
});

const PartRequestForm = () => {
  const [addPartRequest] = useAddPartRequestMutation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitForm = async (values: FormValues) => {
    try {
      setLoading(true);
      const { data } = await addPartRequest({ variables: values });

      if (data?.partRequestAdd?.errors.length) {
        const errorMessages = data.partRequestAdd.errors.map((err: any) => err.message).join("\n");
        Alert.alert("Erreur", errorMessages);
      } else {
        setSubmitted(true);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successMessage}>
          ✅ Votre demande a été reçue ! Vous serez contacté sous peu.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 20 }}
      extraScrollHeight={50} // Moves the view up when typing
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled" // Allows tapping outside to dismiss the keyboard
    >
      <Formik<FormValues>
        initialValues={{ name: "", contact: "", partDetails: "", carDetails: "" }}
        validationSchema={validationSchema}
        onSubmit={(values: FormValues) => handleSubmitForm(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Demande de pièce</Text>

            <TextInput
              placeholder="Nom"
              style={styles.input}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              placeholder="Numéro de téléphone"
              keyboardType="numeric"
              style={styles.input}
              onChangeText={handleChange("contact")}
              onBlur={handleBlur("contact")}
              value={values.contact}
            />
            {touched.contact && errors.contact && <Text style={styles.error}>{errors.contact}</Text>}

            <TextInput
              placeholder="Détails de la pièce"
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              onChangeText={handleChange("partDetails")}
              onBlur={handleBlur("partDetails")}
              value={values.partDetails}
            />
            {touched.partDetails && errors.partDetails && <Text style={styles.error}>{errors.partDetails}</Text>}

            <TextInput
              placeholder="Détails du véhicule (Année, Marque, Modèle, Version)"
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              onChangeText={handleChange("carDetails")}
              onBlur={handleBlur("carDetails")}
              value={values.carDetails}
            />
            {touched.carDetails && errors.carDetails && <Text style={styles.error}>{errors.carDetails}</Text>}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={() => handleSubmit()}
              disabled={loading}
              style={[
                styles.submitButton,
                { opacity: loading ? 0.5 : 1 },
              ]}
              activeOpacity={0.7}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>ENVOYER</Text>}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginTop: 10,
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successMessage: {
    fontSize: 18,
    color: "green",
    textAlign: "center",
  },
});

export default PartRequestForm;
