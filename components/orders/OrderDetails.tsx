import { Link, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text } from "../../components/Themed";
import OrderContent from "../../components/orders/OrderContent";
import { useOrderContext } from "../../context/useOrderContext";
import { useEffect, useState } from "react";
import { OrderFragment, useGetOrderByIdQuery } from "../../saleor/api.generated";
import { useCartContext } from "../../context/useCartContext";
import { useAuth } from "@/lib/providers/authProvider";

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
    const { orderSuccess } = useLocalSearchParams();
    const { removeCart } = useCartContext();
    const { authenticated } = useAuth();
    const { orders } = useOrderContext();

    const [order, setOrder] = useState<OrderFragment | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const { data, loading: dbLoading } = useGetOrderByIdQuery({
        variables: { id: orderId },
        skip: !authenticated || !orderId,
    });

    useEffect(() => {
        setLoading(true);

        if (authenticated && data?.order) {
            setOrder(data?.order);
        } else {
            const cachedOrder = orders.find((o) => o.id === orderId);
            setOrder(cachedOrder);
        }

        setLoading(false);
    }, [authenticated, data, orders]);

    useEffect(() => {
        if (orderSuccess && !authenticated) {
            removeCart();
        }
    }, [orderSuccess]);

    if (loading || dbLoading) {
        return <View style={styles.container}><Text>Chargement...</Text></View>;
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
        fontSize: 20,
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: "#2e78b7",
    },
});

export default DetailsCommande;
