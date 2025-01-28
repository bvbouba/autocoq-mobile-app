import { useRouter } from "expo-router";
import { FC } from "react";
import { Pressable, StyleSheet } from 'react-native';
import { getConfig } from "../../config";
import { useCartContext } from "../../context/useCartContext";
import { colors, Text, View } from "../Themed";
import { IconButton } from "react-native-paper";
import { usePaymentContext } from "@/context/usePaymentContext";

const PaymentMethodSelector: FC = () => {
    const { cart } = useCartContext()
    const {chosenGateway} = usePaymentContext()
    const router = useRouter()


    const paymentMethods = cart && cart.availablePaymentGateways || []
    const paymentMethod = paymentMethods.find(p=>p.id===chosenGateway)


    if (paymentMethods && paymentMethods?.length > 0) {
        return <Pressable onPress={() => router.push("/paymentMethods")}>
            <View style={styles.paymentMethodWrapper}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.paymentMethodTitle}>Payment method</Text>
                    <IconButton icon="chevron-down" onPress={() => router.push("/paymentMethods")} style={styles.icon} />
                </View>
                <View style={styles.titleWrapper}>
                    <Text style={styles.paymentMethodValue} numberOfLines={1}>
                        {paymentMethod?.name}
                    </Text>
                </View>
            </View>
        </Pressable >
    }

    return <Pressable onPress={() => router.push("/paymentMethods")}>
        <View style={styles.paymentMethodWrapper}>
            <View style={styles.titleWrapper}>
                <Text style={styles.paymentMethodTitle}>Payment Method</Text>
                <IconButton icon="chevron-down" onPress={() => router.push("/paymentMethods")} style={styles.icon} />
            </View>
            <View style={styles.titleWrapper}>
                <Text style={styles.paymentMethodSummary}>Select the payment Method</Text>
            </View>
        </View>
    </Pressable >

}

export default PaymentMethodSelector

const styles = StyleSheet.create({
    paymentMethodWrapper: {
        // border: "0.5 solid " + colors.dividerGrey,
        borderRadius: 5,
        margin: 8
    },
    icon: {
        marginTop: 5,
        marginRight: 5,
    },
    titleWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 5,
    },
    paymentMethodValue: {
        overflow: "hidden",
        fontStyle: "italic",
        width: 300,
        marginTop: 8,
        marginLeft: 16,
        marginBottom: 16,
    },
    paymentMethodTitle: {
        fontWeight: "bold",
        padding: 8,
        marginTop: 8,
        marginLeft: 8,
    },
    paymentMethodSummary: {
        overflow: "hidden",
        fontStyle: "italic",
        marginTop: 8,
        marginLeft: 16,
        marginBottom: 16,
    }
})