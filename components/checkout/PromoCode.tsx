import  { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useCheckout } from "@/context/CheckoutProvider";
import {  fonts, PaddedView } from "../Themed";
import { useModal } from "@/context/useModal";
import { IconButton, } from "react-native-paper";
import PromoCodeForm from "./PromoCodeForm";

const promoImage = require("../../assets/images/PromoCard.png");

const PromoCode = () => {
  const { checkout } = useCheckout();
  const [editPromoCode, setEditPromoCode] = useState(false);
  const { openModal } = useModal();

  return (
    <>
      {(editPromoCode || !checkout?.discount?.amount) && (
        <PaddedView>
          <TouchableOpacity
            style={styles.promoContainer}
            onPress={() =>
              openModal(
                "checkout",
                 <PromoCodeForm setEditPromoCode={setEditPromoCode}/>
              )
            }
          >
            <View style={styles.promoContent}>
              <Image source={promoImage} style={styles.tinyIcon} resizeMode="contain" />
              <Text style={styles.promoText}>Code de réduction</Text>
            </View>
            <IconButton icon="chevron-right" style={styles.icon} />
          </TouchableOpacity>
        </PaddedView>
      )}
    </>
  );
};


export default PromoCode;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  promoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  promoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  promoText: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginLeft: 5
  },
  tinyIcon: {
    width: 50,
    height: 35,
    resizeMode: "stretch",
  },
  icon: {
    marginTop: 0,
    marginRight: 5,
  },
});
