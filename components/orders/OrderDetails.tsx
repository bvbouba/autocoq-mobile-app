import { Link, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { fonts, Text } from "@/components/Themed";
import OrderContent from "@/components/orders/OrderContent";
import { useOrderContext } from "@/context/useOrderContext";
import { useEffect, useState } from "react";
import { OrderFragment, useGetOrderByIdQuery } from "@/saleor/api.generated";
import { useAuth } from "@/lib/providers/authProvider";
import Loading from "../Loading";

const EcranNonTrouve = () => {
    return (
        <>
            <Stack.Screen options={{ title: "Oups !" }} />
            <View style={styles.container}>
                <Text style={styles.title}>Cette commande n'existe pas.</Text>
                <Link href="/" style={styles.link}>
                    <Text style={styles.linkText}>Aller à l'écran d'accueil !</Text>
                </Link>
            </View>
        </>
    );
};

export const DetailsCommande = ({ orderId }: { orderId: string }) => {
    const { authenticated } = useAuth();
    const { orders } = useOrderContext();

    const [order, setOrder] = useState<OrderFragment | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const { data, loading: dbLoading } = useGetOrderByIdQuery({
        variables: { id: orderId },
        skip: !authenticated || !orderId,
    });

    useEffect(() => {
        if (!authenticated || !orderId) {
            setLoading(false);
            return;
        }

        // First, check cached order
        const cachedOrder = orders.find((o) => o.id === orderId);
        if (cachedOrder) {
            setOrder(cachedOrder);
            setLoading(false);
            return;
        }

        // If not in cache, wait for DB query
        if (data?.order) {
            setOrder(data.order);
            setLoading(false);
        }
    }, [authenticated, data, orders, orderId]);

    if (loading || dbLoading) {
        return <Loading />;
    }

    if (!order) {
        return <EcranNonTrouve />;
    }

    return <OrderContent order={order} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: fonts.h2,
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: fonts.body,
        color: "#2e78b7",
    },
});

export default DetailsCommande;
