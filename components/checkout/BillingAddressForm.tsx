import React, { FC, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as yup from "yup";
import { useFormik } from "formik";
import { useCartContext } from '../../context/useCartContext';
import { useCheckoutBillingAddressUpdateMutation } from '../../saleor/api.generated';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { colors } from '../Themed';

interface Props {
    onSubmit: () => void
    onCancel: () => void
}

interface Form {
    firstName: string,
    lastName: string,
    phone: string,
    streetAddress1: string,
    streetAddress2: string,
    postalCode: string,
    city: string,
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

    const formik = useFormik<Form>({
        initialValues: {
            firstName: cart?.billingAddress?.firstName || "Test",
            lastName: cart?.billingAddress?.lastName || "Testington",
            phone: cart?.billingAddress?.phone || "07123456789",
            streetAddress1: cart?.billingAddress?.streetAddress1 || "1 Grove Gardens",
            streetAddress2: cart?.billingAddress?.streetAddress2 || "TETBURY",
            postalCode: cart?.billingAddress?.postalCode || "GL8 8AU",
            city: cart?.billingAddress?.city || "TETBURY",
        },
        validationSchema: validationSchema,

        onSubmit: async (data) => {
            setLoading(true);
            setError(null); // Reset error message
            try {
                const result = await updateBillingAddress({
                    variables: {
                        id: cart?.id as string,
                        billingAddress: {
                            streetAddress1: data.streetAddress1,
                            streetAddress2: data.streetAddress2,
                            country: "CI",
                            firstName: data.firstName,
                            lastName: data.lastName,
                            postalCode: data.postalCode,
                            phone: data.phone,
                            city: data.city,
                        },
                    },
                });
                const errors = result.data?.checkoutBillingAddressUpdate?.errors;
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

    return (
        <ScrollView style={styles.container}>
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
                placeholder="Post Code"
                label="Post Code"
            />

             <Button
                    onPress={() => formik.handleSubmit()}
                    mode="contained"
                    disabled={loading}
                >
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
