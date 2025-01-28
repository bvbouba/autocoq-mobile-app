import React, { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { colors } from "../Themed";
import { useCartContext } from "../../context/useCartContext";
import { useCheckoutBillingAddressUpdateMutation } from "../../saleor/api.generated";
import SavedAddressSelectionList from "../address/savedAddressSelectionList";
import { useAuth } from "@/lib/authProvider";

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
  streetAddress2: yup.string().required("Required"),
  postalCode: yup.string().required("Required"),
  city: yup.string().required("Required"),
});

const BillingAddressForm: FC<Props> = ({ onSubmit, onCancel }) => {
  const { cart } = useCartContext();
  const [updateBillingAddress] = useCheckoutBillingAddressUpdateMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const {authenticated} = useAuth()

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

  const formik = useFormik<Form>({
    initialValues: {
      firstName: cart?.billingAddress?.firstName || "",
      lastName: cart?.billingAddress?.lastName || "",
      phone: cart?.billingAddress?.phone || "",
      streetAddress1: cart?.billingAddress?.streetAddress1 || "",
      streetAddress2: cart?.billingAddress?.streetAddress2 || "",
      postalCode: cart?.billingAddress?.postalCode || "",
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
    <View>
      <TextInput
        style={styles.input}
        onChangeText={(value) => formik.setFieldValue("firstName", value)}
        value={formik.values.firstName}
        placeholder="First Name"
        label="First Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => formik.setFieldValue("lastName", value)}
        value={formik.values.lastName}
        placeholder="Last Name"
        label="Last Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => formik.setFieldValue("phone", value)}
        value={formik.values.phone}
        placeholder="Phone Number"
        label="Phone Number"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => formik.setFieldValue("streetAddress1", value)}
        value={formik.values.streetAddress1}
        placeholder="Address Line 1"
        label="Address Line 1"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => formik.setFieldValue("streetAddress2", value)}
        value={formik.values.streetAddress2}
        placeholder="Address Line 2"
        label="Address Line 2"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => formik.setFieldValue("city", value)}
        value={formik.values.city}
        placeholder="City"
        label="City"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => formik.setFieldValue("postalCode", value)}
        value={formik.values.postalCode}
        placeholder="Postal Code"
        label="Postal Code"
      />
      <Button onPress={() => formik.handleSubmit()} mode="contained" disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : "Submit"}
      </Button>
      <Button onPress={onCancel} mode="text" style={styles.cancelButton}>
        Cancel
      </Button>
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
  },
  input: {
    marginBottom: 16,
    width: "100%",
  },
  cancelButton: {
    marginTop: 10,
  },
  errorContainer: {
    marginTop: 16,
    padding: 10,
    backgroundColor: colors.errorBackground,
    borderRadius: 4,
  },
  errorText: {
    color: colors.errorText,
    textAlign: "center",
  },
});
