import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors, Divider, fonts, PaddedView } from "@/components/Themed"; // Assurez-vous que vous avez bien défini les couleurs ou remplacez-les par des couleurs statiques
import { useCheckout } from "@/context/CheckoutProvider";
import { convertMoneyToString } from "@/utils/convertMoneytoString";
import { useRouter } from "expo-router";
import { useModal } from "@/context/useModal";

const AddedToCart: React.FC = () => {
  const { checkout } = useCheckout();
  const router = useRouter();
  const { closeModal } = useModal();

  return (
    <PaddedView>
      {/* Message de succès */}
      <View style={styles.successMessage}>
        <FontAwesome name="check-circle" size={24} color={colors.success} />
        <Text style={styles.successText}>Ajouté au panier !</Text>
      </View>
      <Divider />

      {/* Liste des produits */}
      <FlatList
        data={checkout?.lines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productRow}>
            <Text style={styles.productName}>{item.variant.name}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Image
                style={styles.tinyLogo}
                source={{
                  uri: item.variant.product.thumbnail?.url,
                }}
                resizeMode="contain"
              />
              <View>
                <Text> Qté : {item.quantity} </Text>
                <Text style={styles.price}>{convertMoneyToString(item.totalPrice.gross)}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* Sous-total du panier */}
      <Text style={styles.subtotal}>Sous-total du panier : {convertMoneyToString(checkout?.subtotalPrice.gross)}</Text>
      <Divider />

      {/* Bouton Voir le panier & Commander */}
      <TouchableOpacity style={styles.checkoutButton} onPress={() =>{ 
        closeModal("CartPreview")
        router.push("/cart")}
        }>
        <Text style={styles.checkoutText}>VOIR LE PANIER ET COMMANDER</Text>
      </TouchableOpacity>

      {/* Lien Continuer vos achats */}
      <TouchableOpacity onPress={() => closeModal("CartPreview")}>
        <Text style={styles.continueShopping}>Continuer vos achats</Text>
      </TouchableOpacity>
    </PaddedView>
  );
};

export default AddedToCart;

const styles = StyleSheet.create({
  successMessage: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  successText: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginLeft: 8,
    color: colors.textPrimary,
  },
  productRow: {
    flexDirection: "column",
    marginVertical: 5,
    gap: 5,
  },
  price: {
    fontWeight: "bold",
    color: colors.textPrimary || "#000",
    fontSize: fonts.h2,
  },
  productName: {
    flex: 1,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: fonts.caption,
  },
  subtotal: {
    fontSize: fonts.caption,
    fontWeight: "bold",
    marginVertical: 10,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  checkoutText: {
    color: "white",
    fontWeight: "bold",
  },
  continueShopping: {
    marginTop: 15,
    color: colors.secondary || "blue",
    textAlign: "center",
    fontSize: fonts.body,
    textDecorationLine: "underline",
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});
