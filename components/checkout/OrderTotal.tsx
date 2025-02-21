import { StyleSheet } from "react-native"
import { Divider, fonts, PaddedView, Text, View } from "@/components/Themed"
import { useCheckout } from "@/context/CheckoutProvider"
import { convertMoneyToString } from "@/utils/convertMoneytoString"

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
        {checkout?.discount?.amount && 
        <PaddedView style={styles.rowWrapper}>
            <Text>{`Réductions`}</Text>
            <Text>
                {convertMoneyToString(checkout?.discount)}
            </Text>
        </PaddedView> }
        <PaddedView style={styles.rowWrapper}>
            <Text>{`Sous-total des articles`}</Text>
            <Text>{}
                {convertMoneyToString(checkout?.subtotalPrice.gross)}
            </Text>
        </PaddedView>
        <PaddedView style={styles.rowWrapper}>
            <Text>Livraison :</Text>
            <Text>
                {convertMoneyToString(checkout?.shippingPrice.gross)}
                {(!deliveryMethod || deliveryMethod === 0) && "-"}
            </Text>
        </PaddedView>
        <Divider />
        <PaddedView style={styles.rowWrapper}>
            <Text style={styles.title}>Total :</Text>
            <Text style={styles.price}>
                {convertMoneyToString(checkout?.totalPrice.gross)}
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
