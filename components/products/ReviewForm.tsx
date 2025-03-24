import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, 
   ActivityIndicator 
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ProductFragment, useCreateReviewMutation } from "@/saleor/api.generated";
import { colors, Divider, fonts } from "../Themed";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useModal } from "@/context/useModal";

// Schéma de validation avec Yup
const ReviewSchema = Yup.object().shape({
  rating: Yup.number().min(1, "La note est requise").required("La note est requise"),
  content: Yup.string().min(10, "L'avis doit contenir au moins 10 caractères").required("L'avis est requis"),
  firstname: Yup.string().min(2, "Le prénom doit contenir au moins 2 caractères").required("Le prénom est requis"),
  contact: Yup.string()
    .matches(/^\d{10}$/, "Le contact doit être un numéro de téléphone valide (10 chiffres).")
    .required("Contact requis"),
  car: Yup.string().min(2, "Le modèle de voiture est requis").required("Le modèle de voiture est requis"),
});

const ReviewForm = ({ product, refetchReviews }: { product: ProductFragment; refetchReviews: () => void }) => {
  const images = product?.media || [];  
  const [createReview] = useCreateReviewMutation();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {closeModal} = useModal()

  if (isSubmitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successMessage}>Votre avis a été soumis avec succès !</Text>
        <Text style={styles.infoMessage}>
          Il sera examiné avant d’être approuvé et publié.
        </Text>
        <TouchableOpacity 
          style={styles.returnButton}
          onPress={() => closeModal("Review")}
        >
          <Text style={styles.returnButtonText}>Retourner à la page du produit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Formik
      initialValues={{
        rating: 0,
        content: "",
        firstname: "",
        contact: "",
        car: "",
      }}
      validationSchema={ReviewSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setLoading(true);
          const { data } = await createReview({
            variables: {
              product: product.id,
              rating: values.rating,
              content: values.content,
              contact: values.contact,
              firstname: values.firstname,
              car: values.car,
            },
          });

          if (data?.reviewCreate?.errors && data?.reviewCreate?.errors?.length > 0) {
            alert("Échec de l'envoi de l'avis. Veuillez réessayer.");
          } else {
            setIsSubmitted(true); // Show success message
            refetchReviews();
          }
        } catch (error) {
          alert("Une erreur est survenue. Veuillez réessayer.");
        } finally {
          setLoading(false);
        }
        setSubmitting(false);
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue, isSubmitting, errors, touched }) => {
        const isFormValid =
          values.rating > 0 &&
          values.content.length >= 10 &&
          values.firstname.length >= 2 &&
          values.contact.length > 0 &&
          values.car.length >= 2;

        return (
          <View style={styles.container}>
            <KeyboardAwareScrollView
              contentContainerStyle={{ flexGrow: 1, padding: 0 }}
              extraScrollHeight={50} 
              enableOnAndroid={true}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.sectionContainer}>
                <Text style={styles.title}>Rédiger un avis</Text>
                <View style={styles.productContainer}>
                  <Image source={{ uri: images[0]?.url }} style={styles.productImage} />
                  <Text style={styles.productName}>{product.name}</Text>
                </View>
              </View>

              <Divider style={{ borderBottomWidth: 10 }} />

              {/* Section de notation */}
              <View style={styles.sectionContainer}> 
                <Text style={styles.label}>Note globale <Text style={{ color: "red" }}>*</Text></Text>
                <View style={styles.starContainer}>
                  {[...Array(5)].map((_, index) => (
                    <TouchableOpacity key={index} onPress={() => setFieldValue("rating", index + 1)}>
                      <FontAwesome
                        name={index < values.rating ? "star" : "star-o"}
                        size={30}
                        color={index < values.rating ? colors.primary : colors.border}
                        style={{ marginRight: 5 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.rating && errors.rating && <Text style={styles.errorText}>{errors.rating}</Text>}
              </View>

              {/* Champ de texte pour l'avis */}
              <View style={styles.sectionContainer}>
                <Text style={styles.label}>Votre avis <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Écrivez votre avis ici..."
                  multiline
                  numberOfLines={4}
                  value={values.content}
                  onChangeText={handleChange("content")}
                />
                {touched.content && errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
              </View>

              <Divider style={{ borderBottomWidth: 10 }} />

              {/* Prénom */}
              <View style={styles.sectionContainer}>
                <Text style={styles.label}>Votre prénom <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Entrez votre prénom"
                  value={values.firstname}
                  onChangeText={handleChange("firstname")}
                />
                {touched.firstname && errors.firstname && <Text style={styles.errorText}>{errors.firstname}</Text>}
              </View>

              {/* Contact */}
              <View style={styles.sectionContainer}>
                <Text style={styles.label}>Votre contact <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Numéro de téléphone"
                  value={values.contact}
                  onChangeText={handleChange("contact")}
                  keyboardType="numeric"
                />
                {touched.contact && errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}
              </View>

              {/* Modèle de voiture */}
              <View style={styles.sectionContainer}>
                <Text style={styles.label}>Quel est votre véhicule ? <Text style={{ color: "red" }}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Entrez le modèle de voiture"
                  value={values.car}
                  onChangeText={handleChange("car")}
                />
                {touched.car && errors.car && <Text style={styles.errorText}>{errors.car}</Text>}
              </View>

            </KeyboardAwareScrollView>

            {/* Bouton de soumission */}
            <View style={styles.sectionContainer}>
              <TouchableOpacity
                style={[styles.submitButton, (!isFormValid || isSubmitting) && styles.disabledButton]}
                disabled={!isFormValid || isSubmitting}
                onPress={() => handleSubmit()}
                activeOpacity={0.7}
              >
                  {isSubmitting ? <ActivityIndicator color="white" /> : 
                  <Text style={styles.submitButtonText}>SOUMETTRE L'AVIS</Text>}
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    </Formik>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    paddingBottom: 50,
  },
  sectionContainer: {
    padding: 15,
  },
  title: {
    fontSize: fonts.h1,
    fontWeight: "bold",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  productName: {
    fontSize: fonts.body,
    flexShrink: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: colors.background,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  successContainer: {
    padding: 20,
    alignItems: "center",
  },
  successMessage: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  returnButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
  },
  returnButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ReviewForm;
