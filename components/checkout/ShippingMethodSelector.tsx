import { useRouter } from "expo-router";
import { FC } from "react";
import { Pressable, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useCheckout } from "@/context/CheckoutProvider";
import { Text, View, colors, fonts } from "@/components/Themed"
import { convertMoneyToString } from "@/utils/convertMoneytoString";
import { useModal } from "@/context/useModal";
import ShippingMethods from "@/app/shippingMethods";


const ShippingMethodSelector: FC = () => {
  const { checkout ,delivery} = useCheckout();
  const { openModal } = useModal()
  const shippingMethods = checkout && checkout.shippingMethods;
  const deliveryMethod = shippingMethods?.find((s) => s.id === delivery.methodId);

  // Calculate the estimated delivery date
  const getEstimatedDeliveryDate = (maxDays: number | undefined) => {

    if (maxDays === undefined) return "";

    if (maxDays === 0) {
      return "Aujourd'hui"; // If delivery is today
    }

    const today = new Date();
    today.setDate(today.getDate() + maxDays);

    return today.toLocaleDateString("fr", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  const estimatedDate = getEstimatedDeliveryDate(deliveryMethod?.maximumDeliveryDays || 0);

  if (deliveryMethod) {
    return (
      <Pressable onPress={() => {
        openModal({
          id:"ShippingMethod",
          content:<ShippingMethods />,
          height:"130%",
        })
      }}>
        <View style={styles.shippingMethodWrapper}>
          <View style={styles.titleWrapper}>
            {<Text style={styles.shippingMethodTitle}>
            Méthode de livraison
            </Text>}
            <TouchableOpacity onPress={() => {
              openModal({
                id:"ShippingMethod",
                content:<ShippingMethods />,
                height:"130%",
              })
            }}>
              <Text style={styles.icon}>Modifier</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.titleWrapper}>
            {<Text style={styles.shippingMethodTitle}>{deliveryMethod?.name}
              {(deliveryMethod?.price.amount !== 0) && `- ${convertMoneyToString(
                deliveryMethod?.price)}`}
            </Text>}
            <TouchableOpacity onPress={() => {
              openModal({
                id:"ShippingMethod",
                content:<ShippingMethods />,
                height:"130%",
              })
            }}>
            </TouchableOpacity>
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.shippingMethodValue} numberOfLines={1}>
              Arrivée prévue {estimatedDate}
            </Text>
          </View>
          <View style={{
            flexDirection: "column"
          }}>
            {checkout?.lines.map(line =>
              <Image
                key={line.id}
                style={styles.tinyLogo}
                source={{
                  uri: line.variant.product.thumbnail?.url
                }}
                resizeMode="contain"
              />
            )

            }
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={() => openModal({
      id:"ShippingMethod",
      content:<ShippingMethods />,
      height:"130%",
    })}>
      <View style={styles.shippingMethodWrapper}>
        <View style={styles.titleWrapper}>
          <Text style={styles.shippingMethodTitle}>Méthode de livraison</Text>
          {/* <IconButton
            icon="chevron-down"
            onPress={() => router.push("/shippingMethods")}
            style={styles.icon}
          /> */}
        </View>
        <View style={styles.titleWrapper}>
          <Text style={[styles.shippingMethodSummary, { color: "red" }]}>
           Veuillez sélectionner un mode de livraison
          </Text>
        </View>
      </View>
    </Pressable>
    
  );
};

export default ShippingMethodSelector;

const styles = StyleSheet.create({
  shippingMethodWrapper: {
    borderRadius: 5,
    margin: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginTop: 5,
    fontSize: fonts.body,
    textDecorationLine: "underline",
  },
  titleWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "inherit",
    fontSize: fonts.caption
  },
  shippingMethodValue: {
    overflow: "hidden",
    color: colors.textSecondary,
    fontSize: fonts.body,
    width: 300,
    marginLeft: 16,
  },
  shippingMethodTitle: {
    fontWeight: "bold",
    padding: 8,
    marginTop: 8,
    marginLeft: 0,
  },
  shippingMethodSummary: {
    overflow: "hidden",
    fontStyle: "italic",
    marginTop: 8,
    marginLeft: 16,
    marginBottom: 16,
  },
  tinyLogo: {
    marginVertical: 10,
    width: 50,
    height: 50,
  },
});
