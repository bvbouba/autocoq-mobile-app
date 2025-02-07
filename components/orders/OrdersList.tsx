import { StyleSheet, ActivityIndicator, View } from "react-native";
import { useOrderContext } from "../../context/useOrderContext";
import { Text } from "../Themed";
import OrderListItem from "./OrderListItem";
import { useAuth } from "@/lib/providers/authProvider";
import { useOrdersQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import { useState, useEffect } from "react";
import Loading from "../Loading";

const OrdersList = () => {
    const { authenticated, token, checkAndRefreshToken } = useAuth();
    const { orders: localOrders } = useOrderContext();

    const [isValidatingToken, setIsValidatingToken] = useState(true);

    // Correction : Définir isValidatingToken à false si non authentifié
    useEffect(() => {
        if (!authenticated) {
            setIsValidatingToken(false);
        }
    }, [authenticated]);

    const { data: ordersCollection, loading, error } = useOrdersQuery({
        skip: !authenticated,
        fetchPolicy: "network-only",
        context: {
            headers: {
                authorization: token ? `Bearer ${token}` : "",
            },
        },
        onCompleted: () => {
            setIsValidatingToken(false);
        },
        onError: async (error) => {
            if (error.message.includes("Signature has expired")) {
                await checkAndRefreshToken();
            }
            setIsValidatingToken(false);
        },
    });
    
    if (loading || isValidatingToken) {
        <Loading />
    }

    if (error) {
        return <Text style={styles.errorText}>Erreur : {error.message}</Text>;
    }

    const dbOrders = mapEdgesToItems(ordersCollection?.me?.orders);

    // Combiner les commandes locales avec celles récupérées et les trier
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
