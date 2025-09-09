import { usePathname } from "expo-router";
import ProductDetails from "@/components/products/ProductDetails"
import { useGetProductByIdQuery } from "@/saleor/api.generated";
import { getConfig } from "@/config";
import { View } from "@/components/Themed"
import ProductDetailsSkeleton from "@/components/skeletons/ProductDetails";
import { useMessage } from "@/context/MessageContext";
import { useEffect } from "react";

const ProductDetailsId = () => {
    const pathname = usePathname();
    const productId = pathname.split("/").pop() ?? "";
    const {showMessage} = useMessage()

    const { data, called,loading, error } = useGetProductByIdQuery({
        variables: {
            id: productId,
            channel: getConfig().channel,
        },
        skip: !productId,
    })

    useEffect(() => {
      if (error) {
        showMessage("Échec réseau");
      }
    }, [error, showMessage]);

    if(loading) return <ProductDetailsSkeleton />

    
    if (called && data?.product) {
        return <View style={{ flex: 1 }}>
            <ProductDetails product={data.product} />
        </View>
    }
    return <></>
}

export default ProductDetailsId