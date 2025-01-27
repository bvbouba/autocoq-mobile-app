import * as React from 'react';
import { Button, RadioButton, ActivityIndicator } from 'react-native-paper';
import { PaddedView, Text } from '../components/Themed';
import { useCartContext } from '../context/useCartContext';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { usePaymentContext } from '@/context/usePaymentContext';

const paymentMethods = () => {
    const { cart, refreshCart } = useCartContext();
    const { setChosenGateway } = usePaymentContext();
    const router = useRouter();

    const paymentMethods = cart && cart.availablePaymentGateways;
    const firstMethod = paymentMethods && paymentMethods.length > 0 ? paymentMethods[0].id : undefined;

    const [checked, setChecked] = React.useState(firstMethod || "");
    const [loading, setLoading] = React.useState(false); 

    const updatePaymentMethod = async () => {
        if (checked) {
            setLoading(true); 
            setChosenGateway(checked); 
            await refreshCart();
            router.back(); 
            setLoading(false); 
        }
    };

    return (
        <PaddedView>
            <Text style={styles.title}>Choose Payment method</Text>
            {paymentMethods?.map((method) => {
                return (
                    <View key={method.id} style={styles.radioContainer}>
                        <RadioButton
                            value={method.id}
                            status={checked === method.id ? "checked" : "unchecked"}
                            onPress={() => setChecked(method.id)}
                        />
                        <View style={styles.labelContainer}>
                            <Text style={styles.methodName}>{method.name}</Text>
                        </View>
                    </View>
                );
            })}

            <Button
                onPress={updatePaymentMethod}
                mode="contained"
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : "Submit"}
            </Button>
        </PaddedView>
    );
};


export default paymentMethods;

const styles = StyleSheet.create({
    title: {
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 12,
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    labelContainer: {
        marginLeft: 8,
    },
    methodName: {
        fontWeight: "bold",
    },
    methodPrice: {
        color: "gray",
    },
});
