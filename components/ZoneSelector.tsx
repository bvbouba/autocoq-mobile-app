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
        openModal({
          id:"shipping",
          content:<ZoneList />,
          disableScroll:true,
          closeButtonVisible:true,
          height:"110%"
        })
      }
    >
      <FontAwesome name="map-marker" size={20} color={colors.warning} />
      <Text style={styles.text}>
  {delivery.zone ? (
    <>
      Livré à: <Text style={styles.zoneText}>{delivery.zone}</Text>
    </>
  ) : (
    "Choisissez une ville pour voir les options de livraison"
  )}
</Text>
      <Text style={[styles.text,{
            textDecorationLine: "underline",
      }]}>
        Cliquez pour changer
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
  },
  zoneText: {
    color: "green", 
    fontWeight: "bold", 
  },

});
