import React, { FC, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useCartContext } from "@/context/useCartContext";
import { useCheckoutBillingAddressUpdateMutation, useCheckoutEmailUpdateMutation, useGetCitiesQuery } from "@/saleor/api.generated";
import SavedAddressSelectionList from "../address/savedAddressSelectionList";
import { useAuth } from "@/lib/providers/authProvider";
import {Text, View ,colors, fonts } from "@/components/Themed"
import { useModal } from "@/context/useModal";


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
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  phone: yup.string().required("Required"),
  streetAddress1: yup.string().required("Required"),
  streetAddress2: yup.string(),
  postalCode: yup.string().required("Required"),
  city: yup.string().required("Required"),
});

const BillingAddressForm: FC<Props> = ({ onSubmit }) => {
  const { cart } = useCartContext();
  const [updateBillingAddress] = useCheckoutBillingAddressUpdateMutation();
  const [updateEmail] = useCheckoutEmailUpdateMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const {authenticated,user} = useAuth()
  const {openModal, closeModal} = useModal()
  const { data:citiesData,  } = useGetCitiesQuery();

  const renderItem = ({ item }: { item: { name: string } }) => (
    <TouchableOpacity
      style={styles.zoneItem}
      onPress={() =>{ 
        formik.setFieldValue("city", item.name)
       closeModal()
      }  
      }
    >
      <Text style={styles.zoneText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const updateMutation = async (formData: Form) => {
    const { data } = await updateBillingAddress({
      variables: {
        id: cart?.id as string,
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
    return data?.checkoutBillingAddressUpdate?.errors
  };
  const phoneNumber = cart?.email?.split('@')[0]

  const formik = useFormik<Form>({
    initialValues: {
      firstName: cart?.billingAddress?.firstName || "",
      lastName: cart?.billingAddress?.lastName || "",
      phone: cart?.billingAddress?.phone || phoneNumber ||"",
      streetAddress1: cart?.billingAddress?.streetAddress1 || "",
      streetAddress2: cart?.billingAddress?.streetAddress2 || "",
      postalCode: cart?.billingAddress?.postalCode || "225",
      city: cart?.billingAddress?.city || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      setLoading(true);
      setError(null);
      try {
        const errors = await updateMutation(data)
        if (errors && errors.length > 0) {
          setError(`Error: ${errors[0].field}`);
        } else {
          if(!cart?.email) {
            const phoneNumber = user?.email.split("@")[0] || data.phone;
            const result = await updateEmail({
              variables: {
                  id: cart?.id as string,
                  email: `${phoneNumber}@autocoq.com`
              },
          });
          const emailErrors = result.data?.checkoutEmailUpdate?.errors;
           
          if(emailErrors && emailErrors?.length>0) {
            setError(`Error update email address`)
            return;
          }
         }
          onSubmit();
        }
      } catch (e) {
        setError("Failed to save billing address. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const renderForm = () => (
    <View style={styles.formContainer}>
      {/* First Name */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("firstName", value)}
          value={formik.values.firstName}
          placeholder="First Name"
          label={`First Name *`}
          theme={{ colors: { primary: "black" } }}
        />
      </View>
  
      {/* Last Name */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("lastName", value)}
          value={formik.values.lastName}
          placeholder="Last Name"
          label={"Last Name *"}
          theme={{ colors: { primary: "black" } }}
        />
        
      </View>
  
      {/* Phone */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("phone", value)}
          value={formik.values.phone}
          placeholder="Phone Number"
          label={"Phone Number *"}
          theme={{ colors: { primary: "black" } }}
        />
        
      </View>
  
      {/* Address Line 1 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("streetAddress1", value)}
          value={formik.values.streetAddress1}
          placeholder="Address Line 1"
          label={"Address Line 1 *"}
          theme={{ colors: { primary: "black" } }}
        />
        
      </View>
  
      {/* Address Line 2 (Optional) */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("streetAddress2", value)}
          value={formik.values.streetAddress2}
          placeholder="Address Line 2"
          label="Address Line 2"
          theme={{ colors: { primary: "black" } }}
        />
      </View>
  
      {/* City */}
      <View style={styles.inputContainer}>
      <TouchableOpacity
      style={{
        width:"100%"
      }} 
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
          
          // onChangeText={(value) => formik.setFieldValue("city", value)}
          value={formik.values.city}
          placeholder="City"
          label={"City *"}
          theme={{ colors: { primary: "black" } }}
          editable={false} 
        />
      </TouchableOpacity>
        
      </View>
  
      {/* Postal Code */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(value) => formik.setFieldValue("postalCode", value)}
          value={formik.values.postalCode}
          placeholder="Postal Code"
          label="Postal Code"
          theme={{ colors: { primary: "black" } }}
        />
        
      </View>
  
      {/* Submit Button */}
      <Button
        onPress={() => formik.handleSubmit()}
        mode="contained"
        disabled={loading}
        style={styles.submitButton}
        labelStyle={styles.submitButtonText}
      >
        {loading ? <ActivityIndicator color="white" /> : "CONTINUE"}
      </Button>
  
      {/* Error Message */}
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
            updateAddressMutation={(address: Form)  => updateMutation(address)}
            onSubmit= {onSubmit}
          />
          <Button mode="text" onPress={() => setShowForm(true)}>
            + Add New Address
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