import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useCheckout } from "@/context/CheckoutProvider";
import { useModal } from "@/context/useModal";
import { colors, fonts } from "../components/Themed";
import { useLoading } from "@/context/LoadingContext";

const PaymentMethods = () => {
  const { checkout,setChosenGateway,chosenGateway  } = useCheckout();
  const { closeModal } = useModal();

  const paymentMethods = checkout?.availablePaymentGateways || [];

const {isLoading, setLoading} = useLoading()
  const handleSelect = async (methodId: string) => {
    setLoading(true);
    setChosenGateway(methodId);
    closeModal();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
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

    </View>
  );
};

export default PaymentMethods;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
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
