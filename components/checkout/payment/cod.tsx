import { colors } from "@/components/Themed";
import { useCheckout } from "@/context/CheckoutProvider";
import { usePaymentContext } from "@/context/usePaymentContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, View,StyleSheet,Text } from "react-native";
import { Button } from "react-native-paper";

export const codGatewayId = "cash.on.delivery"
const CodPayment = () => {
    const { checkout } = useCheckout();
    const { startCheckout,convertCartToOrder,confirmationData,error,loading } = usePaymentContext();
    const router = useRouter();

    useEffect(() => {
        if (confirmationData) {
            initializePaymentSheet().then(() => openPaymentSheet())
        }
    }, [confirmationData])

    const initializePaymentSheet = async () => {
        if (!confirmationData || !checkout) {
            return
        }
        return true
    };

    const openPaymentSheet = async () => {
        Alert.alert('Success', 'Votre commande est confirmée!');
        convertCartToOrder().then((result) => router.push(`/orderDetails/${result.orderId}?orderSuccess=true`))
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
        <View>
        <Button
                    onPress={buyNow}
                    mode="contained"
                    style={styles.submitButton}
                    labelStyle={styles.submitButtonText}
                >
                    {(loading) ? <ActivityIndicator color="white" /> : "Commander et payer après la livraison"}
                </Button>
                </View>

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
        backgroundColor: colors.errorBg,
        borderRadius: 4,
    },
    errorText: {
        color: colors.error,
        textAlign: "center",
    },
    submitButton: {
        backgroundColor: "#daa520",
        marginHorizontal: 10,
        borderRadius:5,
        padding:5
      },
      submitButtonText: {
        fontWeight:"bold",
        color: "black", 
      },
});


export default CodPayment;
