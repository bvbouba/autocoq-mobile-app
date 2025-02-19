import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useCategoryBySlugQuery, useFilteringAttributesQuery, useProductListByCategoryQuery } from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import FilteredProductList from "@/components/productList/FilteredProductList";
import NotFoundScreen from "../+not-found";
import ProductCollectionSkeleton from "@/components/skeletons/ProductCollection";
import { useMessage } from "@/context/MessageContext";



const CategoryProductScreen = () => {
  const pathname = usePathname();
  const [slug, setSlug] = useState<string>();
  const { showMessage } = useMessage();

  const { data, loading: categoryLoading,error } = useCategoryBySlugQuery({
    skip: !slug,
    variables: {
      slug: slug || ""
    }
  })
  const categoryID = data?.category?.id
  const { data: attributeData, loading: attributeLoading, error:attributeError } = useFilteringAttributesQuery({
    skip: !categoryID,
    variables: {
      filter: {
        inCategory: categoryID,
      },
      channel: "ci",
    }
  })

  useEffect(() => {
    if (pathname.includes("categories")) {
      setSlug(pathname.split("/").pop());
    }
  }, [pathname]);

  if (!slug) return null;

  const category = data?.category
  const attributes = mapEdgesToItems(attributeData?.attributes)

  if (categoryLoading || attributeLoading) return <ProductCollectionSkeleton />
  
  if(error || (attributeError && attributeError.message)) {
    showMessage("Échec réseau")
  }

  if (!category) {
    return <NotFoundScreen />;
  }

  

  return <SafeAreaView style={{ flex: 1 }}>
    <FilteredProductList
      attributeFiltersData={attributes}
      categoryIDs={[category?.id]}
      loading={categoryLoading || attributeLoading}
    />

  </SafeAreaView>
}

export default CategoryProductScreen

