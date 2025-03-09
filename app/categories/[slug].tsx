import { usePathname } from "expo-router";
import { SafeAreaView } from "react-native";
import { useCategoryBySlugQuery } from "@/saleor/api.generated";
import FilteredProductList from "@/components/productList/FilteredProductList";
import NotFoundScreen from "../+not-found";
import { useMessage } from "@/context/MessageContext";
import { useLoading } from "@/context/LoadingContext";
import { useEffect } from "react";

const CategoryProductScreen = () => {
  const pathname = usePathname();
  const { showMessage } = useMessage();
  const { setLoading } = useLoading();

  // Extract slug directly
  const slug = pathname.includes("categories") ? pathname.split("/").pop() : undefined;

  const { data, loading, error } = useCategoryBySlugQuery({
    skip: !slug,
    variables: { slug: slug || "" },
  });

  useEffect(()=>{
    setLoading(loading);
  },[loading])
 

  if (loading) return null; // Avoid rendering NotFoundScreen too early

  if (error) {
    showMessage("Échec réseau");
    return null;
  }

  const category = data?.category;

  if (!category) {
    return <NotFoundScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FilteredProductList categoryIDs={[category.id]} />
    </SafeAreaView>
  );
};

export default CategoryProductScreen;
