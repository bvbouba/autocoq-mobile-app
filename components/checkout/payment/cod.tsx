import { colors } from "@/components/Themed";
import { useCheckout } from "@/context/CheckoutProvider";
import { useOrderContext } from "@/context/useOrderContext";
import { useAuth } from "@/lib/providers/authProvider";
import { useCheckoutCompleteMutation, useCheckoutPaymentCreateMutation } from "@/saleor/api.generated";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";

export const codGatewayId = "cash.on.delivery"

const CodPayment = () => {
    const { checkout, checkoutToken, resetCheckoutToken } = useCheckout();
    const router = useRouter();
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [checkoutPaymentCreateMutation] = useCheckoutPaymentCreateMutation();
    const [checkoutCompleteMutation] = useCheckoutCompleteMutation();
    const {authenticated} = useAuth()
    const { setRecentOrderId: setOrderId } = useOrderContext();

    const redirectToOrderDetailsPage = async (orderId: string) => {
        Alert.alert('Succès', 'Votre commande est confirmée !');
        router.push(`/orderDetails/${orderId}?orderSuccess=true"`)   
        resetCheckoutToken();
    };

    const handleSubmit = async () => {
        setIsPaymentProcessing(true);
    
        // Création du paiement Saleor
        const { errors: paymentCreateErrors } = await checkoutPaymentCreateMutation({
          variables: {
            token: checkoutToken,
            paymentInput: {
                amount: checkout?.totalPrice.gross.amount,
                gateway: codGatewayId
            },
          },
        });
    
        if (paymentCreateErrors) {
          console.error(paymentCreateErrors);
          setIsPaymentProcessing(false);
          return;
        } 
    
        // Tentative de finalisation du paiement
        const { data: completeData, errors: completeErrors } = await checkoutCompleteMutation({
          variables: {
            token: checkoutToken,
          },
        });
        if (completeErrors) {
          console.error("Erreurs de finalisation :", completeErrors);
          setIsPaymentProcessing(false);
          return;
        }
    
        const order = completeData?.checkoutComplete?.order;
        // Si aucune erreur ne survient, la commande doit être créée
        if (order) {
            if(!authenticated){
                setOrderId(order.id)
                }
          redirectToOrderDetailsPage(order.id);
        } else {
          console.error("La commande n'a pas été créée");
        }
    };

    return (
        <>
        <View>
        <Button
            onPress={handleSubmit}
            mode="contained"
            style={styles.submitButton}
            labelStyle={styles.submitButtonText}
        >
            {isPaymentProcessing ? <ActivityIndicator color="white" /> : "Commander et payer après la livraison"}
        </Button>
        </View>

        {/* {error && (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error.message}</Text>
            </View>
        )} */}

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
        borderRadius: 5,
        padding: 5
    },
    submitButtonText: {
        fontWeight: "bold",
        color: "black", 
    },
});

export default CodPayment;
