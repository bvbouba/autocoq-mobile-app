import { useLocalSearchParams, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import ProductsScreen from "../../components/products/ProductsScreen";
import { SafeAreaView,StyleSheet } from "react-native";
import { useProductListByCategoryQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import Loading from "@/components/Loading";


const CategoryProductScreen = () => {
    const pathname = usePathname();
    const [slug, setSlug] = useState<string>();
    const {data,loading} = useProductListByCategoryQuery({
        skip: !slug,
        variables:{
            channel:"ci",
            slug:slug||""
        }
    })

    useEffect(() => {
        if (pathname.includes("categories")) {
            setSlug(pathname.split("/").pop());
        }
    }, [pathname]);

    if (!slug) return null;

    if (loading) {
        return (
          <Loading />
        );
      }

    const products = mapEdgesToItems(data?.category?.products)

    return <SafeAreaView style={{ flex: 1 }}>
    <ProductsScreen products={products} />
</SafeAreaView>
}

export default CategoryProductScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },

  });