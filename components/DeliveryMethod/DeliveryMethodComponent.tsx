import { convertMoneyToString } from "@/utils/convertMoneytoString";
import { formatDuration } from "@/utils/dateformat";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity, StyleSheet } from "react-native";
import { View, Text } from "react-native";
import RichText from "../RichText";
import { colors, fonts } from "../Themed";
import { ShippingMethodFragment } from "@/saleor/api.generated";
import { useCheckout } from "@/context/CheckoutProvider";

type IconType = "shopping-bag" | "clock-o" | "truck";

interface OptionProps {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  methodId:string;
}
interface props {
    availableShippingMethods:ShippingMethodFragment[];
    selectedOption: string;
    handleSelect: (id: string) => void;
    isAvailable?:boolean
}
export const DeliveryMethodComponent = ({availableShippingMethods,selectedOption,handleSelect,isAvailable}:props) => {
  const getShippingMethodById = (shippingId: string) => {
        return availableShippingMethods?.find(method =>
          method.metadata.some(meta => meta.key === "id" && meta.value === shippingId)
        );
      };  

  const pickup = getShippingMethodById("pickup");
  const sameDay = getShippingMethodById("same-day");
  const homeDelivery = getShippingMethodById("home-delivery") || getShippingMethodById("home-delivery-free");

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
      methodId:pickup.id,
      title: pickup.name,
      description: pickup.description,
      icon: "shopping-bag",
    },
    sameDay && {
      id: "sameDay",
      methodId:sameDay.id,
      title: sameDay.name,
      description: sameDay.description?.replace("{{price}}", convertMoneyToString(sameDay?.price)),
      icon: "clock-o",
    },
    homeDelivery && {
      id: "homeDelivery",
      methodId:homeDelivery.id,
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
        <TouchableOpacity
          key={option.methodId}
          style={[styles.option,
            !isAvailable && {
              backgroundColor:colors.background
            }
            , selectedOption === option.methodId && styles.selectedOption]}
          onPress={() => handleSelect(option.methodId)}
          disabled={!isAvailable}
        >
          <View style={styles.optionContent}>
            <View style={styles.iconTextContainer}>
              <FontAwesome name={option.icon} size={20} color={isAvailable ? "black" : colors.textSecondary} />
              <View>
                <Text style={[styles.title, !isAvailable && {
                  color:colors.textSecondary
                }]}>{option.title}</Text>
                <RichText jsonStringData={option.description} stylesOverride={{
                  paragraph:{
                  fontSize:fonts.sm,
                  lineHeight: 20,
                  color:isAvailable ? "black" :colors.textSecondary
                  }
                }}/>
              </View>
            </View>
            <View style={[styles.radio, 
              !isAvailable && {borderColor:colors.textSecondary},
              selectedOption === option.methodId && styles.radioSelected]} >
              
              {(selectedOption === option.methodId) && <View style={styles.innerCircle} />}
              </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default DeliveryMethodComponent;

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
    },
    option: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 5,
      borderWidth: 1,
      borderColor:colors.border,
      borderRadius: 5,
      marginBottom: 5,
    },
    selectedOption: {
      borderColor: colors.secondary,
    },
    optionContent: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },
    iconTextContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      width: "80%",
    },
    title: {
      fontSize:fonts.caption,
      fontWeight: "bold",
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
      width: 18,  // Adjust size
      height: 18, 
      borderRadius: 12, // Makes it a circle
      alignItems: "center",
      justifyContent: "center", 
    },
    
    innerCircle: {
      width: 12,  // Smaller size for inner circle
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
      borderWidth:2,
      borderColor:"white"
    },
  });

