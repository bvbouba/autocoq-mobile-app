import { View } from 'react-native';
import BillingAddressForm from '../components/checkout/BillingAddressForm';
import { PaddedView, Text } from '../components/Themed';
import { useCheckout } from '@/context/CheckoutProvider';

const BillingAddressScreen = () => {
    const { checkout } = useCheckout();

    if (!checkout || checkout.lines.length === 0) {
        return <View>
            <Text>Panier Vide</Text>
        </View>
    }

    return <PaddedView>
        <BillingAddressForm  />
    </PaddedView>
}



export default BillingAddressScreen