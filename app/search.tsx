import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import FilteredProductList from "@/components/productList/FilteredProductList";

const ProductsResults = () => {
    const { q: searchQueryString } = useLocalSearchParams();
    
    return <SafeAreaView style={{ flex: 1 }}>
    <FilteredProductList searchQueryString={searchQueryString as string} />
</SafeAreaView>
}

export default ProductsResults