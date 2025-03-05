import  { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useCheckout } from "@/context/CheckoutProvider";
import {  Divider, fonts, PaddedView } from "../Themed";
import { useModal } from "@/context/useModal";
import { IconButton, } from "react-native-paper";
import PromoCodeForm from "./PromoCodeForm";
import { useCheckoutRemovePromoCodeMutation } from "@/saleor/api.generated";
import { useLoading } from "@/context/LoadingContext";

const promoImage = require("../../assets/images/PromoCard.png");

const PromoCode = () => {
  const { checkout } = useCheckout();
  const [checkoutRemovePromoCode] = useCheckoutRemovePromoCodeMutation();
  const { openModal } = useModal();
  const {setLoading} = useLoading()

  const onDelete = async () => {
    try {
       setLoading(true)
      const {data} = await checkoutRemovePromoCode({
        variables:{
               checkoutId:checkout?.id,
               promoCode:checkout?.voucherCode,
        }
      });
      
    } catch (error) {
      console.error(error)
    }finally{
      setLoading(false)
    }
    
	};

  return (
    <>
            <PaddedView>
      {(!checkout?.discount?.amount) ? (
          <TouchableOpacity
            style={styles.promoContainer}
            onPress={() =>
              openModal({
               id:"PromoCode",
                 content:<PromoCodeForm />,
                 height:"130%"
              })
            }
          >
            <View style={styles.promoContent}>
              <Image source={promoImage} style={styles.tinyIcon} resizeMode="contain" />
              <Text style={styles.promoText}>Code de réduction</Text>
            </View>
            <IconButton icon="chevron-right" style={styles.icon} />
          </TouchableOpacity>
      ): 
      <> <TouchableOpacity style={{
        flexDirection:"row",
        alignItems:"center"
      }} 
      
      onPress={async ()=>await onDelete()}>
        <Image source={promoImage} style={styles.tinyIcon} resizeMode="contain" />
        <Text style={{
          paddingLeft:10,
          textDecorationLine:"underline",
        }}>
        Supprimer le code promo
        </Text>
        <IconButton icon="close"  />
        </TouchableOpacity></>
    }
            </PaddedView>
            <Divider style={{ borderBottomWidth: 10 }} /> 

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
