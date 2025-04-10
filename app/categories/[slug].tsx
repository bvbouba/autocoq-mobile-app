import { usePathname } from "expo-router";
import { SafeAreaView } from "react-native";
import { useCategoryBySlugQuery } from "@/saleor/api.generated";
import FilteredProductList from "@/components/productList/FilteredProductList";
import NotFoundScreen from "../+not-found";
import { useMessage } from "@/context/MessageContext";
import { useLoading } from "@/context/LoadingContext";
import { useEffect, useState } from "react";

const CategoryProductScreen = () => {
  const pathname = usePathname();
  const { showMessage } = useMessage();
  const { setLoading } = useLoading();
  const [categoryID,setCategoryID] = useState<string | undefined>()
 

  useEffect(() => {
    setCategoryID(pathname.includes("categories") ? pathname.split("/").pop() : undefined)
  }, []);

  if (!categoryID) {
    return <NotFoundScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FilteredProductList categoryIDs={[categoryID]} />
    </SafeAreaView>
  );
};

export default CategoryProductScreen;
