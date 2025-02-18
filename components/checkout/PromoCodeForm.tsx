import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCheckoutAddPromoCodeMutation } from "@/saleor/api.generated";
import { useCheckout } from "@/context/CheckoutProvider";
import { colors, fonts, PaddedView } from "../Themed";
import { useModal } from "@/context/useModal";
import { IconButton } from "react-native-paper";
import { useMessage } from "@/context/MessageContext";

const promoImage = require("../../assets/images/PromoCard.png");

const PromoCodeForm = () => {
  const { checkout, checkoutToken } = useCheckout();
  const [editPromoCode, setEditPromoCode] = useState(false);
  const [checkoutAddPromoCodeMutation] = useCheckoutAddPromoCodeMutation();
  const { openModal } = useModal();
const {showMessage} = useMessage()
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
          console.log({ promoCode: errors[0].message || "Erreur" });
          showMessage("Erreur")
        } else {
          setEditPromoCode(false); // Hide input after successful submission
        }
      } catch (error) {
        showMessage("Une erreur est survenue")

      }
    },
  });

  // Determine button styles dynamically
  const isButtonDisabled = !formik.values.promoCode || formik.isSubmitting;
  const buttonStyles = isButtonDisabled ? styles.buttonDisabled : styles.buttonActive;
  const buttonTextStyles = isButtonDisabled ? styles.buttonTextDisabled : styles.buttonTextActive;

  return (
    <>
      {(editPromoCode || !checkout?.discount?.amount) && (
        <PaddedView>
          <TouchableOpacity
            style={styles.promoContainer}
            onPress={() =>
              openModal(
                "checkout",
                <View style={{ gap: 10 }}>
                  <Text style={{ fontSize: fonts.h1, fontWeight: "bold" }}>
                    Entrer votre code de réduction
                  </Text>
                  <Text style={{ fontSize: fonts.body }}>
                    Entrez un code valide ci-dessous.
                  </Text>

                  <TextInput
                        style={styles.input}
                        placeholder="Entrez votre code promo"
                        value={formik.values.promoCode}
                        onChangeText={(value) => formik.setFieldValue("promoCode", value)}
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
                </View>
              )
            }
          >
            <View style={styles.promoContent}>
              <Image source={promoImage} style={styles.tinyIcon} resizeMode="contain" />
              <Text style={styles.promoText}>Code de réduction</Text>
            </View>
            <IconButton icon="chevron-right" style={styles.icon} />
          </TouchableOpacity>
        </PaddedView>
      )}
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
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: fonts.caption,
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
