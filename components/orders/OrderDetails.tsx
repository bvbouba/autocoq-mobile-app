import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { fonts, Text } from "@/components/Themed";
import OrderContent from "@/components/orders/OrderContent";
import {  useGetOrderByIdQuery } from "@/saleor/api.generated";
import OrderDetailsSkeleton from "@/components/skeletons/OrderDetails"

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

export const DetailsCommande = ({ orderId }: { orderId: string | undefined}) => {

    const { data, loading: loading } = useGetOrderByIdQuery({
        skip: !orderId,
        variables: { id: orderId || ""},
    });
    
    const order = data?.order
  
    if (loading) {
        return <OrderDetailsSkeleton />;
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
