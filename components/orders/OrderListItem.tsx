import { FC } from "react";
import { OrderFragment } from "../../saleor/api.generated";
import { PaddedView, Text, View } from "../Themed";
import { StyleSheet, Pressable } from "react-native";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { getStatusBackgroundColor, getStatusLabel } from "@/utils/status";


interface Props {
  order: OrderFragment;
}

const OrderListItem: FC<Props> = ({ order }) => {
  const router = useRouter();
  const onPress = () => router.push("/orderDetails/" + order.id);

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
        {/* Add order date below the status */}
        <View style={styles.dateWrapper}>
          <Text style={styles.dateLabel}>Ordered on</Text>
          <Text style={styles.dateText}>{new Date(order.created).toLocaleDateString()}</Text>
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
    color: "black",
  },
  dateWrapper: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 12,
    color: "#555",
    marginRight: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#000",
  },
});
