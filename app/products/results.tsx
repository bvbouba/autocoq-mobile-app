import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { ProductFilterInput } from "@/saleor/api.generated";
import ProductCollection from "@/components/ProductCollection/ProductCollection";

const ProductsResults = () => {
    const { search: searchQueryString } = useLocalSearchParams();
    
    const [filter, setFilter] = useState<ProductFilterInput>();
    useEffect(() => {
        if (searchQueryString) {
            setFilter({ search: searchQueryString as string})
        } else {
            setFilter({})
        }
    }, [searchQueryString])
    return <SafeAreaView style={{ flex: 1 }}>
    <ProductCollection filter={filter}/>
</SafeAreaView>
}

export default ProductsResults