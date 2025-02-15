import { usePathname } from "expo-router";
import ProductDetails from "@/components/products/ProductDetails"
import { useGetProductByIdQuery } from "@/saleor/api.generated";
import { StyleSheet } from "react-native"
import { getConfig } from "@/config";
import {Text, View } from "@/components/Themed"

const ProductDetailsId = () => {
    const pathname = usePathname();
    const productId = pathname.split("/")[pathname.split("/").length - 1]

    const { data, called,loading } = useGetProductByIdQuery({
        variables: {
            id: productId,
            channel: getConfig().channel,
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