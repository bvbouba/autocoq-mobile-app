import { useLocalSearchParams } from "expo-router";
import FilteredProductList from "@/components/productList/FilteredProductList";

const ProductsResults = () => {
    const { q: searchQueryString } = useLocalSearchParams();
    
    return <FilteredProductList searchQueryString={searchQueryString as string} />
}

export default ProductsResults