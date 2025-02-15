import { StyleSheet } from "react-native"
import { colors, Divider, fonts, PaddedView, Text, View } from "@/components/Themed"
import { getConfig } from "@/config"
import { useCheckout } from "@/context/CheckoutProvider"

const OrderTotal = () => {
    const { checkout } = useCheckout()

    const deliveryMethod = checkout && checkout.shippingPrice.gross.amount && checkout.shippingPrice.gross.amount !== 0
        ? checkout.shippingPrice.gross.amount
        : undefined

    return <View style={styles.wrapper}>
        <Text style={{
            fontSize: fonts.h2,
            fontWeight: "900"
        }}>Résumé de la commande</Text>
        <Divider />
        <PaddedView style={styles.rowWrapper}>
            <Text>{`Sous-total des articles`}</Text>
            <Text>
                {checkout?.subtotalPrice.gross.amount.toLocaleString(getConfig().locale, {
                    style: "currency",
                    currency: checkout?.subtotalPrice.gross.currency
                })}
            </Text>
        </PaddedView>
        <PaddedView style={styles.rowWrapper}>
            <Text>Livraison :</Text>
            <Text >
                {deliveryMethod && deliveryMethod.toLocaleString(getConfig().locale, {
                    style: "currency",
                    currency: checkout?.shippingPrice.gross.currency
                })}
                {(!deliveryMethod || deliveryMethod === 0) && "-"}
            </Text>
        </PaddedView>
        <Divider />
        <PaddedView style={styles.rowWrapper}>
            <Text style={styles.title}>Total :</Text>
            <Text style={styles.price}>
                {checkout?.totalPrice.gross.amount.toLocaleString(getConfig().locale, {
                    style: "currency",
                    currency: checkout?.totalPrice.gross.currency
                })}
            </Text>
        </PaddedView>
    </View>
}

export default OrderTotal

const styles = StyleSheet.create({
    wrapper: {
        // border: "0.5 solid " + colors.dividerGrey,
        borderRadius: 5,
        margin: 8,
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
        alignItems: "center"
    },
    title: {
        fontWeight: "bold",
        fontSize: fonts.h2
    },
    price: {
        fontWeight: "bold",
        fontSize: fonts.h1
    }
})
