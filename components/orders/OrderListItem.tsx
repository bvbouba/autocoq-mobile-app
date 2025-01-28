import { FC } from "react";
import { OrderFragment } from "../../saleor/api.generated";
import { PaddedView, Text, View } from "../Themed";
import { StyleSheet, Pressable } from "react-native";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";

interface Props {
  order: OrderFragment;
}

const OrderListItem: FC<Props> = ({ order }) => {
  const router = useRouter();
  const onPress = () => router.push("/orderDetails/" + order.id);

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "FULFILLED":
        return "Delivered";
      case "CANCELED":
        return "Cancelled";
      case "PARTIALLY_FULFILLED":
        return "Partially Fulfilled";
      case "UNFULFILLED":
        return "Unfulfilled";
      case "UNCONFIRMED":
        return "Unconfirmed";
      case "DRAFT":
        return "Draft";
      case "PENDING":
        return "Pending";
      case "EXPIRED":
        return "Expired";
      default:
        return "Unknown";
    }
  };

  const getStatusBackgroundColor = (status: string): string => {
    switch (status) {
      case "FULFILLED":
        return "#d4edda"; // Light green
      case "CANCELED":
        return "#f8d7da"; // Light red
      case "PARTIALLY_FULFILLED":
        return "#fff3cd"; // Light yellow
      case "UNFULFILLED":
        return "#e2e3e5"; // Light gray
      case "UNCONFIRMED":
        return "#d1ecf1"; // Light blue
      case "DRAFT":
        return "#e7d8f6"; // Light purple
      case "PENDING":
        return "#fff8e1"; // Light gold
      case "EXPIRED":
        return "#fbe5d6"; // Light brown
      default:
        return "#f5f5f5"; // Default light gray
    }
  };

  return (
    <Pressable onPress={onPress}>
      <PaddedView style={styles.wrapper}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Order: #{order.number}</Text>
          <IconButton icon="chevron-right" onPress={onPress} style={styles.icon} />
        </View>
        <View style={styles.statusWrapper}>
          <Text style={styles.statusLabel}>Status: </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBackgroundColor(order.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
          </View>
        </View>
      </PaddedView>
    </Pressable>
  );
};

export default OrderListItem;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 8,
  },
  statusWrapper: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: "#555",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  statusText: {
    fontSize: 14,
    color: "black", // Text remains black
    // fontWeight: "bold",
  },
});
