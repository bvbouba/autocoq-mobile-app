import { FC } from "react";
import { OrderFragment } from "@/saleor/api.generated";
import { fonts, PaddedView, Text, View } from "@/components/Themed";
import { StyleSheet, Pressable } from "react-native";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { getStatusBackgroundColor, getStatusLabel } from "@/utils/status";
import { getConfig } from "@/config";
import { formatDate } from "@/utils/dateformat";

interface Props {
  order: OrderFragment;
}


const OrderListItem: FC<Props> = ({ order }) => {
  const router = useRouter();
  const onPress = () => router.push(`/orders/${order.id}`);

  return (
    <Pressable onPress={onPress}>
      <PaddedView style={styles.wrapper}>
        <View style={styles.header}>
          <View>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>{formatDate(order.created)}</Text>
            </View>
            <View style={styles.dateWrapper}>
              <Text style={styles.dateLabel}>Commande {order.number}</Text>
            </View>
          </View>
          <View style={styles.statusWrapper}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusBackgroundColor(order.status) },
              ]}
            >
              <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
            </View>
            <IconButton icon="chevron-right" onPress={onPress} style={styles.icon} />
          </View>
        </View>

        {/* Sous-total */}
        <View style={styles.subtotalWrapper}>
          <Text style={styles.subtotalLabel}>
            {`Total (${order.lines.length} articles) : `}
          </Text>
          <Text style={styles.subtotalAmount}>
            {order.total.gross.amount.toLocaleString(getConfig().locale, {
              style: "currency",
              currency: order.total.gross.currency,
            })}
          </Text>
        </View>
      </PaddedView>
    </Pressable>
  );
};

export default OrderListItem;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",


  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize:fonts.h2,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 8,
  },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  statusText: {
    fontSize:fonts.body,
    color: "black",
  },
  dateWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize:fonts.caption,
    color: "#555",
    marginRight: 4,
  },
  subtotalWrapper: {
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  subtotalLabel: {
    fontSize:fonts.caption,
    color: "#333",
  },
  subtotalAmount: {
    fontSize:fonts.caption,
    fontWeight:"bold"
  },
});
