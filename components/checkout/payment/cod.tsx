import { colors } from "@/components/Themed";
import { useCheckout } from "@/context/CheckoutProvider";
import { useLoading } from "@/context/LoadingContext";
import { useMessage } from "@/context/MessageContext";
import { useOrderContext } from "@/context/useOrderContext";
import { useAuth } from "@/lib/providers/authProvider";
import { useCheckoutCompleteMutation, useCheckoutPaymentCreateMutation } from "@/saleor/api.generated";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {  Alert, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import analytics from '@react-native-firebase/analytics';

export const codGatewayId = "cash.on.delivery"

const CodPayment = () => {
    const { checkout, checkoutToken } = useCheckout();
    const router = useRouter();
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [checkoutPaymentCreateMutation] = useCheckoutPaymentCreateMutation();
    const [checkoutCompleteMutation] = useCheckoutCompleteMutation();
    const {authenticated} = useAuth()
    const { setRecentOrderId: setOrderId } = useOrderContext();
    const {showMessage} = useMessage()
    const {setLoading}=useLoading()


    const redirectToOrderDetailsPage = async (orderId: string) => {
        Alert.alert('Succès', 'Votre commande est confirmée !');
        router.push(`/orders/${orderId}?orderSuccess=true`)   
        setLoading(false)
    };

    useEffect(()=>{
     setLoading(isPaymentProcessing)
    },[isPaymentProcessing])

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
          showMessage("Erreur de création de paiement")
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
          console.error("Erreur de finalisation :", completeErrors);
          showMessage("Erreur de finalisation de la commande")
          setIsPaymentProcessing(false);
          return;
        }
    
        const order = completeData?.checkoutComplete?.order;
        // Si aucune erreur ne survient, la commande doit être créée
        if (order) {

          // purchase analytics event here
          analytics().logEvent('purchase', {
            transaction_id: order.id,
            value: checkout?.totalPrice?.gross.amount || 0,
            currency: checkout?.totalPrice?.gross.currency || 'USD',
            shipping: checkout?.shippingPrice?.gross.amount || 0,
            items: checkout?.lines.map(line => ({
                item_id: line?.variant.id,
                item_name: line?.variant.product.name,
                price: line?.totalPrice.gross.amount || 0,
                quantity: line?.quantity || 1,
            })),
        });

            if(!authenticated){
                setOrderId(order.id)
                }
          setIsPaymentProcessing(false);
          redirectToOrderDetailsPage(order.id);
        } else {
          console.error("La commande n'a pas été créée");
          setIsPaymentProcessing(false);
          showMessage("La commande n'a pas été créée")
        }
    };

    return (
        <>
        <View>

        <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleSubmit}
            disabled={isPaymentProcessing}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>TERMINER</Text>
          </TouchableOpacity>
          
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
        backgroundColor: colors.primary,
        alignItems:"center",
        marginHorizontal: 10,
        borderRadius: 5,
        padding: 20
    },
    submitButtonText: {
        fontWeight: "bold",
        color: "white", 
    },
});

export default CodPayment;
