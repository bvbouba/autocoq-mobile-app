import { usePathname } from "expo-router";
import ProductDetails from "@/components/products/ProductDetails"
import { useGetProductByIdQuery } from "@/saleor/api.generated";
import { StyleSheet } from "react-native"
import { getConfig } from "@/config";
import { View } from "@/components/Themed"
import ProductDetailsSkeleton from "@/components/skeletons/ProductDetails";
import { useMessage } from "@/context/MessageContext";

const ProductDetailsId = () => {
    const pathname = usePathname();
    const productId = pathname.split("/")[pathname.split("/").length - 1]
    const {showMessage} = useMessage()

    const { data, called,loading, error } = useGetProductByIdQuery({
        variables: {
            id: productId,
            channel: getConfig().channel,
        }
    })

if(loading) return <ProductDetailsSkeleton />

    if(error) {
        showMessage("Échec réseau")
        console.log(error.message)
      }
    
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