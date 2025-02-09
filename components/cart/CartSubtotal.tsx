import { StyleSheet, View } from "react-native"
import { getConfig } from "../../config";
import { useCartContext } from "../../context/useCartContext"
import { Divider, fonts, PaddedView, Text } from "../Themed"

const CartSubtotal = () => {
    const { cart } = useCartContext();

    if (!cart) {
        return <></>
    }

    return (
        <PaddedView style={styles.subtotalContainer}>
            <View>
                <Text style={styles.title}>Résumé de la commande</Text>
            </View>
            <Divider />
            <View style={styles.subtotalRow}>
                <Text>Sous-total: </Text>
                <Text>
                    {(cart.subtotalPrice.gross.amount).toLocaleString(getConfig().locale, {
                        style: "currency",
                        currency: cart.subtotalPrice.gross.currency
                    })}
                </Text>
            </View>
            <View style={styles.shippingTextContainer}>
                <Text style={styles.shippingText}>
                    Frais de Livraison calculée à la caisse
                    {/* includes{" "}
                    {cart.totalPrice.tax.amount.toLocaleString(getConfig().locale, {
                        style: "currency",
                        currency: cart.subtotalPrice.tax.currency,
                    })}{" "}
                    TVA */}
                </Text>
            </View>
            <Divider />
            <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalAmount}>
                    {(cart.subtotalPrice.gross.amount).toLocaleString(getConfig().locale, {
                        style: "currency",
                        currency: cart.subtotalPrice.gross.currency
                    })}
                </Text>
            </View>
        </PaddedView>
    );
};

const styles = StyleSheet.create({
    subtotalContainer: {
        width: "100%",
        maxWidth: 600,
        marginTop: 8,
        marginBottom: 8,
        padding: 10,
    },
    title: {
        textAlign: "left",
        fontWeight: 'bold',
        fontSize:fonts.h2,
        marginBottom: 8,
    },
    subtotalRow: {
        justifyContent: "space-between",
        flexDirection: "row",
    },
    shippingTextContainer: {
        marginTop: 5,
    },
    shippingText: {
        fontSize: 11,
    },
    totalRow: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    totalText: {
        fontSize:fonts.h2,
        fontWeight: "bold",
    },
    totalAmount: {
        fontSize:fonts.h1,
        fontWeight: "bold",
    },
});

export default CartSubtotal;
