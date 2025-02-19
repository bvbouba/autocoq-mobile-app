import { colors } from "@/components/Themed";
import { useCheckout } from "@/context/CheckoutProvider";
import { convertMoneyToString } from "@/utils/convertMoneytoString";
import { StyleSheet,View } from "react-native";
import { Button } from "react-native-paper";

export const dummyGatewayId = "dummy"
const DummyPayment = () => {
    const {checkout} = useCheckout()  

    return (
        <View 
        style={{
            padding:10
        }}>
        <Button 
            mode="contained" 
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