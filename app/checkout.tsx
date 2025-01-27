import { PaymentSheetError, StripeProvider, initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Divider, PaddedView, Text, View, colors } from '../components/Themed';
import BillingAddress from '../components/checkout/BillingAddress';
import PersonalDetails from '../components/checkout/PersonalDetails';
import ShippingAddress from '../components/checkout/ShippingAddress';
import ShippingMethodSelector from '../components/checkout/ShippingMethodSelector';
import { getConfig } from '../config';
import { useCartContext } from '../context/useCartContext';
import { usePaymentContext } from '../context/usePaymentContext';
import { Button } from 'react-native-paper';
import OrderTotal from '../components/checkout/OrderTotal';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import { paymentMethodToComponent } from '@/components/checkout/payment/supportedPaymentApps';

const Checkout = () => {
    const { cart } = useCartContext();
    const { chosenGateway } = usePaymentContext();
    const router = useRouter();
    
    const Component = paymentMethodToComponent[chosenGateway||"dummy"];

    if (!cart || cart.lines.length === 0) {
        return <View style={styles.wrapper}>
            <PaddedView style={styles.rowWrapper}>
                <Text style={styles.title}>Empty Cart:</Text>
            </PaddedView>
            <PaddedView style={styles.rowWrapper}>
                <Text>
                    Cannot checkout an empty cart
                </Text>
            </PaddedView>
            <PaddedView style={styles.rowWrapper}>
                <Button onPress={() => router.push("/")} mode="contained" style={styles.checkoutButton}>Go to dashboard</Button>
            </PaddedView>

            <Divider />
        </View>
    }


    return (<SafeAreaView style={styles.container} testID="cart-list-safe" >
            <ScrollView testID="cart-list-scroll">
                <PaddedView style={{marginTop: 12}}>
                    <Text style={styles.termsText}>By placing your order you agree to the Saleor App's Terms and Conditions of Awesomeness. Please see our Privacy Lotus, our Cookie Recipes for more details.</Text>
              <Component />
              </PaddedView>
                <OrderTotal />
                <PersonalDetails />
                <BillingAddress />

                {cart?.isShippingRequired && <>
                    <ShippingAddress />
                    <ShippingMethodSelector />
                </>}
                <PaymentMethodSelector />
            </ScrollView >
        </SafeAreaView >)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkoutButton: {
        width: "100%",
    },
    termsText: {
        fontSize: 12,
        color: colors.greyText,
        marginBottom: 16
    },
    wrapper: {
        // border: "0.5 solid " + colors.dividerGrey,
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
        fontSize: 16
    }
});

export default Checkout