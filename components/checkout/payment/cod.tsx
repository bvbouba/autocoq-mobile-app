import { colors } from "@/components/Themed";
import { handleErrors } from "@/context/checkout";
import { useCartContext } from "@/context/useCartContext";
import { usePaymentContext } from "@/context/usePaymentContext";
import { useCheckoutCompleteMutation, useCheckoutPaymentCreateMutation } from "@/saleor/api.generated";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, View,StyleSheet,Text } from "react-native";
import { Button } from "react-native-paper";

export const codGatewayId = "cash.on.delivery"
const CodPayment = () => {
    const { cart } = useCartContext();
    const { chosenGateway,onCheckoutComplete,error } = usePaymentContext();
    const router = useRouter();
    const [createPayment] = useCheckoutPaymentCreateMutation();
    const [completeCheckout,createPaymentStatus] = useCheckoutCompleteMutation();
    const [loading,setLoading]=useState(false)

    const buyNow = async () => {    
        setLoading(true)
        try {
            const createPaymentResult = await createPayment({
                variables: {
                    checkoutId: cart?.id as string,
                    paymentInput: {
                        amount: cart?.totalPrice.gross.amount,
                        gateway: chosenGateway
                    }
                }
            });
            
            handleErrors(createPaymentResult);
            
            await onCheckoutComplete()
        } catch (e) {
            console.error(e);
        } finally{
            setLoading(false)
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
