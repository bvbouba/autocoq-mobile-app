import { StyleSheet, View } from "react-native";
import { useOrderContext } from "@/context/useOrderContext";
import { fonts, Text } from "@/components/Themed";
import OrderListItem from "./OrderListItem";
import { useAuth } from "@/lib/providers/authProvider";
import { useOrdersQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

const OrdersList = () => {
    const { authenticated, token } = useAuth();
    const { orders: localOrders,loading:loadingOrders } = useOrderContext();
    // const [isValidatingToken, setIsValidatingToken] = useState(true);

    // useEffect(() => {
    //     if (!authenticated) {
    //         setIsValidatingToken(false);
    //     }
    // }, [authenticated]);

    const { data: ordersCollection, loading, error } = useOrdersQuery({
        skip: !authenticated,
        fetchPolicy: "network-only",
        context: {
            headers: {
                authorization: token ? `Bearer ${token}` : "",
            },
        },
        onCompleted: () => {
            // setIsValidatingToken(false);
        },
        onError: async (error) => {
            console.error("Order query error:", error);
        },
    });

    if (loading || loadingOrders 
        // || isValidatingToken
    ) {
        return (
            <View style={styles.container}>
                {[...Array(5)].map((_, index) => (
                    <MotiView key={index} style={styles.skeletonItem}>
                        <Skeleton colorMode="light" height={20} width="60%" />
                        <View style={styles.skeletonText}>
                        <Skeleton colorMode="light" height={15} width="40%"  />
                        </View>
                        <Skeleton colorMode="light" height={20} width="30%" />
                    </MotiView>
                ))}
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>Erreur : {error.message}</Text>;
    }

    const dbOrders = mapEdgesToItems(ordersCollection?.me?.orders);
    const uniqueOrders = Array.from(
        new Map([...localOrders, ...dbOrders].map(order => [order.id, order])).values()
    ).sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    if (!uniqueOrders.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.noOrdersText}>Aucune commande trouvée</Text>
            </View>
        );
    }
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
    skeletonItem: {
        width: "90%",
        backgroundColor: "#f0f0f0",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    skeletonText: {
        marginVertical: 5,
    },
    noOrdersText: {
        fontSize: fonts.body,
        marginBottom: 20,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default OrdersList;
