import React, { FC, useState } from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import * as yup from "yup";
import { useFormik } from "formik";
import { PaddedView, colors } from '../Themed';
import { useCartContext } from '../../context/useCartContext';
import { useCheckoutEmailUpdateMutation } from '../../saleor/api.generated';
import { TextInput, Button } from 'react-native-paper';

interface Props {
    onSubmit: () => void
    onCancel: () => void
}

interface Form {
    email: string,
}

const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
});

const PersonalDetailsForm: FC<Props> = ({ onSubmit, onCancel }) => {
    const { cart } = useCartContext();
    const [updateEmail] = useCheckoutEmailUpdateMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik<Form>({
        initialValues: {
            email: cart?.email || "",
        },
        validationSchema: validationSchema,

        onSubmit: async (data) => {
            setLoading(true);
            setError(null); // Reset error state
            try {
                const result = await updateEmail({
                    variables: {
                        id: cart?.id as string,
                        email: data.email
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
                onChangeText={(value) => formik.setFieldValue("email", value)}
                value={formik.values.email}
                placeholder="Email"
                label="Email"
                error={!!formik.errors.email}
            />
            {formik.errors.email && <Text style={styles.error}>{formik.errors.email}</Text>}

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
        backgroundColor: colors.errorBackground,
        borderRadius: 4,
    },
    errorText: {
        color: colors.errorText,
        textAlign: "center",
    },
});
