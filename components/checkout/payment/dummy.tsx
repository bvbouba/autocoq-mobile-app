import { useCartContext } from "@/context/useCartContext";
import { usePaymentContext } from "@/context/usePaymentContext";
import { Alert } from "react-native";
import { Button } from "react-native-paper";

export const dummyGatewayId = "dummy"
const DummyPayment = () => {
    const { cart } = useCartContext();
    const { chosenGateway } = usePaymentContext();
    const buyNowEnabled = cart?.email && cart?.billingAddress && (cart?.isShippingRequired ? cart?.shippingAddress : true)  && (cart.deliveryMethod) && (chosenGateway)

    const buyNow = () => {
        if (!buyNowEnabled) {
            Alert.alert("Please fill in required information to contiue");
            return
        }
    }

    return (
        <Button 
            mode="contained" 
            onPress={buyNow}
        >
            Buy Now
        </Button>
    );
};

export default DummyPayment;