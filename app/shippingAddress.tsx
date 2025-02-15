import { useRouter } from 'expo-router';
import {  View } from 'react-native';
import ShippingAddressForm from '../components/checkout/ShippingAddressForm';
import {  Text } from '../components/Themed';
import { useCheckout } from '@/context/CheckoutProvider';



const ShippingAddressScreen = () => {
    const { checkout } = useCheckout();
    const router = useRouter()

    if (!checkout || checkout.lines.length === 0) {
        return <View>
            <Text>Panier vide</Text>
        </View>
    }

    const complete = async () => {
        router.back()
    }

    return <>
 

        <ShippingAddressForm onSubmit={complete} onCancel={() => router.back()} />
    </>
}

export default ShippingAddressScreen