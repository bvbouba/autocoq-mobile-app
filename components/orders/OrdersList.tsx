import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useOrderContext } from "../../context/useOrderContext";
import { Text } from "../Themed";
import OrderListItem from "./OrderListItem";
import { useAuth } from "@/lib/providers/authProvider";
import { useOrdersQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";

const OrdersList = () => {
    const { authenticated, token } = useAuth();
    const { orders: localOrders } = useOrderContext();
    const { data: ordersCollection, loading, error,
        // fetchMore
     } = useOrdersQuery({
        skip: !authenticated,
        context: {
            headers: {
                authorization: token ? `Bearer ${token}` : "",
            },
        },
    });


    // Orders from database (only for authenticated users)
    const dbOrders = authenticated ? mapEdgesToItems(ordersCollection?.me?.orders) : [];

    const uniqueOrders = Array.from(
        new Map([...localOrders, ...dbOrders].map(order => [order.id, order])).values()
    ).sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    

    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" />;
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error.message}</Text>;
    }

    if (!uniqueOrders.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.noOrdersText}>No Orders Found</Text>
            </View>
        );
    }

    // const onLoadMore = () => {
    //     fetchMore({
    //       variables: {
    //         after: ordersCollection?.me?.orders?.pageInfo.endCursor,
    //       },
    //     });
    //   };

    return (
        <>
            {uniqueOrders.map((order) => (
                <OrderListItem order={order} key={order.id} />
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noOrdersText: {
        fontSize: 14,
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default OrdersList;
