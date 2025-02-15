import React, { FC, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useCheckoutBillingAddressUpdateMutation, useCheckoutEmailUpdateMutation, useGetCitiesQuery } from "@/saleor/api.generated";
import SavedAddressSelectionList from "../address/savedAddressSelectionList";
import { useAuth } from "@/lib/providers/authProvider";
import {Text, View ,colors, fonts } from "@/components/Themed"
import { useModal } from "@/context/useModal";
import { useRouter } from "expo-router";
import { useCheckout } from "@/context/CheckoutProvider";


interface Props {

}

interface Form {
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress1: string;
  streetAddress2: string;
  postalCode: string;
  city: string;
}

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Requis"),
  lastName: yup.string().required("Requis"),
  phone: yup.string().required("Requis"),
  streetAddress1: yup.string().required("Requis"),
  streetAddress2: yup.string(),
  postalCode: yup.string().required("Requis"),
  city: yup.string().required("Requis"),
});

const BillingAddressForm: FC<Props> = () => {
  const { checkout, checkoutToken } = useCheckout();
  const [updateBillingAddress] = useCheckoutBillingAddressUpdateMutation();
  const [updateEmail] = useCheckoutEmailUpdateMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { authenticated, user } = useAuth();
  const { openModal, closeModal } = useModal();
  const { data: citiesData } = useGetCitiesQuery();
  const router = useRouter();

  const renderItem = ({ item }: { item: { name: string } }) => (
    <TouchableOpacity
      style={styles.zoneItem}
      onPress={() => {
        formik.setFieldValue("city", item.name);
        closeModal();
      }}
    >
      <Text style={styles.zoneText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const updateMutation = async (formData: Form) => {
    const { data } = await updateBillingAddress({
      variables: {
        token: checkoutToken,
        billingAddress: {
          streetAddress1: formData.streetAddress1,
          streetAddress2: formData.streetAddress2,
          country: "CI",
          firstName: formData.firstName,
          lastName: formData.lastName,
          postalCode: formData.postalCode,
          phone: formData.phone,
          city: formData.city,
        },
      },
    });
    return data?.checkoutBillingAddressUpdate?.errors;
  };

  const phoneNumber = checkout?.email?.split("@")[0];

  const formik = useFormik<Form>({
    initialValues: {
      firstName: checkout?.billingAddress?.firstName || "",
      lastName: checkout?.billingAddress?.lastName || "",
      phone: checkout?.billingAddress?.phone || phoneNumber || "",
      streetAddress1: checkout?.billingAddress?.streetAddress1 || "",
      streetAddress2: checkout?.billingAddress?.streetAddress2 || "",
      postalCode: checkout?.billingAddress?.postalCode || "225",
      city: checkout?.billingAddress?.city || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      setLoading(true);
      setError(null);
      try {
        const errors = await updateMutation(data);
        if (errors && errors.length > 0) {
          setError(`Erreur : ${errors[0].field}`);
        } else {
          if (!checkout?.email) {
            const phoneNumber = user?.email.split("@")[0] || data.phone;
            const result = await updateEmail({
              variables: {
                token: checkoutToken,
                email: `${phoneNumber}@autocoq.com`,
              },
            });
            const emailErrors = result.data?.checkoutEmailUpdate?.errors;

            if (emailErrors && emailErrors?.length > 0) {
              setError(`Erreur lors de la mise à jour de l'adresse e-mail`);
              return;
            }
          }
          router.push("/checkout");
        }
      } catch (e) {
        setError("Échec de l'enregistrement de l'adresse de facturation. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    },
  });

  const renderForm = () => (
    <View style={styles.formContainer}>
      {/* Prénom */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("firstName", value)}
          value={formik.values.firstName}
          placeholder="Prénom"
          label="Prénom *"
          theme={{ colors: { primary: "black" } }}
        />
      </View>

      {/* Nom */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("lastName", value)}
          value={formik.values.lastName}
          placeholder="Nom"
          label="Nom *"
          theme={{ colors: { primary: "black" } }}
        />
      </View>

      {/* Téléphone */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("phone", value)}
          value={formik.values.phone}
          placeholder="Numéro de téléphone"
          label="Numéro de téléphone *"
          theme={{ colors: { primary: "black" } }}
        />
      </View>

      {/* Adresse Ligne 1 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("streetAddress1", value)}
          value={formik.values.streetAddress1}
          placeholder="Adresse Ligne 1"
          label="Adresse Ligne 1 *"
          theme={{ colors: { primary: "black" } }}
        />
      </View>

      {/* Adresse Ligne 2 (Optionnel) */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("streetAddress2", value)}
          value={formik.values.streetAddress2}
          placeholder="Adresse Ligne 2"
          label="Adresse Ligne 2"
          theme={{ colors: { primary: "black" } }}
        />
      </View>

      {/* Ville */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() =>
            openModal(
              "shipping",
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sélectionnez votre ville</Text>

                <FlatList
                  data={citiesData?.getShippingZones?.filter((zone) => zone !== null) as { name: string }[]}
                  keyExtractor={(item, idx) => `${item.name}-${idx}`}
                  renderItem={renderItem}
                  contentContainerStyle={styles.listContainer}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )
          }
        >
          <TextInput
            style={styles.input}
            value={formik.values.city}
            placeholder="Ville"
            label="Ville *"
            theme={{ colors: { primary: "black" } }}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      {/* Code Postal */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("postalCode", value)}
          value={formik.values.postalCode}
          placeholder="Code Postal"
          label="Code Postal"
          theme={{ colors: { primary: "black" } }}
        />
      </View>

      {/* Bouton de soumission */}
      <Button
        onPress={() => formik.handleSubmit()}
        mode="contained"
        disabled={loading}
        style={styles.submitButton}
        labelStyle={styles.submitButtonText}
      >
        {loading ? <ActivityIndicator color="white" /> : "CONTINUER"}
      </Button>

      {/* Message d'erreur */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {!showForm && authenticated ? (
        <>
          <SavedAddressSelectionList updateAddressMutation={(address: Form) => updateMutation(address)} />
          <Button mode="text" onPress={() => setShowForm(true)}>
            + Ajouter une nouvelle adresse
          </Button>
        </>
      ) : (
        renderForm()
      )}
    </ScrollView>
  );
};

export default BillingAddressForm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
  },
  formContainer:{
    marginTop:40,
    padding:20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "white", // White background
    borderWidth: 1, // 1px border
    borderColor: colors.textSecondary, // Black border
    borderRadius: 4,
    paddingHorizontal: 10,
    color: "black",
  },
  mandatory: {
    color: "red",
    marginLeft: 5,
    fontSize:fonts.h2,
  },
  submitButton: {
    backgroundColor: "black", // Black button background
    marginTop: 10,
    borderRadius:5,
    padding:5
  },
  submitButtonText: {
    color: "white", // White button text
  },
  cancelButton: {
    marginTop: 10,
  },
  errorContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: colors.errorBg,
    borderRadius: 4,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: fonts.body,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  listContainer: {
    paddingVertical: 10,
  },
  zoneItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  zoneText: {
    fontSize: fonts.body,
    color: colors.textPrimary,
  },
});