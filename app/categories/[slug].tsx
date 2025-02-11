import { useLocalSearchParams, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import ProductsScreen from "@/components/products/ProductsScreen";
import { SafeAreaView,StyleSheet } from "react-native";
import { useCategoryBySlugQuery, useFilteringAttributesQuery, useProductListByCategoryQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import Loading from "@/components/Loading";
import FilteredProductList from "@/components/productList/FilteredProductList";
import NotFoundScreen from "../+not-found";
import CarFilterModal from "@/components/car/Modal";
import { useCarFilter } from "@/context/useCarFilterContext";


const CategoryProductScreen = () => {
    const pathname = usePathname();
    const [slug, setSlug] = useState<string>();
     const {data, loading} = useCategoryBySlugQuery({
      skip:!slug,
      variables:{
        slug:slug||""
      }
    })
    const categoryID = data?.category?.id
    const {data:attributeData,loading:attributeLoading} = useFilteringAttributesQuery({
      skip:!categoryID,
        variables:{
          filter: {
            inCategory: categoryID,
          },
          channel:"ci",
        }
    })

    useEffect(() => {
        if (pathname.includes("categories")) {
            setSlug(pathname.split("/").pop());
        }
    }, [pathname]);

    if (!slug) return null;

    if (loading || attributeLoading) {
        return (
          <Loading />
        );
      }
   
    const category = data?.category
    const attributes = mapEdgesToItems(attributeData?.attributes)

    if (!category) {
      return <NotFoundScreen />;
    }

    return <SafeAreaView style={{ flex: 1 }}>
         <FilteredProductList
            attributeFiltersData={attributes}
            categoryIDs={[category?.id]}
          />
                
</SafeAreaView>
}

export default CategoryProductScreen
