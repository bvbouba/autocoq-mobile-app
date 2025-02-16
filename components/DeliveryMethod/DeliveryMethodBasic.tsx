import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ProductVariantFragment, useGetAvailableShippingMethodsQuery } from "@/saleor/api.generated";
import { convertMoneyToString } from "@/utils/convertMoneytoString";
import {colors, Text, View } from "@/components/Themed"
import { useCheckout } from "@/context/CheckoutProvider";
import { ActivityIndicator } from "react-native-paper";
import ZoneSelector from "../ZoneSelector";
import { Skeleton } from "moti/skeleton";

type IconType = "shopping-bag" | "clock-o" | "truck";

interface OptionProps {
  id: string;
  title: string;
  description: string;
  icon: IconType;
}

interface Props {
  variant?: ProductVariantFragment | null;
}



const DeliveryMethodBasic = ({ variant }: Props) => {
  const {delivery:{zone},checkout} = useCheckout()
  const subtotalPrice = checkout?.subtotalPrice.gross

  const {data,loading} = useGetAvailableShippingMethodsQuery({
    skip:!zone,
    variables:{
      id:variant?.id || "",
      zoneName:zone,
       orderPrice: (subtotalPrice
    ? { currency: subtotalPrice.currency, amount: subtotalPrice.amount }
    : undefined)
    }
  })

  if (loading) return (
    <Skeleton height={40} width="100%" radius={8} colorMode="light" />
    );
  

  const availableShippingMethods = data?.productVariant?.availableShippingMethods
  // Helper function to fetch a shipping method by ID
  const getShippingMethodById = (shippingId: string) => {
    if(!availableShippingMethods) return
    return availableShippingMethods.find(method =>
      method.metadata.some(meta => meta.key === "id" && meta.value === shippingId)
    );
  };

  if (!availableShippingMethods?.length) return <ZoneSelector />;

  

  // Get shipping methods
  const pickup = getShippingMethodById("pickup");
  const sameDay = getShippingMethodById("same-day");
  const homeDelivery = getShippingMethodById("home-delivery") || getShippingMethodById("home-delivery-free") ;

  // Calculate time difference from now to 20:00 (8 PM)
  const currentTime = new Date();
  const targetTime = new Date();
  targetTime.setHours(20, 0, 0, 0);
  const diffMs = Math.max(targetTime.getTime() - currentTime.getTime(), 0);

  
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Options List
  const options: OptionProps[] = [
    pickup && {
      id: "pickup",
      title: pickup.name,
      description: pickup.description,
      icon: "shopping-bag",
    },
    sameDay && {
      id: "sameDay",
      title: sameDay.name,
      description: sameDay.description?.replace("{{price}}", convertMoneyToString(sameDay?.price)),
      icon: "clock-o",
    },
    homeDelivery && {
      id: "homeDelivery",
      title: homeDelivery.name,
      description: homeDelivery.description,
      icon: "truck",
    },
  ].filter(Boolean) as OptionProps[];

  return (
    <View style={styles.container}>
      {options.map(option => (
     
          <View key={option.id} style={styles.optionContent}>
            <View style={styles.iconTextContainer}>
              <FontAwesome name={option.icon} size={15} color="black" />
              <View>
                <Text style={styles.title}>{option.title}</Text>
                {/* <RichText jsonStringData={option.description} stylesOverride={{
                  paragraph:{
                  fontSize:fonts.caption,
                  lineHeight: 20,
                  }
                }}/> */}
              </View>
            </View>
          </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#fff",
    gap:2
  },
  
  optionContent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom:5

  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  title: {
    fontSize: 11,
    fontWeight: "400",
  },
  description: {
    fontSize: 11,
    color: "#666",
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
  },
});

export default DeliveryMethodBasic;
