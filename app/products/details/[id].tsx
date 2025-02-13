import { usePathname } from "expo-router";
import ProductDetails from "@/components/products/ProductDetails"
import { useGetProductByIdQuery } from "@/saleor/api.generated";
import { StyleSheet } from "react-native"
import { getConfig } from "@/config";
import {Text, View } from "@/components/Themed"
import { useCartContext } from "@/context/useCartContext";

const ProductDetailsId = () => {
    const pathname = usePathname();
    const {delivery,cart} = useCartContext()
    const productId = pathname.split("/")[pathname.split("/").length - 1]
    const subtotalPrice = cart?.subtotalPrice.gross

    const { data, called,loading } = useGetProductByIdQuery({
        variables: {
            id: productId,
            channel: getConfig().channel,
            zoneName: delivery?.zone || "xxxx",
            orderPrice: (subtotalPrice
                ? { currency: subtotalPrice.currency, amount: subtotalPrice.amount }
                : undefined)
        }
    })

if(loading) return <View style={styles.scrollContainer}>
                        <Text>Loading...</Text>
                    </View>
    
    if (called && data?.product) {
        return <View style={{ flex: 1 }}>
            <ProductDetails product={data.product} />
        </View>
    }
    return <></>
}

const styles = StyleSheet.create({
    scrollContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default ProductDetailsId