import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { AttributeFilterFragment, OrderDirection, ProductFilterInput, ProductOrderField } from "@/saleor/api.generated";

import { getFilterOptions, getPillsData, parseQueryAttributeFilters, serializeQueryAttributeFilters, UrlFilter } from "./attributes";
import { FilterDropdown } from "./FilterDropdown";
import { FilterPill, FilterPills } from "./FilterPills";
import { ProductCollection } from "@/components/ProductCollection";
import SortingDropdown from "./SortingDropdown";
import StockToggle from "./StockToggle";
import { UrlSorting } from "./sorting";
import FilterBar from "./FilterBar";
import ProductFilterBottomSheet from "./ProductFilterBottomSheet";

export interface FilteredProductListProps {
  attributeFiltersData: AttributeFilterFragment[];
  collectionIDs?: string[];
  categoryIDs?: string[];
}

export function FilteredProductList({ attributeFiltersData, collectionIDs, categoryIDs }: FilteredProductListProps) {
  const [filters, setFilters] = useState<UrlFilter[]>([]);
  const [sortBy, setSortBy] = useState<UrlSorting | null>(null);
  const [inStock, setInStock] = useState<boolean>(false);
  const [productsFilter, setProductsFilter] = useState<ProductFilterInput>();
  const [itemsCounter, setItemsCounter] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const pills: FilterPill[] = getPillsData(filters, attributeFiltersData);

  useEffect(() => {
    setProductsFilter({
      attributes: filters.filter((filter) => filter.values?.length),
      ...(categoryIDs?.length && { categories: categoryIDs }),
      ...(collectionIDs?.length && { collections: collectionIDs }),
      ...(inStock && { stockAvailability: "IN_STOCK" }),
    });
  }, [inStock, JSON.stringify(filters), categoryIDs, collectionIDs]);

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
      console.log(existingFilter)
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
    <ScrollView style={styles.container}>

      
      <View style={styles.filterContainer}>
    
   
        {/*  <StockToggle enabled={inStock} onChange={(value: boolean) => setInStock(value)} /> */}
      </View>

      {/* {pills.length > 0 && <FilterPills pills={pills} onClearFilters={clearFilters} onRemoveAttribute={removeAttributeFilter} />} */}
      <FilterBar openFilters={() => setFilterOpen(true)} />
      <ProductCollection 
      filter={productsFilter} 
      sortBy={sortBy || undefined} 
      setCounter={setItemsCounter} 
      itemsCounter={itemsCounter}
      />
    </ScrollView>
    <ProductFilterBottomSheet onClose={() => setFilterOpen(false)} open={filterOpen} onApply={(data) => {
                    setFilterOpen(false)
                }} 
                attributeFiltersData = {attributeFiltersData}
                addAttributeFilter={addAttributeFilter}
                pills={pills}
                clearFilters={clearFilters}
                removeAttributeFilter={removeAttributeFilter}
                setSortBy={setSortBy}
                sortBy={sortBy}
                itemsCounter={itemsCounter}
    />
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
