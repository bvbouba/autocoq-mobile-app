import React from "react";
import {  Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors, fonts } from "./Themed";
import { useModal } from "@/context/useModal";
import { useCheckout } from "@/context/CheckoutProvider";
import { ZoneList } from "./ZoneList";

const ZoneSelector: React.FC = () => {
  const { delivery } = useCheckout();
  const { openModal } = useModal();


  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        openModal(
          "shipping",
          <ZoneList />,true
        )
      }
    >
      <FontAwesome name="map-marker" size={24} color={colors.warning} />
      <Text style={styles.text}>
        {delivery.zone
          ? `Zone sélectionnée: ${delivery.zone}`
          : "Choisissez votre zone pour voir les options de livraison"}
      </Text>
    </TouchableOpacity>
  );
};

export default ZoneSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: fonts.caption,
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },

});
