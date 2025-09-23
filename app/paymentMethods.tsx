import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useCheckout } from "@/context/CheckoutProvider";
import { useModal } from "@/context/useModal";
import { colors, fonts, PaddedView } from "../components/Themed";
import { useLoading } from "@/context/LoadingContext";
import { IconButton } from "react-native-paper";
import analytics from "@/lib/analytics";

const PaymentMethods = () => {
  const { checkout,setChosenGateway,chosenGateway  } = useCheckout();
  const { closeModal } = useModal();

  const paymentMethods = checkout?.availablePaymentGateways || [];

const {isLoading, setLoading} = useLoading()
  const handleSelect = async (methodId: string) => {
    setLoading(true);

    const selectedMethod = paymentMethods.find(method => method.id === methodId);

    // add_payment_info analytics event here
    if (checkout && selectedMethod) {
      analytics().logEvent('add_payment_info', {
        payment_type: selectedMethod.name,
        value: checkout.totalPrice?.gross.amount || 0,
        currency: checkout.totalPrice?.gross.currency || 'USD',
        items: checkout.lines.map(line => ({
          item_id: line?.variant.id,
          item_name: line?.variant.product.name,
          price: line?.totalPrice.gross.amount || 0,
          quantity: line?.quantity || 1,
        })),
      });
    }

    setChosenGateway(methodId);
    closeModal("PaymentMethod");
    setLoading(false);
  };

  return (
    <PaddedView style={styles.container}>
      <View style={{ alignItems: "flex-end" }}>
                  <IconButton
                    icon="close"
                    size={20}
                    onPress={() => closeModal("PaymentMethod")}
                  />
                </View>
      <Text style={styles.title}>Méthode de paiement</Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[styles.option, chosenGateway === method.id && styles.selectedOption]}
          onPress={() => handleSelect(method.id)}
          disabled={isLoading}
        >
          <Text style={styles.methodName}>{method.name}</Text>
          <View style={[styles.radio, chosenGateway === method.id && styles.radioSelected]}>
            {chosenGateway === method.id && <View style={styles.innerCircle} />}
          </View>
        </TouchableOpacity>
      ))}

    </PaddedView>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    paddingTop:50
  },
  title: {
    fontSize: fonts.h1,
    fontWeight: "bold",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedOption: {
    borderColor: colors.secondary,
  },
  methodName: {
    fontSize: fonts.caption,
    fontWeight: "bold",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
  },
  radioSelected: {
    borderColor: "black",
    backgroundColor: "black",
    width: 18,
    height: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: "white",
  },
});
