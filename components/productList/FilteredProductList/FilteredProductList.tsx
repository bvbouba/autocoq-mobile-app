import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { AttributeFilterFragment, ProductFilterInput,} from "@/saleor/api.generated";

import {  getPillsData,  UrlFilter } from "./attributes";
import FilterPills, { FilterPill, } from "./FilterPills";
import { ProductCollection } from "@/components/ProductCollection";
import { UrlSorting } from "./sorting";
import FilterBar from "./FilterBar";
import ProductFilterBottomSheet from "./ProductFilterBottomSheet";
import { useModal } from "@/context/useModal";

export interface FilteredProductListProps {
  attributeFiltersData: AttributeFilterFragment[];
  collectionIDs?: string[];
  categoryIDs?: string[];
  IDs:string[];
  loading?:boolean;
}

export function FilteredProductList({ attributeFiltersData, collectionIDs, categoryIDs,IDs,loading }: FilteredProductListProps) {
  const [filters, setFilters] = useState<UrlFilter[]>([]);
  const [sortBy, setSortBy] = useState<UrlSorting | null>(null);
  const [inStock, setInStock] = useState<boolean>(false);
  const [productsFilter, setProductsFilter] = useState<ProductFilterInput>();
  const [itemsCounter, setItemsCounter] = useState(0);
  const {openModal} = useModal()
  

  const pills: FilterPill[] = getPillsData(filters, attributeFiltersData);

  useEffect(() => {
    setProductsFilter((prev) => {
      const defaultFilter: ProductFilterInput = {
        attributes: [],
        categories: [],
        collections: [],
        ids:[],
        stockAvailability: undefined, // Ensure correct typing
      };
  
      return {
        ...prev ?? defaultFilter, // Ensure `prev` is at least a valid object
        attributes: filters.filter((filter) => filter.values?.length),
        categories: categoryIDs?.length ? categoryIDs : prev?.categories ?? [],
        collections: collectionIDs?.length ? collectionIDs : prev?.collections ?? [],
        ids:IDs?.length ? IDs : prev?.ids ?? [],
        stockAvailability: inStock ? "IN_STOCK" : prev?.stockAvailability ?? undefined, // Ensure correct type
      };
    });
  }, [inStock, JSON.stringify(filters), categoryIDs, collectionIDs,IDs]);

  const removeAttributeFilter = (attributeSlug: string, choiceSlug: string) => {
    const newFilters = filters.reduce((result: UrlFilter[], filter: UrlFilter) => {
      if (filter.slug !== attributeSlug) return [...result, filter];
      const newFilterValues = filter.values.filter((value) => value !== choiceSlug);
      return newFilterValues.length ? [...result, { ...filter, values: newFilterValues }] : result;
    }, []);

    setFilters(newFilters);
  };

  const addAttributeFilter = (attributeSlug: string, choiceSlug: string) => {
    const existingFilter = filters.find((filter) => filter.slug === attributeSlug);
    if (existingFilter) {
      existingFilter.values = [...existingFilter.values, choiceSlug];
      setFilters([...filters]);
    } else {
      setFilters([...filters, { slug: attributeSlug, values: [choiceSlug] }]);
    }
  };

  const clearFilters = () => {
    setFilters([]);
    setInStock(false);
  };

  if (!productsFilter) return null;

  return (
    <>
    <View style={styles.container}>

      
      <View style={styles.filterContainer}>
    
   
        {/*  <StockToggle enabled={inStock} onChange={(value: boolean) => setInStock(value)} /> */}
      </View>

      <FilterBar openFilters={() => openModal({
        id:"productFilter",
        content:<ProductFilterBottomSheet 
        attributeFiltersData = {attributeFiltersData}
        addAttributeFilter={addAttributeFilter}
        pills={pills}
        clearFilters={clearFilters}
        removeAttributeFilter={removeAttributeFilter}
        setSortBy={setSortBy}
        sortBy={sortBy}
        itemsCounter={itemsCounter}
        />,
         disableScroll:true,
         height:"120%",
         closeButtonVisible:true
      }
      )} 
      pills={pills}
      clearFilters={clearFilters}
      removeAttributeFilter={removeAttributeFilter}
      attributeFiltersData = {attributeFiltersData}
      addAttributeFilter = {addAttributeFilter}
        />
        
      <ProductCollection 
      filter={productsFilter} 
      sortBy={sortBy || undefined} 
      setCounter={setItemsCounter} 
      itemsCounter={itemsCounter}
      />
    </View>
  
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: "column",
    // paddingBottom: 10,
  },
});

export default FilteredProductList;
