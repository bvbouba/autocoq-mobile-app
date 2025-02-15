import * as React from 'react';
import { Button, RadioButton, ActivityIndicator } from 'react-native-paper';
import { fonts, PaddedView, Text } from '../components/Themed';
import { View, StyleSheet } from 'react-native';
import { usePaymentContext } from '@/context/usePaymentContext';
import { useCheckout } from '@/context/CheckoutProvider';
import { useModal } from '@/context/useModal';

const PaymentMethods = () => {
    const { checkout } = useCheckout();
    const { setChosenGateway } = usePaymentContext();
    const { closeModal } = useModal();

    const paymentMethods = checkout && checkout.availablePaymentGateways;
    const firstMethod = paymentMethods && paymentMethods.length > 0 ? paymentMethods[0].id : undefined;

    const [checked, setChecked] = React.useState(firstMethod || "");
    const [loading, setLoading] = React.useState(false); 

    const updatePaymentMethod = async () => {
        if (checked) {
            setLoading(true); 
            setChosenGateway(checked); 
            closeModal();
            setLoading(false); 
        }
    };

    return (
        <PaddedView>
            <Text style={styles.title}>Méthode de paiement</Text>
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
                style={styles.submitButton}
                labelStyle={styles.submitButtonText}
            >
                {loading ? <ActivityIndicator color="white" /> : "APPLIQUER"}
            </Button>
        </PaddedView>
    );
};

export default PaymentMethods;

const styles = StyleSheet.create({
    title: {
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 12,
        fontSize: fonts.h1,
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
    submitButton: {
        backgroundColor: "black",
        marginHorizontal: 10,
        borderRadius: 5,
        padding: 5
    },
    submitButtonText: {
        fontWeight: "bold",
        color: "white",
    },
});
