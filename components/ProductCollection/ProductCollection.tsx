import React, { useEffect, useState } from "react";
import {
  OrderDirection,
  ProductCollectionQueryVariables,
  ProductFilterInput,
  ProductFragment,
  ProductOrderField,
  useProductCollectionQuery,
} from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import ProductListItem from "../products/ProductListItem";
import { SafeAreaView, FlatList, StyleSheet, Animated, ActivityIndicator, Button } from 'react-native';
import { colors, fonts, Text, View } from './../Themed';
import Loading from "../Loading";

export interface ProductCollectionProps {
  filter?: ProductFilterInput;
  sortBy?: {
    field: ProductOrderField;
    direction?: OrderDirection;
  };
  allowMore?: boolean;
  perPage?: number;
  setCounter?: (value: number) => void;
  itemsCounter: number;
}

export const ProductCollection: React.FC<ProductCollectionProps> = ({
  filter,
  sortBy,
  setCounter,
  allowMore = true,
  perPage = 4,
  itemsCounter
}) => {
  

  const variables: ProductCollectionQueryVariables = {
    filter,
    first: perPage,
    channel: "ci",
    ...(sortBy?.field &&
      sortBy?.direction && {
        sortBy: {
          direction: sortBy.direction,
          field: sortBy.field,
        },
      }),
  };
   

  const { loading, error, data, fetchMore } = useProductCollectionQuery({ variables });

  const [allProducts, setAllProducts] = useState<ProductFragment[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (setCounter) {
      setCounter(data?.products?.totalCount || 0);
    }
  }, [setCounter, data?.products?.totalCount]);

  
  useEffect(() => {
    if (data?.products?.edges) {
      setAllProducts(mapEdgesToItems(data.products));
      setHasNextPage(data.products.pageInfo.hasNextPage)
    }
  }, [data]);
 
  const onLoadMore = async () => {
    if (!hasNextPage) {
      return;
    }
  
    try {
      const result = await fetchMore({
        variables: {
          after: pageInfo?.endCursor,
        },
      });
  
      if (result.data?.products?.edges) {
        const newProducts = mapEdgesToItems(result.data.products);
        
        // Avoid duplicates by checking slug
        setAllProducts((prev) => {
          const existingSlugs = new Set(prev.map((p) => p.slug));
          const uniqueNewProducts = newProducts.filter((p) => !existingSlugs.has(p.slug));
  
          return [...prev, ...uniqueNewProducts];
        });
  
        setHasNextPage(result.data.products.pageInfo.hasNextPage);
      }
    } catch (error) {
      console.error("❌ Error fetching more:", error);
    }
  };

  const pageInfo = data?.products?.pageInfo
  
  if (loading) return <Loading />;
  
  const products = mapEdgesToItems(data?.products);

  if (!allProducts || allProducts.length === 0) {
    return (
      <View style={styles.noProductsContainer} testID="prod-list-safe">
        <View style={styles.noProductsTextWrapper}>
          <Text style={styles.noProductsText}>Aucun produit ne correspond aux critères donnés</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} testID="prod-list-safe">
     

      <Animated.FlatList
        data={allProducts}
        keyExtractor={(item, index) => `${item.slug}-${index}`} // Ensure unique keys
        renderItem={({ item }) => <ProductListItem product={item} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={ // Add the header inside FlatList
          <View style={styles.header}>
            <Text style={{ fontWeight: "bold", fontSize: fonts.caption }}>{itemsCounter}</Text>
            <Text style={{ fontSize: fonts.caption }}>
              {itemsCounter < 2 ? " Résultat" : " Résultats"}
            </Text>
          </View>
        }
        ListFooterComponent={allowMore && hasNextPage ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : null} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor:"white"
  },
  header: {
    padding: 15,
    flexDirection: "row",
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    width: "100%",
  },
  noProductsTextWrapper: {
    marginTop: 32,
  },
  noProductsText: {
    textAlign: "center",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default ProductCollection;
