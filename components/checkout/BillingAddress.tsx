import { useRouter } from "expo-router"
import { Pressable, StyleSheet, TouchableOpacity } from "react-native"
import { useCartContext } from "../../context/useCartContext"
import { IconButton } from "react-native-paper"
import {fonts, Text, View  } from "@/components/Themed"


const BillingAddress = () => {
    const { cart } = useCartContext()
    const router = useRouter();

    const billingDetails = cart && cart.billingAddress
    if (billingDetails) {
        return <>
            <View style={styles.billAddressWrapper}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.billingAddressTitle}>Billing Address</Text>
                    <TouchableOpacity onPress={() => router.push("/billingAddress")}>
                    <Text style={styles.icon}>Edit Billing</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.detailWrapper}>
    
                    <Text style={styles.billingAddressValue}>
                        {billingDetails.lastName}, {billingDetails.firstName}
                    </Text>
                    <Text style={styles.billingAddressValue}>
                        {billingDetails.streetAddress1}, {billingDetails.streetAddress2},{" "}
                    </Text>
                    <Text style={styles.billingAddressValue} numberOfLines={1}>
                        {billingDetails.city}, {billingDetails.postalCode}
                    </Text>
                </View>
            </View>
        </>
    }

    return <Pressable onPress={() => router.push("/billingAddress")}>
        <View style={styles.billAddressWrapper}>
            <View style={styles.titleWrapper}>
                <Text style={styles.billingAddressTitle}>Billing Address</Text>
                <IconButton icon="chevron-down" onPress={() => router.push("/billingAddress")} style={styles.icon} />
            </View>
            <View style={styles.titleWrapper}>
                <Text style={styles.billingAddressSummary}>Enter billing details</Text>
            </View>
        </View>
    </Pressable >
}

export default BillingAddress

const styles = StyleSheet.create({
    billAddressWrapper: {
        // border: "0.5 solid " + colors.dividerGrey,
        borderRadius: 5,
        margin: 8
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
    billingAddressValue: {
        overflow: "hidden",
        fontStyle: "italic",
        width: 300,
        marginLeft: 16,
    },
    billingAddressTitle: {
        fontWeight: "bold",
        padding: 8,
        marginTop: 8,
        marginLeft: 8,
    },
    billingAddressSummary: {
        overflow: "hidden",
        fontStyle: "italic",
        marginTop: 8,
        marginLeft: 16,
        marginBottom: 16,
    }
})