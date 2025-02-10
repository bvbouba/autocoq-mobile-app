import { 
    CheckoutLine, 
    useCheckoutBillingAddressUpdateMutation, 
    useCheckoutShippingAddressUpdateMutation, 
    useCurrentUserAddressesQuery 
} from "../../saleor/api.generated";


import {Text, View ,  PaddedView,colors, fonts } from "@/components/Themed"


import { ScrollView, StyleSheet } from 'react-native';
import { useCartContext } from "../../context/useCartContext";
import CartItem from "./CartItem";
import CartSubtotal from "./CartSubtotal";
import { useRouter } from "expo-router";
import { ActivityIndicator, Button } from "react-native-paper";
import { getConfig } from "@/config";
import { useAuth } from "@/lib/providers/authProvider";
import { useState } from "react";
import Loading from "../Loading";

const CartScreen = () => {
    const { cart, loading } = useCartContext();
    const { authenticated, user, token, checkAndRefreshToken } = useAuth();
    const [updateShippingAddress] = useCheckoutShippingAddressUpdateMutation();
    const [updateBillingAddress] = useCheckoutBillingAddressUpdateMutation();
    const [mLoading,setmLoading] = useState(false)

    const { data, loading: aloading } = useCurrentUserAddressesQuery({
        skip: !authenticated,
        fetchPolicy: "network-only",
        context: {
            headers: {
                authorization: token ? `Bearer ${token}` : "",
            },
        },
        onError: async (error) => {
            if (error.message.includes("Signature has expired")) {
                await checkAndRefreshToken();
            }
        },
    });

    const addresses = data?.me?.addresses || [];
    const shippingAddress = addresses.find(a => a.isDefaultShippingAddress);
    const billingAddress = addresses.find(a => a.isDefaultBillingAddress);
    
    const navigation = useRouter();

    const handleSubmit = async () => {
        setmLoading(true)
 
        if (cart?.shippingAddress && cart?.billingAddress) {
            setmLoading(false)
            navigation.push('/checkout');
            return;
        }
        
    
        let shippingSuccess = false;
        let billingSuccess = false;
      
        try {
            if (!cart?.shippingAddress && shippingAddress && cart?.isShippingRequired) {
                const { data: shippingData } = await updateShippingAddress({
                    variables: { 
                        id: cart?.id as string, 
                        shippingAddress: {
                            streetAddress1: shippingAddress?.streetAddress1,
                            streetAddress2: shippingAddress?.streetAddress2,
                            country: "CI",
                            firstName: shippingAddress?.firstName || "",
                            lastName: shippingAddress?.lastName || "",
                            postalCode: shippingAddress?.postalCode || "",
                            phone: shippingAddress?.phone || "",
                            city: shippingAddress?.city || "",
                        }
                    },
                });
    
                const shippingErrors = shippingData?.checkoutShippingAddressUpdate?.errors || [];
                if (shippingErrors.length === 0) {
                    shippingSuccess = true;
                } else {
                    console.error("Error updating shipping address:", shippingErrors);
                }
            } 
    
            // Update Billing Address if missing
            if (!cart?.billingAddress && billingAddress) {
                const { data: billingData } = await updateBillingAddress({
                    variables: { 
                        id: cart?.id as string, 
                        billingAddress: {
                            streetAddress1: billingAddress?.streetAddress1,
                            streetAddress2: billingAddress?.streetAddress2,
                            country: "CI",
                            firstName: billingAddress?.firstName || "",
                            lastName: billingAddress?.lastName || "",
                            postalCode: billingAddress?.postalCode || "",
                            phone: billingAddress?.phone || "",
                            city: billingAddress?.city || "",
                        }
                    },
                });
    
                const billingErrors = billingData?.checkoutBillingAddressUpdate?.errors || [];
                if (billingErrors.length === 0) {
                    billingSuccess = true;
                } else {
                    console.error("Error updating billing address:", billingErrors);
                }
            }
    
        } catch (error) {
            setmLoading(false)
            console.error("Failed to update addresses. Please try again.", error);
        }finally{
            setmLoading(false)
        }
        
        if ((shippingSuccess || billingSuccess)) {
            navigation.push('/checkout');
        } else {
            if(cart?.isShippingRequired){
            navigation.push('/shippingAddress');
            }else{
                navigation.push('/billingAddress')
            }
        }

5    };

    if (aloading) {
        return (
           <Loading />
        );
    }

    if (!cart || cart.lines.length === 0) {
        return (
            <View style={styles.emptyCartContainer}>
                <PaddedView>
                    <Text style={styles.emptyCartText}>Panier vide</Text>
                </PaddedView>
                <PaddedView>
                    <Button onPress={() => navigation.push("/")} mode="contained" style={styles.checkoutButton}>
                        Aller au tableau de bord
                    </Button>
                </PaddedView>
            </View>
        );
    }

    return (
        <View style={styles.scrollContainer} testID="cart-list-safe">
            <ScrollView style={styles.scroll} testID="cart-list-scroll">
                <PaddedView>
                {cart.lines.map(line => (
                    <CartItem lineItem={line as CheckoutLine} key={line.id} />
                ))}
                <CartSubtotal />
                </PaddedView>
            </ScrollView>

            <PaddedView style={styles.footerContainer}>
                <View style={styles.subtotalRow}>
                    <Text style={{ fontWeight: "bold" }}>Sous-total : </Text>
                    <Text style={{ fontWeight: "bold" }}>
                        {(cart.subtotalPrice.gross.amount).toLocaleString(getConfig().locale, {
                            style: "currency",
                            currency: cart.subtotalPrice.gross.currency
                        })}
                    </Text>
                </View>

                <View style={styles.checkoutButtonContainer}>
                    <Button 
                        style={styles.checkoutButton} 
                        onPress={handleSubmit} 
                        mode="contained" 
                        disabled={loading}
                    >
                        {mLoading ? <ActivityIndicator color="white" /> : "PASSER LA COMMANDE"}
                    </Button>
                </View>
            </PaddedView>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyCartContainer: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column"
    },
    emptyCartText: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize:fonts.h2
    },
    scroll: {
        width: "100%",
    },
    footerContainer: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopColor: colors.border,
        borderTopWidth: 1,
    },
    subtotalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,
    },
    checkoutButtonContainer: {
        marginVertical: 5,
    },
    checkoutButton: {
        backgroundColor: colors.primary,
        borderRadius: 2,
        width: "100%",
    },
});

export default CartScreen;
