import React, { FC, useState } from "react";
import { FlatList, Pressable, StyleSheet, TouchableOpacity, } from "react-native";
import { useFormik } from "formik";
import { Text, View, colors, fonts } from "@/components/Themed"

import * as yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useCheckoutBillingAddressUpdateMutation, useCheckoutEmailUpdateMutation, useCheckoutShippingAddressUpdateMutation, useGetCitiesQuery } from "@/saleor/api.generated";
import SavedAddressSelectionList from "../address/savedAddressSelectionList";
import { useAuth } from "@/lib/providers/authProvider";
import { useRouter } from "expo-router";
import { useModal } from "@/context/useModal";
import { useCheckout } from "@/context/CheckoutProvider";

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
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

const ShippingAddressForm: FC<Props> = () => {
  const { checkout, checkoutToken } = useCheckout();
  const [updateShippingAddress] = useCheckoutShippingAddressUpdateMutation();
  const [updateBillingAddress] = useCheckoutBillingAddressUpdateMutation();
  const [updateEmail] = useCheckoutEmailUpdateMutation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { authenticated, user } = useAuth()
  const { openModal, closeModal } = useModal()
  const { data: citiesData, } = useGetCitiesQuery();

  const renderItem = ({ item }: { item: { name: string } }) => (
    <TouchableOpacity
      style={styles.zoneItem}
      onPress={() => {
        formik.setFieldValue("city", item.name)
        closeModal("shipping")
      }
      }
    >
      <Text style={styles.zoneText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const updateMutation = async (formData: Form) => {
    const { data } = await updateShippingAddress({
      variables: {
        token: checkoutToken,
        shippingAddress: {
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
    return data?.checkoutShippingAddressUpdate?.errors
  };

  const updateBillingMutation = async (formData: Form) => {
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


  const phoneNumber = checkout?.email?.split('@')[0]

  const formik = useFormik<Form>({
    initialValues: {
      firstName: checkout?.shippingAddress?.firstName || checkout?.billingAddress?.firstName || "",
      lastName: checkout?.shippingAddress?.lastName || checkout?.billingAddress?.lastName || "",
      phone: checkout?.shippingAddress?.phone || checkout?.billingAddress?.phone || phoneNumber || "",
      streetAddress1: checkout?.shippingAddress?.streetAddress1 || checkout?.billingAddress?.streetAddress1 || "",
      streetAddress2: checkout?.shippingAddress?.streetAddress2 || checkout?.billingAddress?.streetAddress2 || "",
      postalCode: checkout?.shippingAddress?.postalCode || "225",
      city: checkout?.shippingAddress?.city || checkout?.billingAddress?.city || "",
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
          if (!checkout?.billingAddress) {
            const billingErrors = await updateBillingMutation(data);
            if (billingErrors && billingErrors.length > 0) {
              setError(`Erreur lors de la mise à jour de l'adresse de facturation : ${billingErrors[0].field}`);
              return;
            }
          }
          setLoading(false);
          router.push("/checkout");
        }
      } catch (e) {
        setError("Échec de l'enregistrement de l'adresse de livraison. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    },
  });

  const renderForm = () => (
    <View style={styles.formContainer}>

      {/* Nom de famille */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("lastName", value)}
          value={formik.values.lastName}
          placeholder="Nom de famille"
          label={"Nom de famille *"}
          theme={{ colors: { primary: colors.textPrimary } }}
          onBlur={() => formik.setFieldTouched("lastName")} // Mark field as touched
        />
        {formik.touched.lastName && formik.errors.lastName && (
            <Text style={styles.errorText}>{formik.errors.lastName}</Text>
          )}
      </View>

      {/* Prénom */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("firstName", value)}
          value={formik.values.firstName}
          placeholder="Prénom"
          label={`Prénom *`}
          theme={{ colors: { primary: colors.textPrimary } }}
          onBlur={() => formik.setFieldTouched("firstName")} // Mark field as touched
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <Text style={styles.errorText}>{formik.errors.firstName}</Text>
        )}
      </View>

      {/* Téléphone */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("phone", value)}
          value={formik.values.phone}
          placeholder="Numéro de téléphone"
          label={"Numéro de téléphone *"}
          theme={{ colors: { primary: colors.textPrimary } }}
          onBlur={() => formik.setFieldTouched("phone")} // Mark field as touched
        />
        {formik.touched.phone && formik.errors.phone && (
          <Text style={styles.errorText}>{formik.errors.phone}</Text>
        )}
      </View>

      {/* Adresse Ligne 1 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("streetAddress1", value)}
          value={formik.values.streetAddress1}
          placeholder="Adresse Ligne 1"
          label={"Adresse Ligne 1 *"}
          theme={{ colors: { primary: colors.textPrimary } }}
          onBlur={() => formik.setFieldTouched("streetAddress1")} // Mark field as touched
        />
        {formik.touched.streetAddress1 && formik.errors.streetAddress1 && (
          <Text style={styles.errorText}>{formik.errors.streetAddress1}</Text>
        )}
      </View>

      {/* Adresse Ligne 2 (Optionnel) */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("streetAddress2", value)}
          value={formik.values.streetAddress2}
          placeholder="Adresse Ligne 2"
          label="Adresse Ligne 2"
          theme={{ colors: { primary: colors.textPrimary } }}
          onBlur={() => formik.setFieldTouched("streetAddress2")} // Mark field as touched
          
        />
        {formik.touched.streetAddress2 && formik.errors.streetAddress2 && (
          <Text style={styles.errorText}>{formik.errors.streetAddress2}</Text>
        )}
      </View>

      {/* Ville */}
      <View style={styles.inputContainer}>
        <Pressable
          style={{
            width: "100%"
          }}
          onPress={() =>
            openModal({
              id: "shipping",
              content: <View style={styles.modalContent}>
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
            })
          }
        >
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              value={formik.values.city}
              placeholder="Ville"
              label={"Ville *"}
              theme={{ colors: { primary: colors.textPrimary } }}
              editable={false}
            />
            {formik.touched.city && formik.errors.city && (
          <Text style={styles.errorText}>{formik.errors.city}</Text>
        )}
          </View>
        </Pressable>
      </View>

      {/* Code postal */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("postalCode", value)}
          value={formik.values.postalCode}
          placeholder="Code postal"
          label="Code postal"
          theme={{ colors: { primary: colors.textPrimary } }}
          onBlur={() => formik.setFieldTouched("postalCode")} // Mark field as touched
        />
      </View>
      {formik.touched.postalCode && formik.errors.postalCode && (
          <Text style={styles.errorText}>{formik.errors.postalCode}</Text>
        )}

      {/* Bouton de soumission */}
      <TouchableOpacity
        onPress={() => formik.handleSubmit()}
        disabled={loading}
        style={[
          styles.submitButton,

          { opacity: loading ? 0.5 : 1 }, 
        ]}
        activeOpacity={0.7} 
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>CONTINUER</Text>}
      </TouchableOpacity>

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
          <SavedAddressSelectionList
            updateAddressMutation={(address: Form) => updateMutation(address)}
          />
          <Button mode="text" onPress={() => setShowForm(true)}>
            <Text>  + Ajouter une nouvelle adresse </Text>
          </Button>
        </>
      ) : (
        renderForm()
      )}
    </ScrollView>
  );
};

export default ShippingAddressForm;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
  },
  formContainer: {
    marginTop: 40,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "column",
    marginBottom: 16,
    width: "100%",
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 10,
    color: colors.textPrimary,
    width: "100%",
  },
  mandatory: {
    color: "red",
    marginLeft: 5,
    fontSize: fonts.h2,
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  cancelButton: {
    marginTop: 10,
  },
  errorContainer: {
    marginTop: 16,
    padding: 10,
    borderRadius: 4,
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

