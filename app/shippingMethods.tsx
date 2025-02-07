import * as React from 'react';
import { Button, RadioButton, ActivityIndicator } from 'react-native-paper';
import { PaddedView, Text } from '../components/Themed';
import { getConfig } from '../config';
import { useCartContext } from '../context/useCartContext';
import { useCheckoutShippingMethodUpdateMutation } from '../saleor/api.generated';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';

const ShippingMethods = () => {
    const { cart, refreshCart } = useCartContext();
    const [shippingAddressUpdate] = useCheckoutShippingMethodUpdateMutation();
    const router = useRouter();

    const shippingMethods = cart && cart.shippingMethods;
    const firstMethod = shippingMethods && shippingMethods?.length > 0 ? shippingMethods[0].id : undefined;

    const [checked, setChecked] = React.useState(firstMethod || "");
    const [loading, setLoading] = React.useState(false); // State to manage loading

    const updateShippingMethod = async () => {
        setLoading(true); // Start loading
        try {
            const res = await shippingAddressUpdate({
                variables: {
                    id: cart?.id as string,
                    shippingMethodId: checked,
                },
            });
            await refreshCart();
            router.back();
        } catch (error) {
            console.error("Error updating shipping method:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <PaddedView>
            <Text style={styles.title}>Choose shipping method</Text>
            {shippingMethods?.map((method) => {
                const price = method.price.amount.toLocaleString(getConfig().locale, {
                    style: "currency",
                    currency: method.price.currency,
                });
                return (
                    <View key={method.id} style={styles.radioContainer}>
                        <RadioButton
                            value={method.id}
                            status={checked === method.id ? "checked" : "unchecked"}
                            onPress={() => setChecked(method.id)}
                        />
                        <View style={styles.labelContainer}>
                            <Text style={styles.methodName}>{method.name}</Text>
                            <Text style={styles.methodPrice}>{price}</Text>
                        </View>
                    </View>
                );
            })}

            <Button
                onPress={() => updateShippingMethod()}
                mode="contained"
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : "Submit"}
            </Button>
        </PaddedView>
    );
};

export default ShippingMethods;

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
