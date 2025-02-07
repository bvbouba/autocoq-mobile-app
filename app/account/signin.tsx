import { FC, useState } from 'react';
import { StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextInput } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/lib/providers/authProvider';
import { colors, PaddedView } from '@/components/Themed';

interface Form {
    identifier: string;
    password: string;
}

const validationSchema = yup.object().shape({
    identifier: yup.string().required("Le numéro de téléphone est requis"),
    password: yup.string().required("Le mot de passe est requis"),
});

const SignIn: FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { phone,redirectUrl } = useLocalSearchParams(); // Extract phone number from URL
    const { login,error,loading } = useAuth();

    const formik = useFormik<Form>({
        initialValues: {
            identifier: phone ? String(phone) : '', // Set phone number if available
            password: '',
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (formData) => {
            try {
                await login({
                    email: `${formData.identifier}@autocoq.com`,
                    password: formData.password,
                });
        
                if (!error) {
                    const redirect = Array.isArray(redirectUrl) ? redirectUrl[0] : redirectUrl;
                    if (redirect) {
                        router.push(redirect);
                    }
                }
            } catch (err) {
                console.error('Login error:', err);
            }
        },
    });

    return (
        <PaddedView>
            <View style={styles.container}>
                {/* <TextInput
                    style={styles.input}
                    onChangeText={formik.handleChange('identifier')}
                    value={formik.values.identifier}
                    placeholder="Numéro de téléphone"
                    label="Numéro de téléphone"
                    error={!!formik.errors.identifier}
                    keyboardType="phone-pad"
                />
                {formik.errors.identifier && <Text style={styles.error}>{formik.errors.identifier}</Text>} */}
      <Text style={styles.subtitle}>
        Entrez votre mot de passe
      </Text>
      <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={formik.handleChange('password')}
                    value={formik.values.password}
                    placeholder="Mot de passe"
                    label="Mot de passe"
                    error={!!formik.errors.password}
                    secureTextEntry={!showPassword}
                    outlineColor={colors.gray}
                    underlineColor={colors.gray}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? 'eye-off' : 'eye'}
                            onPress={() => setShowPassword((prev) => !prev)}
                        />
                    }
                />
                {formik.errors.password && <Text style={styles.error}>{formik.errors.password}</Text>}

                <Button
                    style={styles.button}
                    onPress={() => formik.handleSubmit()}
                    mode="contained"
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>{'Connexion'}</Text>}
                </Button>

                {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            </View>
        </PaddedView>
    );
};

export default SignIn;

const styles = StyleSheet.create({
    container: {
    height:"100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginTop:5,
    backgroundColor:"white"
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor:"white",
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
      },
    button: {
        backgroundColor: colors.back,
        borderRadius: 5,
        alignItems: "center",
        width: "100%",
      },
      buttonText: {
        color: "white",
        fontWeight: "400",
        fontSize: 13,
      },
    error: {
        color: 'red',
        marginBottom: 8,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    inputContainer: {
        alignItems: "center",
        width: "100%",
      },
      title: {
        fontSize:15,
        fontWeight: "bold",
        marginBottom: 10,
      },
      subtitle: {
        fontSize: 13,
        color: "#666",
        marginBottom: 20,
        textAlign: "left",
      },
});
