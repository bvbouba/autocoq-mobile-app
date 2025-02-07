import React, { FC, useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import * as yup from "yup";
import { useFormik } from "formik";
import {Text, View , PaddedView,colors } from "@/components/Themed"

import { useCartContext } from '../../context/useCartContext';
import { useCheckoutEmailUpdateMutation } from '../../saleor/api.generated';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '@/lib/providers/authProvider';

interface Props {
    onSubmit: () => void
    onCancel: () => void
}

interface Form {
    phoneNumber: string,
}

const validationSchema = yup.object().shape({
    phoneNumber: yup.string().matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
});

const PersonalDetailsForm: FC<Props> = ({ onSubmit, onCancel }) => {
    const { cart } = useCartContext();
    const {user,authenticated} = useAuth()
    const [updateEmail] = useCheckoutEmailUpdateMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const email = user?.email || cart?.email
    const phoneNumber = user?.email.split("@")[0];

    const formik = useFormik<Form>({
        initialValues: {
            phoneNumber: phoneNumber || "",
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (data) => {
            setLoading(true);
            setError(null); // Reset error state
            try {
                const result = await updateEmail({
                    variables: {
                        id: cart?.id as string,
                        email: `${data.phoneNumber}@autocoq.com`
                    },
                });
                const errors = result.data?.checkoutEmailUpdate?.errors;
                if (errors && errors.length > 0) {
                    setError(`Error: ${errors[0].field}`);
                } else {
                    onSubmit();
                }
            } catch (err) {
                setError("Failed to update email. Please try again.");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <PaddedView>
            <TextInput
                style={styles.input}
                onChangeText={(value) => formik.setFieldValue("phoneNumber", value)}
                value={formik.values.phoneNumber}
                placeholder="Phone Number"
                label="Phone Number"
                error={!!formik.errors.phoneNumber}
            />
            {formik.errors.phoneNumber && <Text style={styles.error}>{formik.errors.phoneNumber}</Text>}

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
        </PaddedView>
    );
};

export default PersonalDetailsForm;

const styles = StyleSheet.create({
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    error: {
        color: "red",
        marginBottom: 8,
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
});
