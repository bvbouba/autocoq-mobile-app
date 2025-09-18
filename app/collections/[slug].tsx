import {  usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { useCollectionBySlugQuery} from "@/saleor/api.generated";
import FilteredProductList from "@/components/productList/FilteredProductList";
import NotFoundScreen from "../+not-found";
import { useMessage } from "@/context/MessageContext";
// import { useLoading } from "@/context/LoadingContext";



const CollectionProductScreen = () => {
    const pathname = usePathname();
    const [slug, setSlug] = useState<string>();
    const { showMessage } = useMessage();
    // const {setLoading} = useLoading()

     const {data, loading, error} = useCollectionBySlugQuery({
      skip:!slug,
      variables:{
        slug:slug||""
      }
    })

    // useEffect(()=>{
    //   setLoading(loading)
    //  },[loading])
    
 
    useEffect(() => {
        if (pathname.includes("collections")) {
            setSlug(pathname.split("/").pop());
        }
    }, [pathname]);

    if (!slug) return null;
    
      if(error) {
        showMessage("Échec réseau")
      }

    const collection = data?.collection

    if (!collection) {
      return <NotFoundScreen />;
    }

    return <FilteredProductList
            collectionIDs={[collection?.id]}
          />
                
}

export default CollectionProductScreen
