import { colors } from "@/components/Themed";
import { useCheckout } from "@/context/CheckoutProvider";
import { usePaymentContext } from "@/context/usePaymentContext";
import { convertMoneyToString } from "@/utils/convertMoneytoString";
import { Alert,StyleSheet,View } from "react-native";
import { Button } from "react-native-paper";

export const dummyGatewayId = "dummy"
const DummyPayment = () => {
    const { checkout } = useCheckout();
    const { chosenGateway } = usePaymentContext();
    const buyNowEnabled = checkout?.email && checkout?.billingAddress && (checkout?.isShippingRequired ? checkout?.shippingAddress : true)  && (checkout.deliveryMethod) && (chosenGateway)

    const buyNow = () => {
        if (!buyNowEnabled) {
            Alert.alert("Veuillez remplir les informations requises pour continuer");
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
            {`TERMINER L'ACHAT ${convertMoneyToString(checkout?.totalPrice.gross)}`}
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