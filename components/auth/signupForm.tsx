import React, { FC, useState } from 'react';
import { StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextInput } from 'react-native-paper'; // Added IconButton for toggle
import { PaddedView } from '../Themed';
import { useSendCodeMutation, useUserRegisterMutation, useVerifyCodeMutation } from '@/saleor/api.generated';
import { useRouter } from 'expo-router';

interface Props {
    onSubmit: () => void;
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
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    verificationCode: yup.string().required('Verification code is required'),
    username: yup.string().required('Username is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), ''], 'Passwords must match')
        .required('Confirm password is required'),
});

const SignUpForm: FC<Props> = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [sendCode] = useSendCodeMutation();
    const [verifyCode] = useVerifyCodeMutation();
	const [userRegister] = useUserRegisterMutation();
    const route = useRouter()

    const formik = useFormik<Form>({
        initialValues: {
            phone: '',
            verificationCode: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
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
        
                const errorsMsg = response?.accountRegister?.errors[0]?.message || '';
                if (errors || errorsMsg) {
                    setError(errors?.[0]?.message || errorsMsg);
                } else {
                    

                    route.push('/account'); 
                }
            } catch (err) {
                setError('Failed to sign up. Please try again.');
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
                    return;
                }
                const { data, errors } = await sendCode({
                    variables: {
                        phoneNumber: `+225${formik.values.phone}`,
                    },
                });
                const errorMsg = data?.sendOtp?.error || '';
                if (errors || errorMsg) {
                    setError(errors?.[0]?.message || errorMsg);
                } else {
                    setCurrentStep(2);
                }
            } else if (currentStep === 2) {
                if (formErrors.verificationCode) {
                    setError(formErrors.verificationCode);
                    return;
                }
                const { data, errors } = await verifyCode({
                    variables: {
                        phoneNumber: `+225${formik.values.phone}`,
                        otp: formik.values.verificationCode,
                    },
                });
                const errorMsg = data?.verifyOtp?.error || '';
                if (errors || errorMsg) {
                    setError(errors?.[0]?.message || errorMsg);
                } else {
                    setCurrentStep(3);
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <PaddedView>
            <View style={styles.container}>
                {currentStep === 1 && (
                    <View>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('phone')}
                            value={formik.values.phone}
                            placeholder="Phone Number"
                            label="Phone Number"
                            keyboardType="phone-pad"
                            error={!!formik.errors.phone}
                        />
                        {/* {formik.errors.phone && <Text style={styles.error}>{formik.errors.phone}</Text>} */}

                        <Button style={styles.button} onPress={handleNext} mode="contained" disabled={loading}>
                            {loading ? <ActivityIndicator color="white" /> : 'Continue'}
                        </Button>
                    </View>
                )}

                {currentStep === 2 && (
                    <View>
                        <Text>
                            Please enter the verification code sent to{' '}
                            <Text style={styles.phoneNumber}>
                                +225{formik.values.phone.slice(0, 8).replace(/\d/g, '*')}{formik.values.phone.slice(8)}
                            </Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('verificationCode')}
                            value={formik.values.verificationCode}
                            placeholder="Verification Code"
                            label="Verification Code"
                            error={!!formik.errors.verificationCode}
                        />
                        {/* {formik.errors.verificationCode && (
                            <Text style={styles.error}>{formik.errors.verificationCode}</Text>
                        )} */}

                        <Button style={styles.button} onPress={handleNext} mode="contained" disabled={loading}>
                            {loading ? <ActivityIndicator color="white" /> : 'Verify'}
                        </Button>
                    </View>
                )}

                {currentStep === 3 && (
                    <View>
                        <TextInput
                            style={styles.input}
                            onChangeText={formik.handleChange('username')}
                            value={formik.values.username}
                            placeholder="Username"
                            label="Username"
                            error={formik.touched.username && !!formik.errors.username}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <Text style={styles.error}>{formik.errors.username}</Text>
                        )}

                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                onChangeText={formik.handleChange('password')}
                                value={formik.values.password}
                                placeholder="Password"
                                label="Password"
                                secureTextEntry={!showPassword}
                                error={formik.touched.password && !!formik.errors.password}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? 'eye-off' : 'eye'}
                                        onPress={() => setShowPassword((prev) => !prev)}
                                    />
                                }
                            />
                        </View>
                        {formik.touched.password && formik.errors.password && (
                            <Text style={styles.error}>{formik.errors.password}</Text>
                        )}

                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                onChangeText={formik.handleChange('confirmPassword')}
                                value={formik.values.confirmPassword}
                                placeholder="Confirm Password"
                                label="Confirm Password"
                                secureTextEntry={!showPassword}
                                error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? 'eye-off' : 'eye'}
                                        onPress={() => setShowPassword((prev) => !prev)}
                                    />
                                }
                            />
                        </View>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <Text style={styles.error}>{formik.errors.confirmPassword}</Text>
                        )}

                        <Button style={styles.button} onPress={() => formik.handleSubmit()} mode="contained" disabled={loading}>
                            {loading ? <ActivityIndicator color="white" /> : 'Sign Up'}
                        </Button>
                    </View>
                )}

                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </PaddedView>
    );
};

export default SignUpForm;

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
    },
    input: {
        marginBottom: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    passwordInput: {
        flex: 1,
    },
    phoneNumber: {
        fontWeight: 'bold',
        color: 'black',
    },
    button: {
        marginTop: 8,
        marginBottom: 20
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
});
