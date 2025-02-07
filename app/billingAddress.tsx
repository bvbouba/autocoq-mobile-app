import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import BillingAddressForm from '../components/checkout/BillingAddressForm';
import { PaddedView, Text } from '../components/Themed';
import { useCartContext } from '../context/useCartContext';

const BillingAddressScreen = () => {
    const { cart, refreshCart } = useCartContext();
    const router = useRouter()

    if (!cart || cart.lines.length === 0) {
        return <View>
            <Text>Empty Cart</Text>
        </View>
    }

    return <PaddedView>
        <BillingAddressForm onSubmit={async () => {
                await refreshCart()
                router.back()
        }} onCancel={() => router.back()} />
    </PaddedView>
}



export default BillingAddressScreen