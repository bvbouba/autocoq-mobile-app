import { FC } from "react";
import { Pressable, StyleSheet, TouchableOpacity,Image } from "react-native";
import { useCheckout } from "@/context/CheckoutProvider";
import { fonts, Text, View } from "@/components/Themed";
import BillingAddress from "./BillingAddress";
import { useModal } from "@/context/useModal";
import PaymentMethods from "@/app/paymentMethods";


const codImage = require("../../assets/images/cod.png");


const PaymentMethodSelector: FC = () => {
  const { checkout,chosenGateway } = useCheckout();
  const { openModal } = useModal();

  const paymentMethods = checkout?.availablePaymentGateways || [];
  const paymentMethod = paymentMethods.find((p) => p.id === chosenGateway);

  // Vérifier si aucune méthode de paiement n'est sélectionnée
  const isPaymentSelected = !!paymentMethod;
  const borderColor = isPaymentSelected ? "black" : "red";

  return (
    <View>
      <View style={styles.titleWrapper}>
        <Text style={styles.paymentMethodTitle}>Mode de paiement</Text>
      </View>
      <Pressable onPress={() => openModal({type:"PaymentMethod", content:<PaymentMethods />
  }
    )}>
        <View style={[styles.paymentMethodWrapper, { borderColor }]}>
          <View style={styles.titleWrapper}>
            {isPaymentSelected ? (
              <View style={{
                flexDirection: "row",
                alignItems: "center"
              }}>
                {paymentMethod?.id === "cash.on.delivery" && (
                   <Image source={codImage} style={styles.tinyIcon} resizeMode="contain" />
                )}
                <Text style={styles.paymentMethodValue} numberOfLines={1}>
                  {paymentMethod?.name}
                </Text>
              </View>
            ) : (
              <TouchableOpacity onPress={() =>
                openModal({
                  type:"PaymentMethod",
                  content: <PaymentMethods />
                })}
              >
                <Text style={[styles.paymentMethodSummary, { color: "red" }]}>
                  Veuillez sélectionner un mode de paiement
                </Text>
              </TouchableOpacity>
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
    fontSize: fonts.h2
  },
  paymentMethodTitle: {
    fontWeight: "bold",
    padding: 8,
    marginTop: 8,
    marginLeft: 8,
    fontSize: fonts.h2,
  },
  paymentMethodSummary: {
    overflow: "hidden",
    fontStyle: "italic",
    marginTop: 8,
    marginLeft: 16,
    marginBottom: 16,
  },
  tinyIcon: {
    width: 100,
    height: 100,
    resizeMode: "stretch",
  },
});
