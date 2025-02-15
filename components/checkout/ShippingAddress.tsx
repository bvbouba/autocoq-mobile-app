import { useRouter } from "expo-router"
import { Pressable, StyleSheet, TouchableOpacity } from "react-native"
import { Text, View, colors, fonts } from "@/components/Themed"
import { IconButton } from "react-native-paper"
import { useCheckout } from "@/context/CheckoutProvider"

const ShippingAddress = () => {
    const { checkout } = useCheckout()
    const router = useRouter();

    const shippingDetails = checkout && checkout.shippingAddress

    if (shippingDetails) {
        return <Pressable onPress={() => router.push("/shippingAddress")}>
            <View style={styles.shippingAddressWrapper}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.shippingAddressTitle}>Livraison à</Text>
                    <TouchableOpacity onPress={() => router.push("/shippingAddress")}>
                        <Text style={styles.icon}>Modifier</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.detailWrapper}>
                    <Text style={styles.shippingAddressValue}>
                        {shippingDetails.lastName}, {shippingDetails.firstName}
                    </Text>
                    <Text style={styles.shippingAddressValue}>
                        {shippingDetails.streetAddress1}, {shippingDetails.streetAddress2},{" "}
                    </Text>
                    <Text style={styles.shippingAddressValue} numberOfLines={1}>
                        {shippingDetails.city}, {shippingDetails.postalCode}
                    </Text>
                </View>
            </View>
        </Pressable>
    }

    return <Pressable onPress={() => router.push("/shippingAddress")}>
        <View style={styles.shippingAddressWrapper}>
            <View style={styles.titleWrapper}>
                <Text style={styles.shippingAddressTitle}>Adresse de livraison</Text>
                <IconButton icon="chevron-down" onPress={() => router.push("/shippingAddress")} style={styles.icon} />
            </View>
            <View style={styles.titleWrapper}>
                <Text style={styles.shippingAddressSummary}>Saisir les détails</Text>
            </View>
        </View>
    </Pressable>
}

export default ShippingAddress

const styles = StyleSheet.create({
    shippingAddressWrapper: {
        borderRadius: 5,
        margin: 8,
        backgroundColor: colors.background,
        paddingBottom: 10
    },
    icon: {
        marginTop: 5,
        marginRight: 10,
        fontSize: fonts.body,
        textDecorationLine: "underline"
    },
    titleWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: 'inherit',
    },
    detailWrapper: {
        flexDirection: "column",
        backgroundColor: 'inherit',
    },
    shippingAddressValue: {
        overflow: "hidden",
        fontStyle: "italic",
        width: 300,
        marginLeft: 16,
    },
    shippingAddressTitle: {
        fontWeight: "bold",
        padding: 8,
        marginTop: 8,
        marginLeft: 8,
    },
    shippingAddressSummary: {
        overflow: "hidden",
        fontStyle: "italic",
        marginTop: 8,
        marginLeft: 16,
        marginBottom: 16,
    }
})
