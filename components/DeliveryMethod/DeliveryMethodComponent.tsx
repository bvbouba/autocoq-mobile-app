import { convertMoneyToString } from "@/utils/convertMoneytoString";
import { formatDuration } from "@/utils/dateformat";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity, StyleSheet } from "react-native";
import { View, Text } from "react-native";
import RichText from "../RichText";
import { colors, fonts } from "../Themed";
import { ShippingMethodFragment } from "@/saleor/api.generated";
import { RadioButton } from "react-native-paper";
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
}
export const DeliveryMethodComponent = ({availableShippingMethods,selectedOption,handleSelect}:props) => {

  const { delivery} = useCheckout();
  const deliveryMethod = availableShippingMethods?.find((s) => s.id === delivery.methodId);

  // Calculate time difference from now to 20:00 (8 PM)
  const targetTime = new Date();
  targetTime.setHours(20, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Options List
  const options: OptionProps[] = availableShippingMethods
    .map((method) => {
      if (method.metadata.some((m) => m.key === "id" && m.value === "pickup")) {
        return {
          id: "pickup",
          methodId: method.id,
          title: method.name,
          description: method.description,
          icon: "shopping-bag",
        };
      }

      if (method.metadata.some((m) => m.key === "id" && m.value === "same-day")) {
        return {
          id: "sameDay",
          methodId: method.id,
          title: method.name,
          description: method.description?.replace(
            "{{price}}",
            convertMoneyToString(method?.price)
          ),
          icon: "clock-o",
        };
      }

      if (
        method.metadata.some(
          (m) => m.key === "id" && ["home-delivery", "home-delivery-free"].includes(m.value)
        )
      ) {
        const currentTime = new Date();
        const targetTime = new Date();
        targetTime.setHours(20, 0, 0, 0);
        const diffMs = Math.max(targetTime.getTime() - currentTime.getTime(), 0);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDate = tomorrow.toLocaleDateString("fr", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });

        return {
          id: "homeDelivery",
          methodId: method.id,
          title: method.name,
          description: method.description
            ?.replace("{{orderValue}}", convertMoneyToString(method?.maximumOrderPrice))
            .replace("{{time}}", formatDuration("fr", diffMs))
            .replace("{{date}}", formattedDate),
          icon: "truck",
        };
      }

      return null;
    })
    .filter(Boolean) as OptionProps[];

  const effectiveSelected = selectedOption || deliveryMethod?.id;


  return (
    <View style={styles.container}>
    {options.map(option => (
      <TouchableOpacity
        key={option.methodId}
        style={[
          styles.option,
          effectiveSelected === option.methodId && styles.selectedOption,
        ]}
        onPress={() => handleSelect(option.methodId)}
      >
        <View style={styles.optionContent}>
          <View style={styles.iconTextContainer}>
            <FontAwesome
              name={option.icon}
              size={20}
              color={colors.textSecondary}
            />
            <View>
              <Text style={[styles.title]}>{option.title}</Text>
              <RichText
                jsonStringData={option.description}
                stylesOverride={{
                  paragraph: {
                    fontSize: fonts.sm,
                    lineHeight: 20,
                    color: colors.textSecondary,
                  },
                }}
              />
            </View>
          </View>
          <View
            style={[
              styles.radio,
              effectiveSelected === option.methodId && styles.radioSelected,
            ]}
          >
            {effectiveSelected === option.methodId && (
              <View style={styles.innerCircle} />
            )}
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
      padding: 10,
      borderWidth: 1,
      borderColor:colors.border,
      borderRadius: 5,
      marginBottom: 10,
      minHeight:80

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

