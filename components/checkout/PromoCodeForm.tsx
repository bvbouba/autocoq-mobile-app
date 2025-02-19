import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCheckoutAddPromoCodeMutation } from "@/saleor/api.generated";
import { useCheckout } from "@/context/CheckoutProvider";
import { colors, fonts, PaddedView } from "../Themed";
import {  TextInput } from "react-native-paper";
import { useMessage } from "@/context/MessageContext";


interface props {
  setEditPromoCode: React.Dispatch<React.SetStateAction<boolean>>}

const PromoCodeForm = ({setEditPromoCode}:props) => {
  const { checkoutToken } = useCheckout();
  const [promoInput, setPromoInput] = useState(""); // Holds promo code temporarily
  const [checkoutAddPromoCodeMutation] = useCheckoutAddPromoCodeMutation();
  const [error,setError] = useState("");

  // Formik setup
  const formik = useFormik({
    initialValues: {
      promoCode: "",
    },
    validationSchema: Yup.object({
      promoCode: Yup.string().required("Code promo requis"),
    }),
    onSubmit: async (data) => {
      try {
        const { data: promoCodeData } = await checkoutAddPromoCodeMutation({
          variables: {
            promoCode: data.promoCode,
            token: checkoutToken,
          },
        });
        const errors = promoCodeData?.checkoutAddPromoCode?.errors;
        if (errors && errors?.length > 0) {
          setError("Le code n'est pas valide")
        } else {
          setEditPromoCode(false); // Hide input after successful submission
          formik.resetForm(); // Clear the promo code after successful apply
          setPromoInput(""); // Also clear the local state
        }
      } catch (error) {
        setError("Une erreur est survenue");
      }
    },
  });

  // Disable button if promoCode is empty or submission is in progress
  const isButtonDisabled = !promoInput || formik.isSubmitting;
  const buttonStyles = isButtonDisabled ? styles.buttonDisabled : styles.buttonActive;
  const buttonTextStyles = isButtonDisabled ? styles.buttonTextDisabled : styles.buttonTextActive;

  return (
    <>
    <View style={{ gap: 10 }}>
                  <Text style={{ fontSize: fonts.h1, fontWeight: "bold" }}>
                    Entrer votre code de réduction
                  </Text>
                  <Text style={{ fontSize: fonts.body }}>
                    Entrez un code valide ci-dessous.
                  </Text>

                  {/* Use local state for input instead of Formik's value */}
                  <TextInput
                    style={styles.input}
                    placeholder="Entrez votre code promo"
                    value={promoInput} // Local state
                    onChangeText={(value) => {
                      setPromoInput(value); // Update local state
                      formik.setFieldValue("promoCode", value); // Also update Formik state
                    }}
                    onBlur={formik.handleBlur("promoCode")}
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    onPress={() => formik.handleSubmit()}
                    style={[styles.submitButton, buttonStyles]}
                    disabled={isButtonDisabled}
                  >
                    {formik.isSubmitting ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={buttonTextStyles}>ACTIVER</Text>
                    )}
                  </TouchableOpacity>

                  {formik.touched.promoCode && formik.errors.promoCode && (
                    <Text style={styles.errorText}>{formik.errors.promoCode}</Text>
                  )}
                  {error && (
                    <Text style={styles.errorText}>{error}</Text>
                  )}
                </View>
    </>
  );
};


export default PromoCodeForm;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  promoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  promoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  promoText: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginLeft:5
  },
  tinyIcon: {
    width: 50,
    height: 35,
    resizeMode: "stretch",
  },
  icon: {
    marginTop: 0,
    marginRight: 5,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1, 
    borderColor: colors.textSecondary, 
    borderRadius: 4,
    paddingHorizontal: 10,
    color: "black",
  },
  submitButton: {
    marginHorizontal: 0,
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: colors.secondary,
  },
  buttonDisabled: {
    backgroundColor: colors.background,
  },
  buttonTextActive: {
    fontWeight: "bold",
    color: "white",
  },
  buttonTextDisabled: {
    fontWeight: "bold",
    color: colors.secondary,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
