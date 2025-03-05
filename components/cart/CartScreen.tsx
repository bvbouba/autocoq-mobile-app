import { 
    CheckoutLine, 
    useCheckoutBillingAddressUpdateMutation, 
    useCheckoutShippingAddressUpdateMutation, 
    useCurrentUserAddressesQuery 
} from "@/saleor/api.generated";


import {Text, View ,  PaddedView,colors, fonts } from "@/components/Themed"


import {  ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import CartItem from "./CartItem";
import CartSubtotal from "./CartSubtotal";
import {  useRouter } from "expo-router";
import { ActivityIndicator, Button } from "react-native-paper";
import { getConfig } from "@/config";
import { useAuth } from "@/lib/providers/authProvider";
import {  useState } from "react";
import { useCheckout } from "@/context/CheckoutProvider";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useModal } from "@/context/useModal";
import Auth from "../account/auth";
import { useMessage } from "@/context/MessageContext";

const CartScreen = () => {
    const { checkout,checkoutToken, loading } = useCheckout();
    const { authenticated, token, checkAndRefreshToken } = useAuth();
    const [updateShippingAddress] = useCheckoutShippingAddressUpdateMutation();
    const [updateBillingAddress] = useCheckoutBillingAddressUpdateMutation();
    const [isLoading,setLoading] = useState(false)
    const router = useRouter()
    const {openModal} = useModal()
    const {showMessage} = useMessage()
    

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
 
        if (checkout?.shippingAddress && checkout?.billingAddress) {
            navigation.push('/checkout');
            return;
        }
        
    
        let shippingSuccess = false;
        let billingSuccess = false;
      
        try {
            setLoading(true)
            if (!checkout?.shippingAddress && shippingAddress && checkout?.isShippingRequired) {
                const { data: shippingData } = await updateShippingAddress({
                    variables: { 
                        token: checkoutToken, 
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
                    showMessage("Erreur lors de la mise à jour")
                }
            } 
    
            // Update Billing Address if missing
            if (!checkout?.billingAddress && billingAddress) {
                const { data: billingData } = await updateBillingAddress({
                    variables: { 
                        token: checkoutToken, 
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
                    showMessage("Erreur lors de la mise à jour")
                }
            }
    
        } catch (error) {
            console.error("Failed to update addresses. Please try again.", error);
            showMessage("Impossible de mettre à jour les adresses. Veuillez réessayer.")
        }finally{
            setLoading(false)
        }
        
        if ((shippingSuccess || billingSuccess)) {
            navigation.push('/checkout');
        } else {
            if(checkout?.isShippingRequired){
            navigation.push('/shippingAddress');
            }else{
                navigation.push('/billingAddress')
            }
        }

5    };



    if (!checkout || checkout.lines.length === 0) {
        return (
            <View style={styles.emptyCartContainer}>
            <View style={styles.iconContainer}>
                <FontAwesome name="shopping-cart" size={50} color="gray" />
            </View>

            <PaddedView>
                <Text style={styles.emptyCartText}>Votre panier est vide</Text>
            </PaddedView>

            <PaddedView>
                <Text style={styles.description}>
                    On dirait que vous n'avez pas encore ajouté d'articles à votre panier.
                </Text>
            </PaddedView>

            <PaddedView>
                <Button 
                    onPress={() => router.push("/")} 
                    mode="contained" 
                    style={styles.checkoutButton}
                >
                   <Text style={{
                    color:"white"
                   }}>CONTINUER LES ACHATS</Text> 
                </Button>
            </PaddedView>

            {/* Sign-in prompt */}
            <PaddedView>
            <TouchableOpacity onPress={()=>{
                openModal({
                    id:"Auth",
                    content:<Auth />,
                    height:"115%",
                    closeButtonVisible:true
                })
            }}>
                <Text style={styles.accountText}>
                    Vous avez un compte ?{" "}
                        <Text style={styles.linkText}>Se connecter ou créer un compte</Text>
                    {" "}pour voir votre panier.
                </Text>
                </TouchableOpacity>
            </PaddedView>
        </View>
        );
    }

    return (
        <View style={styles.scrollContainer} testID="cart-list-safe">
            <ScrollView style={styles.scroll} testID="cart-list-scroll">
                <PaddedView>
                {checkout.lines.map(line => (
                    <CartItem lineItem={line as CheckoutLine} key={line.id} />
                ))}
                <CartSubtotal />
                </PaddedView>
               
            </ScrollView>

            <PaddedView style={styles.footerContainer}>
                <View style={styles.subtotalRow}>
                    <Text style={{ fontWeight: "bold" }}>Sous-total : </Text>
                    <Text style={{ fontWeight: "bold" }}>
                        {(checkout.subtotalPrice.gross.amount).toLocaleString(getConfig().locale, {
                            style: "currency",
                            currency: checkout.subtotalPrice.gross.currency
                        })}
                    </Text>
                </View>

                <View style={styles.checkoutButtonContainer}>

                    <TouchableOpacity
                        onPress={handleSubmit} 
                        disabled={loading}
                            style={[
                            styles.checkoutButton,

                            { opacity: loading ? 0.5 : 1 }, 
                            ]}
                            activeOpacity={0.7} 
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>PASSER LA COMMANDE</Text>}
                        </TouchableOpacity>
                </View>
            </PaddedView>
        </View>
    );
};

const styles = StyleSheet.create({

    emptyCartContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    emptyCartText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    description: {
        fontSize: fonts.body,
        textAlign: "center",
        color: "#666",
        marginBottom: 20,
    },
    checkoutButton: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: colors.primary,
        marginTop: 10,
        padding: 15,
        alignItems: "center",
    },
    accountText: {
        fontSize: fonts.body,
        textAlign: "center",
        marginTop: 10,
        color: colors.textPrimary,
    },
    linkText: {
        fontWeight: "bold",
        textDecorationLine: "underline",
        color: colors.primary,
    },
    scrollContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
      },
});

export default CartScreen;
