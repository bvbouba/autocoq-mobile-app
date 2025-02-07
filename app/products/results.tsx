import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import ProductsScreen from "../../components/products/ProductsScreen";
import { useProductContext } from "../../context/useProductContext";
import { SafeAreaView } from "react-native";

const ProductsResults = () => {
    const { search: searchQueryString } = useLocalSearchParams();
    const { search } = useProductContext();
    useEffect(() => {
        if (searchQueryString) {
            search(searchQueryString as string)
        } else {
            search("" as string)
        }
    }, [searchQueryString])

    return <SafeAreaView style={{ flex: 1 }}>
    <ProductsScreen />
</SafeAreaView>
}

export default ProductsResults