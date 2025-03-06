import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { useCategoryBySlugQuery } from "@/saleor/api.generated";
import FilteredProductList from "@/components/productList/FilteredProductList";
import NotFoundScreen from "../+not-found";
import { useMessage } from "@/context/MessageContext";
import { useLoading } from "@/context/LoadingContext";



const CategoryProductScreen = () => {
  const pathname = usePathname();
  const [slug, setSlug] = useState<string>();
  const { showMessage } = useMessage();
  const {setLoading} = useLoading()

  const { data, loading,error } = useCategoryBySlugQuery({
    skip: !slug,
    variables: {
      slug: slug || ""
    }
  })

  useEffect(()=>{
   setLoading(loading)
  },[loading])
 
  useEffect(() => {
    if (pathname.includes("categories")) {
      setSlug(pathname.split("/").pop());
    }
  }, [pathname]);

  if (!slug) return null;

  const category = data?.category
  
  if(error) {
    showMessage("Échec réseau")
  }

  if (!category) {
    return <NotFoundScreen />;
  }

  

  return <SafeAreaView style={{ flex: 1 }}>
    <FilteredProductList
      categoryIDs={[category?.id]}
    />

  </SafeAreaView>
}

export default CategoryProductScreen

