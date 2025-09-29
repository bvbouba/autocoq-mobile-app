import React, { FC, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, TouchableOpacity, } from "react-native";
import { useFormik } from "formik";
import { Text, View, colors, fonts } from "@/components/Themed"

import * as yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { CountryCode, useCheckoutBillingAddressUpdateMutation, useCheckoutEmailUpdateMutation, useCheckoutShippingAddressUpdateMutation, useGetCitiesQuery } from "@/saleor/api.generated";
import SavedAddressSelectionList from "../address/savedAddressSelectionList";
import { useAuth } from "@/lib/providers/authProvider";
import { useRouter } from "expo-router";
import { useModal } from "@/context/useModal";
import { useCheckout } from "@/context/CheckoutProvider";
import PhoneInput from "react-native-phone-number-input";
import { parsePhone } from "@/utils/parsePhone";
import { FontAwesome } from "@expo/vector-icons";

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
  const phoneInput = useRef<PhoneInput>(null);
  const parsedPhone = parsePhone(checkout?.shippingAddress?.phone || checkout?.billingAddress?.phone || checkout?.email?.split('@')[0] || "")
  const [countryCode, setCountryCode] = useState<CountryCode>(parsedPhone.countryCode as CountryCode) 
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
          country: countryCode,
          firstName: formData.firstName,
          lastName: formData.lastName,
          postalCode: formData.postalCode,
          phone: formData.phone,
          city: formData.city,
          countryArea:"ON"
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
          country: countryCode,
          firstName: formData.firstName,
          lastName: formData.lastName,
          postalCode: formData.postalCode,
          phone: formData.phone,
          city: formData.city,
          countryArea:"ON"
        },
      },
    });

    return data?.checkoutBillingAddressUpdate?.errors;
  };

  const handlePhoneValidation = () => {
    if (phoneInput.current) {
      const isValid = phoneInput.current?.isValidNumber(formik.values.phone);
      if (!isValid) {
        formik.setFieldError("phone", "Numéro de téléphone invalide");
      }
      return isValid;
    }
    return false;
  };
  const formik = useFormik<Form>({
    initialValues: {
      firstName: checkout?.shippingAddress?.firstName || checkout?.billingAddress?.firstName || "",
      lastName: checkout?.shippingAddress?.lastName || checkout?.billingAddress?.lastName || "",
      phone: parsedPhone.nationalNumber,
      streetAddress1: checkout?.shippingAddress?.streetAddress1 || checkout?.billingAddress?.streetAddress1 || "",
      streetAddress2: checkout?.shippingAddress?.streetAddress2 || checkout?.billingAddress?.streetAddress2 || "",
      postalCode: checkout?.shippingAddress?.postalCode || checkout?.billingAddress?.postalCode || "",
      city: checkout?.shippingAddress?.city || checkout?.billingAddress?.city || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      const valid = handlePhoneValidation();
      if (!valid) return;

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
        {/* <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("phone", value)}
          value={formik.values.phone}
          placeholder="Numéro de téléphone"
          label={"Numéro de téléphone *"}
          theme={{ colors: { primary: colors.textPrimary } }}
          onBlur={() => formik.setFieldTouched("phone")} // Mark field as touched
        /> */}
        <PhoneInput
          ref={phoneInput}
          defaultValue={parsedPhone.nationalNumber}   // no "+"
          defaultCode={parsedPhone.countryCode}    // ensures correct CC
          layout="first"
          onChangeFormattedText={(text) => {
            formik.setFieldValue("phone", text); // saves full +E164
          }}
          onChangeCountry={(country) => {
            // country.cca2 gives ISO2 code (e.g. "CI", "CA")
            setCountryCode(country.cca2 as CountryCode);
          }}
          containerStyle={styles.input}
          textContainerStyle={{ borderRadius: 0 }}
          placeholder="Numéro de téléphone"
          countryPickerProps={{
            countryCodes: ["CI", "CA"],
            translation: "fra",
          }}
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
          // label={"Adresse Ligne 1 *"}
          label={"Lieu de livraison (commune, quartier, rue) *"}
          theme={{ colors: { primary: colors.textPrimary } }}
          onBlur={() => formik.setFieldTouched("streetAddress1")}
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
          // label="Adresse Ligne 2"
          label={"Lieu de livraison (immeuble, appartement, autre description)"}
          theme={{ colors: { primary: colors.textPrimary } }}
          onBlur={() => formik.setFieldTouched("streetAddress2")}

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
                  data={citiesData?.getShippingZones
                    ?.filter((zone) => zone?.countries?.includes(countryCode)) 
                    ?.filter((zone) => zone !== null) as { name: string }[]}
                  keyExtractor={(item, idx) => `${item.name}-${idx}`}
                  renderItem={renderItem}
                  contentContainerStyle={styles.listContainer}
                  keyboardShouldPersistTaps="handled"
                />
              </View>,
              disableScroll:true
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
          <TouchableOpacity
              style={styles.addAddressButton}
              onPress={() => setShowForm(true)}
              activeOpacity={0.7}
            >
              <FontAwesome name="plus-circle" size={18} color={colors.primary} />
              <Text style={styles.addAddressText}>Ajouter une nouvelle adresse</Text>
            </TouchableOpacity>

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
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    paddingVertical: 10,
    paddingHorizontal: 15, 
    borderRadius: 8,
    backgroundColor: colors.backgroundLight, 
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: "center", 
  },
  addAddressText: {
    fontSize: fonts.body,
    fontWeight: "bold",
    color: colors.primary,
    marginLeft: 8,
  },
});

