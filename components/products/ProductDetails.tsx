import { FC, useState } from "react";
import {
  ProductFragment,
  ProductVariantFragment,
} from "../../saleor/api.generated";
import {
  colors,
  Divider,
  PaddedView,
  Text,
  View,
} from "../Themed";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useCartContext } from "../../context/useCartContext";
import ProductImageCarousel from "./details/ProductImageCarousel";
import { getConfig } from "../../config";
import { useRouter } from "expo-router";
import VariantSelector from "./details/VariantSelector";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import CompatibilityCheck from "../car/CompatibilityCheck";
import Fitment from "../car/Fitment";
import DeliveryMethod from "../DeliveryMethod";

interface Props {
  product: ProductFragment;
}

const ProductDetails: FC<Props> = ({ product }) => {
  const router = useRouter();

  const isUniversal = product.isUniversal || true;
  const fitments = product.fitments || [];

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
                • {item.replace(/&nbsp;/g, " ")} {/* Remplace &nbsp; par un espace */}
              </Text>
            ))}
          </View>
        );
      }
      return null;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <View style={{ flexDirection: "column", marginBottom: 15, padding: 8 }}>
            <Text style={styles.productTitle}>{product.name}</Text>
            {product.externalReference && (
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                Référence # {product.externalReference}
              </Text>
            )}
          </View>
        </View>

        <View>
          <ProductImageCarousel
            images={
              product.media?.map((m, idx) => ({ url: m.url, alt: m.alt, id: idx })) || []
            }
          />
        </View>

        <CompatibilityCheck product={product} />

        <Divider style={{ borderBottomWidth: 5 }} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text style={styles.priceTitle}>Prix</Text>
          <Text style={styles.productPrice}>{price}</Text>
        </View>
        <Divider style={{ borderBottomWidth: 5 }} />

        <DeliveryMethod variant={product.defaultVariant} />

        <Divider style={{ borderBottomWidth: 5 }} />
        <View style={styles.buttonContainer}>
          <View style={{ marginVertical: 5 }}>
            <VariantSelector
              product={product}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />
          </View>

          <Button
            style={styles.button}
            mode="contained"
            onPress={async () => {
              await addItem(selectedVariant?.id);
              router.push("(tabs)/cart");
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? <ActivityIndicator color="white" /> : "AJOUTER AU PANIER"}
            </Text>
          </Button>
        </View>

        <Divider style={{ borderBottomWidth: 5 }} />

        <PaddedView style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description du produit</Text>
          {renderDescription()}
        </PaddedView>

        <Divider style={{ borderBottomWidth: 5 }} />

        <Fitment fitmentData={fitments} isUniversal={isUniversal} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  scrollView: {
    flex: 1,
    flexGrow: 1,
  },
  productTitle: {
    fontWeight: "500",
    fontSize: 15,
  },
  productPrice: {
    fontWeight: "bold",
    fontSize: 20,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
  },
  descriptionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },
  listBlock: {
    marginBottom: 8,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 4,
  },
  priceTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  listText: {
    fontSize: 14,
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  buttonContainer: {
    padding: 5,
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    alignItems: "center",
    width: "95%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "400",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ProductDetails;
