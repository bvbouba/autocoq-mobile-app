import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { PaddedView, Text } from '../components/Themed';
import PersonalDetailsForm from '../components/checkout/PersonalDetailsForm';
import { useCheckout } from '@/context/CheckoutProvider';



const PersonalDetailsScreen = () => {
    const { checkout } = useCheckout();
    const router = useRouter()

    if (!checkout || checkout.lines.length === 0) {
        return <View>
            <Text>Panier Vide </Text>
        </View>
    }

    const complete = async () => {
        router.back()
    }

    return <>
        <PaddedView>
            <Text style={styles.title}>Edit personal details</Text>
        </PaddedView>
        <PersonalDetailsForm onSubmit={complete} onCancel={() => router.back()} />
    </>
}


export default PersonalDetailsScreen

const styles = StyleSheet.create({
    title: {
        fontWeight: "bold",
        marginTop: 8
    }
})