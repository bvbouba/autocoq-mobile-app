import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { getConfig } from "../config";
import { CategoryPathFragment, ProductFragment, useSearchProductsLazyQuery } from "../saleor/api.generated";
import {
    handleErrors
} from "./checkout";
import { useCarFilter } from "./useCarFilterContext";

interface ProductsContextModel {
    products: ProductFragment[] | undefined;
    selectedCategories: CategoryPathFragment[],
    loaded: boolean | undefined;
    loading: boolean | undefined;
    search: (searchString: string) => void;
    setCategoryFilters: (categories: CategoryPathFragment[]) => void
}

const ProductsContext = createContext<ProductsContextModel>({
    products: undefined,
    selectedCategories: [],
    loading: undefined,
    loaded: undefined,
    search: () => { },
    setCategoryFilters: () => { },
});

export const useProductContext = () => useContext(ProductsContext);

export const ProductsProvider: FC<PropsWithChildren> = ({ children }) => {
    const [products, setProducts] = useState<ProductFragment[] | undefined>(undefined);
    const {selectedCar,isFiltered} = useCarFilter()
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [categoryFilters, setCategoryFilters] = useState<CategoryPathFragment[]>([]);
    const [searchProducts, searchProductsStatus] = useSearchProductsLazyQuery();

    const loading = searchProductsStatus.loading
    const loaded = searchProductsStatus.called
    const variables= {
        channel: getConfig().channel,
        search: searchQuery,
        categories: categoryFilters.map(cat => cat.id),
        ...(selectedCar && isFiltered
            ? {
                  ...(selectedCar?.year && { carYear: [selectedCar?.year.id] }), 
                  ...(selectedCar?.make && { carMake: [selectedCar?.make.id] }), 
                  ...(selectedCar?.model && { carModel: [selectedCar?.model.id] }),
                  ...(selectedCar?.engine && { carEngine: [selectedCar?.engine.id] }),
              }
            : {})
    }
    useEffect(() => {
        searchProducts({
            variables
        }).then(result => {
            handleErrors(result);
            if (result.data?.products?.edges) {
                setProducts(result.data?.products?.edges.map(edge => edge.node))
            } else {
                setProducts([])
            }

        });
    }, [searchQuery, categoryFilters,selectedCar,isFiltered??false]);

    return (
        <ProductsContext.Provider value={{
            search: setSearchQuery,
            setCategoryFilters: (cats) => {
                setCategoryFilters(cats)
            },
            products,
            selectedCategories: categoryFilters,
            loading: loading,
            loaded
        }}>
            {children}
        </ProductsContext.Provider>
    );
};
