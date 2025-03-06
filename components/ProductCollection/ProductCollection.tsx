import React, { useEffect, useState } from "react";
import {
  OrderDirection,
  ProductCardFragment,
  ProductCollectionQueryVariables,
  ProductFilterInput,
  ProductOrderField,
  useProductCollectionQuery,
} from "@/saleor/api.generated";
import { mapEdgesToItems } from "@/utils/map";
import ProductListItem from "../products/ProductListItem";
import { SafeAreaView, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { colors, fonts, PaddedView, Text, View } from './../Themed';
import { useCarFilter } from "@/context/useCarFilterContext";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import ProductListItemSkeleton from "../skeletons/ProductListItem";
import { useMessage } from "@/context/MessageContext";

export interface ProductCollectionProps {
  filter?: ProductFilterInput;
  sortBy?: {
    field: ProductOrderField;
    direction?: OrderDirection;
  };
  allowMore?: boolean;
  perPage?: number;
  setCounter?: (value: number) => void;
  itemsCounter?: number;
  loading?:boolean;
  setIDs: React.Dispatch<React.SetStateAction<string[]>>}

export const ProductCollection: React.FC<ProductCollectionProps> = ({
  filter,
  sortBy,
  setCounter,
  allowMore = true,
  perPage = 12,
  itemsCounter = 0,
  setIDs
}) => {

  const { selectedCar } = useCarFilter()
  const router = useRouter()
  const {showMessage} = useMessage()


  const variables: ProductCollectionQueryVariables = {
    filter: {
      ...filter,
      ...(selectedCar && {
        ...(selectedCar.year && { carYear: [selectedCar.year.id] }),
        ...(selectedCar.make && { carMake: [selectedCar.make.id] }),
        ...(selectedCar.model && { carModel: [selectedCar.model.id] }),
        ...(selectedCar.engine && { carEngine: [selectedCar.engine.id] }),
        ...(selectedCar.variant && { carVariant: [selectedCar.variant.id] }),
      }),
    },
    first: perPage,
    channel: "ci",
    ...(sortBy?.field && sortBy?.direction && {
      sortBy: { direction: sortBy.direction, field: sortBy.field },
    }),
  };
  
  const { loading, error, data, fetchMore } = useProductCollectionQuery({ variables });
  
  const [allProducts, setAllProducts] = useState<ProductCardFragment[] | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(false);
  
  useEffect(() => {
    if (setCounter) setCounter(data?.products?.totalCount || 0);
  }, [setCounter, data?.products?.totalCount]);
  
  useEffect(() => {
    if (data?.products?.edges) {
      setAllProducts(mapEdgesToItems(data.products));
      setHasNextPage(data.products.pageInfo.hasNextPage);
    }
  }, [data]);
  
  useEffect(() => {
    if (allProducts) {
      const productIDs = allProducts
        .map(product => product.category?.id)
        .filter((id): id is string => id !== undefined); 
      
      const uniqueProductIDs = [...new Set(productIDs)];
      
      setIDs(uniqueProductIDs);
    }
  }, [allProducts]);

  const onLoadMore = async () => {
    if (!hasNextPage) return;
  
    try {
      const result = await fetchMore({ variables: { after: pageInfo?.endCursor } });
  
      if (result.data?.products?.edges) {
        const newProducts = mapEdgesToItems(result.data.products);
  
        // Avoid duplicates using Set
        setAllProducts((prev) => {
          if (!prev) return []
          const existingSlugs = new Set(prev?.map((p) => p.slug));
          return [...prev, ...newProducts.filter((p) => !existingSlugs.has(p.slug))];
        });
  
        setHasNextPage(result.data.products.pageInfo.hasNextPage);
      }
    } catch (error) {
      console.error("❌ Error fetching more:", error);
      showMessage("Erreur");
    }
  };
  
  const pageInfo = data?.products?.pageInfo;
  
  if (loading)
    return (
      <View style={{ padding: 10 }}>
        {[...Array(perPage)].map((_, index) => (
          <ProductListItemSkeleton key={index} />
        ))}
      </View>
    );
  
  if (error) showMessage("Échec réseau");
  
  return (
    <SafeAreaView style={styles.container} testID="prod-list-safe">
      <Animated.FlatList
        data={allProducts}
        keyExtractor={(item, index) => `${item.slug}-${index}`} // Ensure unique keys
        renderItem={({ item }) => <ProductListItem product={item} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={
          <View style={{ flexDirection: "column" }}>
            {<View style={styles.header}>
              <Text style={{ fontWeight: "bold", fontSize: fonts.caption }}>{itemsCounter}</Text>
              <Text style={{ fontSize: fonts.caption }}>
                {itemsCounter < 2 ? " Résultat" : " Résultats"}{" "}
                {filter?.search && (
                  <>
                    {" pour "}
                    <Text style={{ fontWeight: "bold" }}>{filter.search}</Text>
                  </>
                )}
              </Text>
            </View>}
  
            {allProducts && !allProducts.length && (
              <View style={styles.noProductsContainer} testID="prod-list-safe">
                <PaddedView style={styles.noProductsTextWrapper}>
                  <Text style={styles.noProductsText}>
                    Désolé, aucun produit n'a été trouvé. Essayez d'ajuster vos filtres pour voir les résultats.
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => router.push("/")}
                    style={{
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: colors.secondary,
                    }}
                  >
                    <Text>CONTINUER</Text>
                  </Button>
                </PaddedView>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          allowMore && hasNextPage ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white"
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
    alignItems: "center",
    gap: 20,
  },
  noProductsText: {
    textAlign: "center",
    fontSize: fonts.caption
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default ProductCollection;
