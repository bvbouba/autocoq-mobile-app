import { useRouter } from "expo-router"
import { Pressable, StyleSheet, TouchableOpacity } from "react-native"
import { useCartContext } from "@/context/useCartContext"
import {Text, View ,colors, fonts } from "@/components/Themed"
import { IconButton } from "react-native-paper"


const ShippingAddress = () => {
    const { cart } = useCartContext()
    const router = useRouter();

    const shippingDetails = cart && cart.shippingAddress

    if (shippingDetails) {
        return <Pressable onPress={() => router.push("/shippingAddress")}>
            <View style={styles.shippingAddressWrapper}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.shippingAddressTitle}>Shipping To </Text>
                    <TouchableOpacity onPress={() => router.push("/shippingAddress")}>
                    <Text style={styles.icon}>Change</Text>
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
        </Pressable >
    }


    return <Pressable onPress={() => router.push("/shippingAddress")}>
        <View style={styles.shippingAddressWrapper}>
            <View style={styles.titleWrapper}>
                <Text style={styles.shippingAddressTitle}>Shipping Address</Text>
                <IconButton icon="chevron-down" onPress={() => router.push("/shippingAddress")} style={styles.icon} />
            </View>
            <View style={styles.titleWrapper}>
                <Text style={styles.shippingAddressSummary}>Enter details</Text>
            </View>
        </View>
    </Pressable >

}

export default ShippingAddress

const styles = StyleSheet.create({
    shippingAddressWrapper: {
        borderRadius: 5,
        margin: 8,
        backgroundColor:colors.background,
        paddingBottom:10
    },
    icon: {
        marginTop: 5,
        marginRight: 10,
        fontSize:fonts.body,
        textDecorationLine:"underline"
    },
    titleWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:"center",
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