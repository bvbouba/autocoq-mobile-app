import { StyleSheet } from "react-native";
import { getConfig } from "../../config";
import { Text, View } from "../Themed";
import { OrderFragment } from "../../saleor/api.generated";
import { FC } from "react";

interface Props {
    order: OrderFragment
}

const OrderSubtotal: FC<Props> = ({ order }) => {

    return <View style={styles.subtotalContainer}>
        <View style={styles.row}>
            <Text style={styles.subtotalTitle}>Sous-total: </Text>
            <Text style={styles.subtotalPrice}>
                {(order.subtotal.gross.amount).toLocaleString(getConfig().locale, {
                    style: "currency",
                    currency: order.subtotal.gross.currency
                })}
            </Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.subtotalTitle}>Livraison: </Text>
            <Text style={styles.subtotalPrice}>
                {(order.shippingPrice.gross.amount).toLocaleString(getConfig().locale, {
                    style: "currency",
                    currency: order.shippingPrice.gross.currency
                })}
            </Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.totalTitle}>Total: </Text>
            <Text style={styles.totalPrice}>
                {(order.total.gross.amount).toLocaleString(getConfig().locale, {
                    style: "currency",
                    currency: order.total.gross.currency
                })}
            </Text>
        </View>

    </View>
}

const styles = StyleSheet.create({
    subtotalContainer: {
        width: "100%",
        maxWidth: 600,
        marginTop: 8,
        marginBottom: 8
    },
    subtotalTitle: {
        textAlign: "left",
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 8
    },
    subtotalPrice: {
        textAlign: "left",
        marginLeft: 8,
        fontSize: 14,
    },
    totalTitle: {
        textAlign: "left",
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8
    },
    totalPrice: {
        textAlign: "left",
        marginLeft: 8,
        fontSize: 16,
    },
    row: {
        marginBottom: 8,
        justifyContent: "space-between",
        flexDirection:"row"
    }
})

export default OrderSubtotal;
