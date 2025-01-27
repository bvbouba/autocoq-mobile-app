import  { FC, useState } from 'react';
import { StyleSheet, ActivityIndicator, Text, View } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextInput } from 'react-native-paper';
import { PaddedView } from '../Themed'; // Assuming PaddedView is used for padding in your app
import { useRouter } from 'expo-router';
import { useCreateTokenMutation } from '@/saleor/api.generated';
import { useAuth } from '@/lib/authProvider';

interface Props {
    onSubmit: () => void;
}

interface Form {
    identifier: string;
    password: string;
}

const validationSchema = yup.object().shape({
    identifier: yup.string().required("Username or phone number is required"),
    password: yup.string().required("Password is required"),
});

const LoginForm: FC<Props> = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [login] = useCreateTokenMutation()
    const { setToken } = useAuth();

    const formik = useFormik<Form>({
        initialValues: {
            identifier: '',
            password: '',
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (formData) => {
            setLoading(true);
            setError(null);
            try {
                const {data} = await login({
                    variables:{
                    email: `${formData.identifier}@autocoq.com`,
                    password: formData.password,
                    }
                });
                const errors = data?.tokenCreate?.errors || []
                if (errors.length>0) {
                    setError(data?.tokenCreate?.errors[0]?.message || 'Unknown error occurred.');
                } else {
                    const  token  = data?.tokenCreate?.token;
                    if (token) {
                        setToken(token);
                        router.push('/account');
                    } else {
                        setError('Failed to retrieve token. Please try again.');
                    }
                }
            } catch (err) {
                console.error('Login error:', err);
                setError('Failed to login. Please try again.');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <PaddedView>
            <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('identifier')}
                value={formik.values.identifier}
                placeholder="Phone Number"
                label="Phone Number"
                error={!!formik.errors.identifier}
            />
            {formik.errors.identifier && <Text style={styles.error}>{formik.errors.identifier}</Text>}

            <TextInput
                style={styles.input}
                onChangeText={formik.handleChange('password')}
                value={formik.values.password}
                placeholder="Password"
                label="Password"
                error={!!formik.errors.password}
                secureTextEntry={!showPassword}
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
                onPress={()=>formik.handleSubmit()}
                mode="contained"
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : 'Login'}
            </Button>



            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
                        </View>
        </PaddedView>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    container:{
       paddingTop:30
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        marginBottom:20
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
