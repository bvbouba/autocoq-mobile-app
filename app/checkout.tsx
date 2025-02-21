import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View, Divider, PaddedView, colors, fonts } from "@/components/Themed";
import { Button } from 'react-native-paper';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import { paymentMethodToComponent } from '@/components/checkout/payment/supportedPaymentApps';
import OrderTotal from '@/components/checkout/OrderTotal';
import ShippingMethodSelector from '@/components/checkout/ShippingMethodSelector';
import ShippingAddress from '@/components/checkout/ShippingAddress';
import { FontAwesome } from '@expo/vector-icons';
import { useCheckout } from '@/context/CheckoutProvider';
import { useEffect } from 'react';
import { useLoading } from '@/context/LoadingContext';
import PromoCode from '@/components/checkout/PromoCode';

const Checkout = () => {
    const { checkout,loading,chosenGateway } = useCheckout();
    const router = useRouter();
    const {setLoading} = useLoading()

    const buyNowEnabled = !!checkout?.email && !!checkout?.billingAddress && (!checkout?.isShippingRequired || !!checkout?.shippingAddress) &&!!checkout?.deliveryMethod && !!chosenGateway; 
    
    useEffect(()=>{ 
    setLoading(loading)
    },[loading])
    

    const Component = paymentMethodToComponent[buyNowEnabled ? chosenGateway : "dummy"];

    if (!checkout || checkout.lines.length === 0) {
        return <View style={styles.wrapper}>
            <PaddedView style={styles.rowWrapper}>
                <Text style={styles.title}>Panier vide :</Text>
            </PaddedView>
            <PaddedView style={styles.rowWrapper}>
                <Text>
                    Impossible de passer commande avec un panier vide
                </Text>
            </PaddedView>
            <PaddedView style={styles.rowWrapper}>
                <Button onPress={() => router.push("/")} mode="contained" style={styles.checkoutButton}>
                    Aller au tableau de bord
                </Button>
            </PaddedView>

            <Divider />
        </View>
    }

    return (
        <SafeAreaView style={styles.container} testID="cart-list-safe">
            <ScrollView testID="cart-list-scroll">
                <View>
                    <View style={{ margin: 12, flexDirection: "row" }}>
                        <View>
                            <FontAwesome name="gift" size={20} color="black" />
                        </View>
                        <View style={{ marginLeft: 5 }}>
                            <Text style={{ fontSize: fonts.h2, fontWeight: "500" }}>
                                Livraison
                            </Text>
                        </View>
                    </View>
                    {checkout?.isShippingRequired && <>
                        <ShippingAddress />
                        <ShippingMethodSelector />
                    </>}
                    <Divider style={{ borderBottomWidth: 10 }} />
                    <PaymentMethodSelector />
                    <Divider style={{ borderBottomWidth: 10 }} />
                    <PromoCode />  
                </View>
                <OrderTotal />
            </ScrollView>
            <View style={{ borderTopColor: colors.secondary, borderTopWidth: 1 }}>
                <View style={{ alignItems: "center", margin: 10 }}>
                    {chosenGateway ?
                        <View style={{ }}>
                            <Text style={{ fontSize: fonts.caption }}>
                                En passant cette commande, j'accepte les 
                            </Text>
                            <TouchableOpacity onPress={() => router.push("/account/terms")}>
                                <Text style={{
                                    fontSize: fonts.caption,
                                    textDecorationLine: "underline",
                                    color: "blue"
                                }}>
                                    Conditions générales et Politique de confidentialité
                                </Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <Text style={{
                            color: colors.secondary,
                            fontSize: fonts.caption
                        }}>
                            Veuillez saisir un mode de paiement pour valider votre commande
                        </Text>
                    }
                </View>
                <Component />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        backgroundColor: "white"
    },
    checkoutButton: {
        width: "100%",
    },
    termsText: {
        fontSize: fonts.caption,
        color: colors.secondary,
        marginBottom: 16
    },
    wrapper: {
        borderRadius: 5,
        margin: 8,
        paddingTop: 8,
        paddingBottom: 8,
    },
    icon: {
        marginTop: 5,
        marginRight: 5,
    },
    rowWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 5,
    },
    title: {
        fontWeight: "bold",
        fontSize: fonts.h2
    }
});

export default Checkout;
