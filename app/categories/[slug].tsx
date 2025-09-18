import { usePathname } from "expo-router";
import FilteredProductList from "@/components/productList/FilteredProductList";
import NotFoundScreen from "../+not-found";
import { useEffect, useState } from "react";

const CategoryProductScreen = () => {
  const pathname = usePathname();
  const [categoryID,setCategoryID] = useState<string | undefined>()
 

  useEffect(() => {
    setCategoryID(pathname.includes("categories") ? pathname.split("/").pop() : undefined)
  }, []);

  if (!categoryID) {
    return <NotFoundScreen />;
  }

  return (<FilteredProductList categoryIDs={[categoryID]} />
  );
};

export default CategoryProductScreen;
