import { useRouter } from "expo-router"
import { Pressable, StyleSheet } from "react-native"
import {  Text, View } from "@/components/Themed"
import { IconButton } from "react-native-paper"
import { useCheckout } from "@/context/CheckoutProvider"


const PersonalDetails = () => {
    const { checkout } = useCheckout()
    const router = useRouter();

    const email = checkout && checkout.email || ""

    const phoneNumber = email.split("@")[0];

    if (email) {
        return <Pressable onPress={() => router.push("/personalDetails")}>
            <View style={styles.personalDetailsWrapper}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.personalDetailsTitle}>Détails personnels</Text>
                    <IconButton icon="chevron-down" onPress={() => router.push("/personalDetails")} style={styles.icon} />
                </View>
                <View style={styles.titleWrapper}>
                    <Text style={styles.personalDetailsValue} numberOfLines={1}>
                        {phoneNumber}
                    </Text>
                </View>
            </View>
        </Pressable >
    }

    return <Pressable onPress={() => router.push("/personalDetails")}>
        <View style={styles.personalDetailsWrapper}>
            <View style={styles.titleWrapper}>
                <Text style={styles.personalDetailsTitle}>Détails personnels</Text>
                <IconButton icon="chevron-down" onPress={() => router.push("/personalDetails")} style={styles.icon} />
            </View>
            <View style={styles.titleWrapper}>
                <Text style={styles.personalDetailsSummary}>Saisissez vos informations</Text>
            </View>
        </View>
    </Pressable >

}


export default PersonalDetails

const styles = StyleSheet.create({
    personalDetailsWrapper: {
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
    personalDetailsValue: {
        overflow: "hidden",
        fontStyle: "italic",
        width: 300,
        marginTop: 8,
        marginLeft: 16,
        marginBottom: 16,
    },
    personalDetailsTitle: {
        fontWeight: "bold",
        padding: 8,
        marginTop: 8,
        marginLeft: 8,
    },
    personalDetailsSummary: {
        overflow: "hidden",
        fontStyle: "italic",
        marginTop: 8,
        marginLeft: 16,
        marginBottom: 16,
    }
})