import {  usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { useCollectionBySlugQuery, useFilteringAttributesQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import Loading from "@/components/Loading";
import FilteredProductList from "@/components/productList/FilteredProductList";
import NotFoundScreen from "../+not-found";
import ProductCollectionSkeleton from "@/components/skeletons/ProductCollection";



const CollectionProductScreen = () => {
    const pathname = usePathname();
    const [slug, setSlug] = useState<string>();
     const {data, loading} = useCollectionBySlugQuery({
      skip:!slug,
      variables:{
        slug:slug||""
      }
    })
    const collectionID = data?.collection?.id
    const {data:attributeData,loading:attributeLoading} = useFilteringAttributesQuery({
      skip:!collectionID,
        variables:{
          filter: {
            inCollection: collectionID,
          },
          channel:"ci",
        }
    })

    useEffect(() => {
        if (pathname.includes("collections")) {
            setSlug(pathname.split("/").pop());
        }
    }, [pathname]);

    if (!slug) return null;

    if (loading || attributeLoading) {
        return (
          <ProductCollectionSkeleton />
        );
      }
   
    const collection = data?.collection
    const attributes = mapEdgesToItems(attributeData?.attributes)

    if (!collection) {
      return <NotFoundScreen />;
    }

    return <SafeAreaView style={{ flex: 1 }}>
         <FilteredProductList
            attributeFiltersData={attributes}
            collectionIDs={[collection?.id]}
          />
                
</SafeAreaView>
}

export default CollectionProductScreen
