import { colors } from "@/components/Themed";
import { useCartContext } from "@/context/useCartContext";
import { usePaymentContext } from "@/context/usePaymentContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, View,StyleSheet,Text } from "react-native";
import { Button } from "react-native-paper";

export const codGatewayId = "cash.on.delivery"
const CodPayment = () => {
    const { cart } = useCartContext();
    const { startCheckout,convertCartToOrder,confirmationData,error,loading } = usePaymentContext();
    const router = useRouter();

    useEffect(() => {
        if (confirmationData) {
            initializePaymentSheet().then(() => openPaymentSheet())
        }
    }, [confirmationData])

    const initializePaymentSheet = async () => {
        if (!confirmationData || !cart) {
            return
        }
        return true
    };

    const openPaymentSheet = async () => {
        Alert.alert('Success', 'Your order is confirmed!');
        convertCartToOrder().then((result) => router.push("orderDetails/" + result.orderId + "?orderSuccess=true"))
    };

    const buyNow = () => {
        if (confirmationData) {
            openPaymentSheet()
        } else {
            startCheckout()
        }
    }

    return (
        <>
        <Button
                    onPress={buyNow}
                    mode="contained"
                    disabled={loading}
                >
                    {(loading) ? <ActivityIndicator color="white" /> : "Buy Now"}
                </Button>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error.message}</Text>
                    </View>
                )}


        </>
    );
};


const styles = StyleSheet.create({
   
    error: {
        color: "red",
        marginBottom: 8,
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


export default CodPayment;
