import { FC } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { OrderFragment } from "@/saleor/api.generated";
import { Divider, fonts, PaddedView, Text, View } from "@/components/Themed";
import OrderLineItemComponent from "./OrderLineItemComponent";
import OrderSubtotal from "./OrderSubtotal";
import { formatDate } from "@/utils/dateformat";
import { getStatusBackgroundColor, getStatusLabel } from "@/utils/status";
import AddressDisplay from "../address/addressDisplay";


interface Props {
    order: OrderFragment
}

const OrderContent: FC<Props> = ({ order }) => {

    if (order) {
        return <ScrollView style={styles.scroll} testID="cart-list-scroll">
            <PaddedView>
                <View>
                    <View style={styles.statusWrapper}>
                        <Text style={styles.orderNumberText}>{formatDate(order.created)}</Text>
                    </View>
                    <View>
                        <Text style={styles.orderNumberLabel}>Commande {order.number}</Text>
                    </View>
                    <View style={styles.statusWrapper}>
                        <Text style={styles.statusLabel}>Statut de paiement:</Text>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusBackgroundColor(order.paymentStatus) },
                            ]}
                        >
                            <Text style={styles.statusText}>{getStatusLabel(order.paymentStatus)}</Text>
                        </View>
                    </View>
                    <View style={styles.statusWrapper}>
                        <Text style={styles.statusLabel}>Statut d'expédition:</Text>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusBackgroundColor(order.status) },
                            ]}
                        >
                            <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.updateLabel}>Dernière mise à jour {new Date(order.updatedAt).toLocaleDateString('fr')}</Text>
                    </View>

                </View>

            </PaddedView>

            <Divider />


            <PaddedView>
                <OrderSubtotal order={order} />

            </PaddedView>

            <Divider />
            {order.lines.map(line => <OrderLineItemComponent lineItem={line} key={line.id} />)}

            {!!order?.billingAddress && (
                <>
                    <Divider />
                    <View style={styles.addressWrapper}>
                        <Text style={styles.addressTitle}>Adresse de facturation</Text>
                        <AddressDisplay address={order.billingAddress} />
                    </View>
                </>
            )}

            {!!order?.shippingAddress && (
                <>
                    <Divider />
                    <View style={styles.addressWrapper}>
                        <Text style={styles.addressTitle}>Adresse de livraison</Text>
                        <AddressDisplay address={order.shippingAddress} />
                    </View>
                </>
            )}
                                <Divider />


        </ScrollView >
    }

    return <View>
        <Text style={styles.noOrderText}>Vous n'avez aucune commande</Text>
    </View>
}

export default OrderContent


const styles = StyleSheet.create({
    scroll: {
        width: "100%",
        marginTop: 12
    },
    checkoutButton: {
        width: "100%",
    },
    orderNumberText: {
        fontSize:fonts.h2,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 8
    },
    orderNumberLabel: {
        fontSize:fonts.h2,
        fontWeight: "normal",
        color: "#333"
    },
    statusWrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 4,
    },
    statusText: {
        fontSize:fonts.body,
        color: "black",
    },
    statusLabel: {
        fontSize:fonts.body,
        fontWeight: "bold",
        color: "#555"
    },
    updateLabel: {
        fontSize:fonts.body,
        color: "#888"
    },
    addressTitle: {
        fontSize:fonts.h3,
        fontWeight: "bold",
        color: "#444",
        marginBottom:10,
    },
    noOrderText: {
        fontSize:fonts.h2,
        color: "#555",
        textAlign: "center",
        marginTop: 20
    },
    addressWrapper:{
        padding:15
    }
});
