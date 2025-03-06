import { useEffect, useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import {
  AttributeFilterFragment,
  AttributeFilterInput,
  FilteringAttributesQuery,
  FilteringAttributesQueryDocument,
  FilteringAttributesQueryVariables,
  ProductFilterInput,
  useFilteringAttributesQuery,
} from "@/saleor/api.generated";

import { getPillsData, UrlFilter } from "./attributes";
import FilterPills, { FilterPill } from "./FilterPills";
import { ProductCollection } from "@/components/ProductCollection";
import { UrlSorting } from "./sorting";
import FilterBar from "./FilterBar";
import ProductFilterBottomSheet from "./ProductFilterBottomSheet";
import { useModal } from "@/context/useModal";
import { mapEdgesToItems } from "@/utils/map";
import { getConfig } from "@/config";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const apiUrl = getConfig().saleorApi;

export interface FilteredProductListProps {
  collectionIDs?: string[];
  categoryIDs?: string[];
  searchQueryString?: string;
  loading?: boolean;
}

export function FilteredProductList({ collectionIDs, categoryIDs, searchQueryString }: FilteredProductListProps) {
  const [filters, setFilters] = useState<UrlFilter[]>([]);
  const [sortBy, setSortBy] = useState<UrlSorting | null>(null);
  const [inStock, setInStock] = useState<boolean>(false);
  const [productsFilter, setProductsFilter] = useState<ProductFilterInput>();
  const [itemsCounter, setItemsCounter] = useState(0);
  const [IDs, setIDs] = useState<string[]>([]);
  const { openModal } = useModal();
  const [attributes, setAttributes] = useState<AttributeFilterFragment[]>([]);

  // Memoize Apollo Client to prevent re-creating on each render
  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri: apiUrl,
        cache: new InMemoryCache(),
      }),
    []
  );

  // Define filtering attributes based on available category or collection
  const attributeFilterCondition: AttributeFilterInput = useMemo(() => {
    if (categoryIDs?.length) return { inCategory: categoryIDs[0] };
    if (collectionIDs?.length) return { inCollection: collectionIDs[0] };
    return {};
  }, [categoryIDs, collectionIDs]);

  const { data: attributeData } = useFilteringAttributesQuery({
    skip: Object.keys(attributeFilterCondition).length === 0,
    variables: {
      filter: attributeFilterCondition,
      channel: "ci",
    },
  });

  // Fetch attributes for multiple categories asynchronously
  useEffect(() => {
    if (!searchQueryString || !IDs.length) return;

    const fetchAttributesForCategories = async () => {
      try {
        const responses = await Promise.all(
          IDs.map((categoryID) =>
            apolloClient.query<FilteringAttributesQuery, FilteringAttributesQueryVariables>({
              query: FilteringAttributesQueryDocument,
              variables: { filter: { inCategory: categoryID }, channel: "ci" },
            })
          )
        );

        const mergedResults = responses.flatMap((response) => mapEdgesToItems(response.data?.attributes));
        setAttributes(mergedResults);
      } catch (err) {
        console.error("Error fetching attributes for categories", err);
      }
    };

    fetchAttributesForCategories();
  }, [searchQueryString, IDs, apolloClient]);

  // Sync fetched attributes from query
  useEffect(() => {
    if (attributeData?.attributes) {
      setAttributes(mapEdgesToItems(attributeData.attributes));
    }
  }, [attributeData]);

  // Compute pills data
  const pills: FilterPill[] = useMemo(() => getPillsData(filters, attributes), [filters, attributes]);

  // Update products filter whenever relevant dependencies change
  useEffect(() => {
    setProductsFilter((prev) => ({
      attributes: filters.filter((filter) => filter.values?.length),
      categories: categoryIDs?.length ? categoryIDs : prev?.categories ?? [],
      collections: collectionIDs?.length ? collectionIDs : prev?.collections ?? [],
      search: searchQueryString || prev?.search,
      stockAvailability: inStock ? "IN_STOCK" : prev?.stockAvailability,
    }));
  }, [filters, categoryIDs, collectionIDs, searchQueryString, inStock]);

  const updateFilters = (attributeSlug: string, choiceSlug: string, action: "add" | "remove") => {
    setFilters((prevFilters) =>
      action === "add"
        ? prevFilters.some((filter) => filter.slug === attributeSlug)
          ? prevFilters.map((filter) =>
              filter.slug === attributeSlug ? { ...filter, values: [...filter.values, choiceSlug] } : filter
            )
          : [...prevFilters, { slug: attributeSlug, values: [choiceSlug] }]
        : prevFilters.reduce<UrlFilter[]>((acc, filter) => {
            if (filter.slug !== attributeSlug) return [...acc, filter];
            const newValues = filter.values.filter((value) => value !== choiceSlug);
            return newValues.length ? [...acc, { ...filter, values: newValues }] : acc;
          }, [])
    );
  };

  const clearFilters = () => {
    setFilters([]);
    setInStock(false);
  };

  if (!productsFilter) return null;

  return (
    <View style={styles.container}>
      <FilterBar
        openFilters={() =>
          openModal({
            id: "productFilter",
            content: (
              <ProductFilterBottomSheet
                attributeFiltersData={attributes}
                addAttributeFilter={(slug, value) => updateFilters(slug, value, "add")}
                removeAttributeFilter={(slug, value) => updateFilters(slug, value, "remove")}
                pills={pills}
                clearFilters={clearFilters}
                setSortBy={setSortBy}
                sortBy={sortBy}
                itemsCounter={itemsCounter}
              />
            ),
            disableScroll: true,
            height: "120%",
            closeButtonVisible: true,
          })
        }
        pills={pills}
        clearFilters={clearFilters}
        attributeFiltersData={attributes}
        addAttributeFilter={(slug, value) => updateFilters(slug, value, "add")}
        removeAttributeFilter={(slug, value) => updateFilters(slug, value, "remove")}
      />

      <ProductCollection
        filter={productsFilter}
        sortBy={sortBy || undefined}
        setCounter={setItemsCounter}
        itemsCounter={itemsCounter}
        setIDs={setIDs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FilteredProductList;
