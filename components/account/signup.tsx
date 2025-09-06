import React, { FC, useState, useRef } from 'react';
import { StyleSheet, ActivityIndicator, } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextInput } from 'react-native-paper';
import { useCreateTokenMutation, CheckPhoneNumberDocument,useSendCodeMutation, useUserRegisterMutation, useVerifyCodeMutation, useCheckPhoneNumberQuery } from '@/saleor/api.generated';
import { Text, View, PaddedView, colors, fonts } from "@/components/Themed"
import { useAuth } from '@/lib/providers/authProvider';
import { useModal } from '@/context/useModal';
import Logo from '../Logo';
import { useMessage } from '@/context/MessageContext';
import PhoneInput from "react-native-phone-number-input";
import type { CountryCode } from "react-native-country-picker-modal";
import SignIn from './signin';
import { useLazyQuery } from "@apollo/client/main.cjs";


interface Props {
    phoneNumber?: string;
    defaultCC?: CountryCode;
    fullPhoneNumber?: string;
}

interface Form {
    phone: string;
    verificationCode: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const validationSchema = yup.object().shape({
    phone: yup
        .string()
        .required("Le numéro de téléphone est requis"),
    verificationCode: yup.string().required("Le code de vérification est requis"),
    username: yup.string().required("Le nom d'utilisateur est requis"),
    password: yup
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Le mot de passe est requis"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), ''], "Les mots de passe doivent correspondre")
        .required("La confirmation du mot de passe est requise"),
});

const SignUp: FC<Props> = ({ phoneNumber, defaultCC, fullPhoneNumber }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [sendCode] = useSendCodeMutation();
    const [verifyCode] = useVerifyCodeMutation();
    const [userRegister] = useUserRegisterMutation();
    const { closeModal,openModal } = useModal()
    const [useLogin] = useCreateTokenMutation();
    const { setRefreshToken, setToken } = useAuth()
    const { showMessage } = useMessage();
    const phoneInput = useRef<PhoneInput>(null);
    const [checkPhoneExists] = useLazyQuery(CheckPhoneNumberDocument, {
        fetchPolicy: "network-only",
      });



    const formik = useFormik<Form>({
        initialValues: {
            phone: fullPhoneNumber ? String(fullPhoneNumber) : '',
            verificationCode: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (data) => {
            setLoading(true);
            setError(null);

            try {
                const { data: response, errors } = await userRegister({
                    variables: {
                        input: {
                            email: `${data.phone}@autocoq.com`,
                            password: data.password,
                            firstName: data.username,
                        },
                    },
                });

                const errorMsg = response?.accountRegister?.errors?.[0]?.message || errors?.[0]?.message || '';

                if (errorMsg) {
                    setError(errorMsg);
                } else {
                    try {
                        const { data: loginData } = await useLogin({
                            variables: {
                                email: `${data.phone}@autocoq.com`,
                                password: data.password,
                            },
                        });
                        const loginError = loginData?.tokenCreate?.errors || [];
                        if (loginError.length > 0) {
                            showMessage("La connexion a échoué. Veuillez réessayer sur la page de connexion.")
                        } else {
                            if (loginData?.tokenCreate?.token) {
                                setToken(loginData?.tokenCreate?.token);
                                setRefreshToken(loginData?.tokenCreate?.refreshToken || "");
                                closeModal("SignUp")
                            } else {
                                showMessage("Échec de l’authentification. Veuillez réessayer.")
                            }
                        }
                    } catch (err) {
                        console.error('Login error:', err);
                        showMessage("Erreur de connexion")
                    }
                }
            } catch {
                setError("L'inscription a échoué. Veuillez réessayer.");
            } finally {
                setLoading(false);
            }
        },
    });

    const handleNext = async () => {
        setError(null);
        setLoading(true);

        try {
            const formErrors = await formik.validateForm();

            if (currentStep === 1) {
                if (formErrors.phone) {
                    setError(formErrors.phone);
                    setLoading(false);
                    return;
                }
                const isValid = phoneInput.current?.isValidNumber(formik.values.phone);
                if (!isValid) {
                    setError("Le numéro de téléphone n'est pas valide.");
                    return;
                }
                try {
                    const { data } = await checkPhoneExists({
                        variables: { phoneNumber: formik.values.phone },
                      });

                    if (data?.checkPhoneExists?.exists) {
                        openModal({
                            id: "SignIn",
                            content: <SignIn fullPhoneNumber={formik.values.phone} />,
                            height: "115%",
                            closeButtonVisible: true,
                        });
                        closeModal("SignUp");
                        return;
                    }
                    console.log(data)
                    const { data: otpData, errors } = await sendCode({
                        variables: { phoneNumber: formik.values.phone },
                    });

                    const errorMsg = otpData?.sendOtp?.error || errors?.[0]?.message || "";
                    if (errorMsg) {
                        setError(errorMsg);
                    } else {
                        setCurrentStep(2);
                    }
                } catch (err) {
                    console.error("GraphQL Error:", err);
                    setError("Une erreur est survenue. Veuillez réessayer.");
                }


            } else if (currentStep === 2) {
                if (formErrors.verificationCode) {
                    setError(formErrors.verificationCode);
                    setLoading(false);
                    return;
                }
                const { data, errors } = await verifyCode({
                    variables: {
                        phoneNumber: `${formik.values.phone}`,
                        otp: formik.values.verificationCode,
                    },
                });

                const errorMsg = data?.verifyOtp?.error || errors?.[0]?.message || '';

                if (errorMsg) {
                    setError(errorMsg);
                } else {
                    setCurrentStep(3);
                }
            }
        } catch {
            setError("Une erreur s'est produite. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PaddedView>
            <Logo />
            <View style={styles.container}>
                <Text style={styles.title}>Créer un compte Autocoq</Text>
                {currentStep === 1 && (
                    <>
                        <Text style={styles.subtitle}>
                            Nous n'avons pas trouvé de compte associé à l'email que vous avez saisi.
                            Créez un nouveau compte dès aujourd'hui !
                        </Text>
                        <View style={styles.inputContainer}>

                            <PhoneInput
                                ref={phoneInput}
                                defaultValue={phoneNumber}
                                defaultCode={defaultCC}
                                layout="first"
                                onChangeFormattedText={(text) => {
                                    formik.setFieldValue('phone', text);
                                }}
                                containerStyle={styles.input}
                                textContainerStyle={{
                                    borderRadius: 5,
                                    backgroundColor: "white",
                                }}
                                countryPickerProps={{
                                    countryCodes: ["CI", "CA"],
                                    translation: "fra",
                                }}
                            />

                            <Button style={styles.button} onPress={handleNext} mode="contained" disabled={loading}>
                                {loading ? <ActivityIndicator color="white" /> : 'Continuer'}
                            </Button>
                        </View>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <Text style={styles.subtitle}>
                            Veuillez entrer le code de vérification envoyé à{' '}
                            <Text style={styles.phoneNumber}>
                                {formik.values.phone}
                            </Text>
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                onChangeText={formik.handleChange('verificationCode')}
                                value={formik.values.verificationCode}
                                placeholder="Code de vérification"
                                label="Code de vérification"
                                error={!!formik.errors.verificationCode}
                                outlineColor={colors.border}
                                underlineColor={colors.border}
                            />

                            <Button style={styles.button} onPress={handleNext} mode="contained" disabled={loading}>
                                {loading ? <ActivityIndicator color="white" /> : 'Vérifier'}
                            </Button>
                        </View>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                onChangeText={formik.handleChange('username')}
                                value={formik.values.username}
                                placeholder="Nom d'utilisateur"
                                label="Nom d'utilisateur"
                                error={!!formik.errors.username}
                                outlineColor={colors.border}
                                underlineColor={colors.border}
                            />
                            {formik.errors.username && <Text style={styles.error}>{formik.errors.username}</Text>}

                            <TextInput
                                style={styles.input}
                                onChangeText={formik.handleChange('password')}
                                value={formik.values.password}
                                placeholder="Mot de passe"
                                label="Mot de passe"
                                secureTextEntry={!showPassword}
                                error={!!formik.errors.password}
                                right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
                                outlineColor={colors.border}
                                underlineColor={colors.border}
                            />
                            {formik.errors.password && <Text style={styles.error}>{formik.errors.password}</Text>}

                            <TextInput
                                style={styles.input}
                                onChangeText={formik.handleChange('confirmPassword')}
                                value={formik.values.confirmPassword}
                                placeholder="Confirmer le mot de passe"
                                label="Confirmer le mot de passe"
                                secureTextEntry={!showPassword}
                                error={!!formik.errors.confirmPassword}
                                right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
                                outlineColor={colors.border}
                                underlineColor={colors.border}
                            />
                            {formik.errors.confirmPassword && <Text style={styles.error}>{formik.errors.confirmPassword}</Text>}

                            <Button style={styles.button} onPress={() => formik.handleSubmit()} mode="contained" disabled={loading}>
                                {loading ? <ActivityIndicator color="white" /> : "S'inscrire"}
                            </Button>
                        </View>
                    </>
                )}

                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </PaddedView>
    );
};

export default SignUp;

const styles = StyleSheet.create({

    container: {
        height: "100%",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingHorizontal: 20,
        marginTop: 5,
        backgroundColor: "white"
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "white",
        borderRadius: 5,
        marginBottom: 15,
        fontSize: fonts.h2,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 5,
        alignItems: "center",
        width: "100%",
    },
    buttonText: {
        color: "white",
        fontWeight: "400",
        fontSize: fonts.body,
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
        fontSize: fonts.body,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: fonts.body,
        color: "#666",
        marginBottom: 20,
        textAlign: "left",
    },

    phoneNumber: { fontWeight: 'bold', color: 'black' },


});
