import { colors } from "@/components/Themed";
import { useCartContext } from "@/context/useCartContext";
import { usePaymentContext } from "@/context/usePaymentContext";
import { convertMoneyToString } from "@/utils/convertMoneytoString";
import { Alert,StyleSheet,View } from "react-native";
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
        <View 
        style={{
            padding:10
        }}>
        <Button 
            mode="contained" 
            onPress={buyNow}
            style={styles.submitButton}
            labelStyle={styles.submitButtonText}
            disabled={true}
        >
            {`COMPLETE PURCHASE ${convertMoneyToString(cart?.totalPrice.gross)}`}
        </Button>
        </View>
    );
};

const styles = StyleSheet.create({
submitButton: {
    backgroundColor: colors.background,
    marginHorizontal: 10,
    borderRadius:5,
    padding:5
  },
  submitButtonText: {
    fontWeight:"bold",
    color: colors.secondary, 
  },
})

export default DummyPayment;