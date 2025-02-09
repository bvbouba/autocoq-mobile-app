import { useRouter } from "expo-router";
import { FC } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useCartContext } from "../../context/useCartContext";
import { fonts, Text, View } from "../Themed";
import { usePaymentContext } from "@/context/usePaymentContext";
import BillingAddress from "./BillingAddress";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import for payment icon

const PaymentMethodSelector: FC = () => {
  const { cart } = useCartContext();
  const { chosenGateway } = usePaymentContext();
  const router = useRouter();

  const paymentMethods = cart?.availablePaymentGateways || [];
  const paymentMethod = paymentMethods.find((p) => p.id === chosenGateway);

  // Check if no payment method is selected
  const isPaymentSelected = !!paymentMethod;
  const borderColor = isPaymentSelected ? "black" : "red";

  return (
    <View>
      <View style={styles.titleWrapper}>
        <Text style={styles.paymentMethodTitle}>Payment Method</Text>
      </View>
      <Pressable onPress={() => router.push("/paymentMethods")}>
        <View style={[styles.paymentMethodWrapper, { borderColor }]}>
          <View style={styles.titleWrapper}>
            {isPaymentSelected ? (
            <View style={{
                flexDirection:"row",
                alignItems:"center"
            }}>
            {paymentMethod?.id === "cash.on.delivery" && (
                  <MaterialCommunityIcons
                    name="cash"
                    size={30}
                    color="green"
                  />
                )}
              <Text style={styles.paymentMethodValue} numberOfLines={1}>
                {paymentMethod?.name}
              </Text>
              </View>
            ) : (
              <Text style={[styles.paymentMethodSummary, { color: "red" }]}>
                Please select a payment method
              </Text>
            )}
          </View>
          {isPaymentSelected && <BillingAddress />}
        </View>
      </Pressable>
    </View>
  );
};

export default PaymentMethodSelector;

const styles = StyleSheet.create({
  paymentMethodWrapper: {
    borderRadius: 5,
    margin: 8,
    borderWidth: 1,
    padding: 10,
  },
  icon: {
    marginTop: 5,
    marginRight: 5,
  },
  titleWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 5,
  },
  paymentMethodValue: {
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 16,
    fontWeight: "500",
    flexDirection: "row",
    alignItems: "center",
    fontSize:fonts.h2
  },
  paymentMethodTitle: {
    fontWeight: "bold",
    padding: 8,
    marginTop: 8,
    marginLeft: 8,
    fontSize:fonts.h2,
  },
  paymentMethodSummary: {
    overflow: "hidden",
    fontStyle: "italic",
    marginTop: 8,
    marginLeft: 16,
    marginBottom: 16,
  },
});
