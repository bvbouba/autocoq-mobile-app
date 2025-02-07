import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ProductVariantFragment, ShippingMethodFragment } from "@/saleor/api.generated";
import { convertMoneyToString } from "@/utils/convertMoneytoString";
import RichText from "./RichText";
import { formatDuration } from "@/utils/dateformat";

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
  const [selectedOption, setSelectedOption] = useState("pickup");
  const availableShippingMethods = variant?.availableShippingMethods || [];

  // Helper function to fetch a shipping method by ID
  const getShippingMethodById = (shippingId: string) => {
    return availableShippingMethods.find(method =>
      method.metadata.some(meta => meta.key === "id" && meta.value === shippingId)
    );
  };

  if (!availableShippingMethods.length) return null;

  // Get shipping methods
  const pickup = getShippingMethodById("pickup");
  const sameDay = getShippingMethodById("same-day");
  const homeDelivery = getShippingMethodById("home-delivery");

  // Calculate time difference from now to 20:00 (8 PM)
  const currentTime = new Date();
  const targetTime = new Date();
  targetTime.setHours(20, 0, 0, 0);
  const diffMs = Math.max(targetTime.getTime() - currentTime.getTime(), 0);

  
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toLocaleDateString("fr", { weekday: "long", month: "long", day: "numeric" });
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
      description: homeDelivery.description?.replace("{{orderValue}}", convertMoneyToString(homeDelivery?.maximumOrderPrice) )
        .replace("{{time}}", formatDuration("fr", diffMs))
        .replace("{{date}}", formattedDate),
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
                  fontSize: 12,
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
