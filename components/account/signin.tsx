import { FC, useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextInput } from 'react-native-paper';
import { useAuth } from '@/lib/providers/authProvider';
import { Text, View, PaddedView, colors, fonts } from "@/components/Themed"
import { useModal } from '@/context/useModal';
import Logo from '../Logo';
import { useCreateTokenMutation } from '@/saleor/api.generated';
import { useMessage } from '@/context/MessageContext';

interface Form {
    identifier: string;
    password: string;
}

const validationSchema = yup.object().shape({
    identifier: yup.string().required("Le numéro de téléphone est requis"),
    password: yup.string().required("Le mot de passe est requis"),
});
interface props {
    fullPhoneNumber?: string,
}

const SignIn: FC<props> = ({ fullPhoneNumber }) => {
    const [useLogin] = useCreateTokenMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);  
    const { closeModal } = useModal()
    const {setToken,setRefreshToken} = useAuth()
    const { showMessage } = useMessage();

    const formik = useFormik<Form>({
        initialValues: {
            identifier: fullPhoneNumber ? String(fullPhoneNumber) : '', // Set phone number if available
            password: '',
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (formData) => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await useLogin({
                    variables: {
                        email: `${formData.identifier}@autocoq.com`,
                        password: formData.password,
                    },
                });
                const errors = data?.tokenCreate?.errors || [];
                if (errors.length > 0) {
                    if(errors[0].field==="email"){
                        setError("Veuillez saisir des informations valides")
                    }else{
                    // setError(data?.tokenCreate?.errors[0]?.message || 'Une erreur inconnue est survenue.');
                    showMessage('Une erreur inconnue est survenue.')
                    }
                } else {
                    if (data?.tokenCreate?.token) {
                        setToken(data?.tokenCreate?.token);
                        setRefreshToken(data?.tokenCreate?.refreshToken || "");
                        closeModal("SignIn")
                    } else {
                        showMessage('Échec de l’authentification. Veuillez réessayer.')

                    }
                }
            } catch (err) {
                console.error('Login error:', err);
                showMessage("Impossible de se connecter. Veuillez réessayer.")
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <PaddedView>
            <Logo />
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
                        outlineColor={colors.border}
                        underlineColor={colors.border}
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
});
