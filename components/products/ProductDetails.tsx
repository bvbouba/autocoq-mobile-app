import React, { FC, useState } from "react";
import {
  ProductFragment,
  ProductVariantFragment,
  useFitmentByIdQuery,
} from "../../saleor/api.generated";
import {
  PaddedView,
  Text,
  View,
} from "../Themed";
import { StyleSheet } from "react-native";
import { useCartContext } from "../../context/useCartContext";
import ProductImageCarousel from "./details/ProductImageCarousel";
import { getConfig } from "../../config";
import { useRouter } from "expo-router";
import VariantSelector from "./details/VariantSelector";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";

interface Props {
  product: ProductFragment;
}

const ProductDetails: FC<Props> = ({ product }) => {
  const router = useRouter();

  const { data, loading: fitmentLoading } = useFitmentByIdQuery({
    variables: {
      productId: product.id,
    },
  });

  const carMakeRelations = data?.tenantProduct?.carMakeRelations || [];
  const carModelRelations = data?.tenantProduct?.carModelRelations || [];
  const isUniversal = data?.tenantProduct?.isUniversal;

  const { addItem, loading } = useCartContext();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantFragment>(
    product.defaultVariant as ProductVariantFragment
  );

  const price = selectedVariant?.pricing?.price?.gross.amount.toLocaleString(
    getConfig().locale,
    {
      style: "currency",
      currency: product.defaultVariant?.pricing?.price?.gross.currency,
    }
  );
    const renderDescription = () => {
    if (!product.description) return null;
  
    const parsedDescription = JSON.parse(product.description);
    const blocks = parsedDescription.blocks || [];
  
    return blocks.map((block: any) => {
      if (block.type === "list") {
        return (
          <View key={block.id} style={styles.listBlock}>
            {block.data.items.map((item: string, index: number) => (
              <Text key={index} style={styles.listItem}>
                • {item.replace(/&nbsp;/g, " ")}  {/* Replace &nbsp; with space */}
              </Text>
            ))}
          </View>
        );
      }
      // Handle other block types here if necessary
      return null;
    });
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.productTitle}>{product.name}</Text>
        <View>
          <ProductImageCarousel
            images={
              product.media?.map((m, idx) => ({ url: m.url, alt: m.alt, id: idx })) || []
            }
          />
        </View>
        <VariantSelector
          product={product}
          selectedVariant={selectedVariant}
          onSelect={setSelectedVariant}
        />

        <PaddedView style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          {renderDescription()}
        </PaddedView>

        <PaddedView>
          <Text style={styles.priceTitle}>Price</Text>
          <Text style={styles.productPrice}>{price}</Text>
          <Button
            mode="contained"
            onPress={async () => {
              await addItem(selectedVariant?.id);
              router.push("(tabs)/cart");
            }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to cart"}
          </Button>
        </PaddedView>

        {/* Fitment Information */}
        {!fitmentLoading && data && (
          <PaddedView style={styles.fitmentContainer}>
            <Text style={styles.fitmentTitle}>Fitment Information</Text>
            {isUniversal ? (
              <Text style={styles.fitmentText}>
                This product is universal and fits all vehicles.
              </Text>
            ) : (
              <>
                {carMakeRelations?.length > 0 && (
                  <View style={styles.fitmentSection}>
                    <Text style={styles.subtitle}>Compatible Makes:</Text>
                    {carMakeRelations.map((rel, index) => (
                      <View key={index} style={styles.listItem}>
                        <Text style={styles.listText}>{rel?.fitmentName}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {carModelRelations?.length > 0 && (
                  <View style={styles.fitmentSection}>
                    <Text style={styles.subtitle}>Compatible Models:</Text>
                    {carModelRelations.map((rel, index) => (
                      <View key={index} style={styles.listItem}>
                        <Text style={styles.listText}>{rel?.fitmentName}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </PaddedView>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
},
scrollView: {
    flex:1,
    flexGrow: 1, 
},
  productTitle: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    padding: 8,
  },
  productPrice: {
    textAlign: "left",
    fontSize: 20,
    marginBottom: 16,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
  },
  descriptionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  listBlock: {
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  fitmentContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  fitmentTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  fitmentText: {
    fontSize: 14,
    marginBottom: 4,
  },
  priceTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  fitmentSection: {
    marginBottom: 16,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  listText: {
    fontSize: 14,
  },
  scrollContainer: {
    paddingBottom: 16, 
},
});

export default ProductDetails;
