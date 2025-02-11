import { FC, useEffect, useState } from "react";
import {
  ProductFragment,
  ProductVariantFragment,
} from "@/saleor/api.generated";
import {
  colors,
  Divider,
  fonts,
  PaddedView,
  Text,
  View,
} from "../Themed";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useCartContext } from "@/context/useCartContext";
import ProductImageCarousel from "./details/ProductImageCarousel";
import { getConfig } from "@/config";
import { useRouter } from "expo-router";
import VariantSelector from "./details/VariantSelector";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import CompatibilityCheck from "../car/CompatibilityCheck";
import Fitment from "../car/Fitment";
import DeliveryMethod from "../DeliveryMethod";
import { useNavigation } from "@react-navigation/native";
import { useModal } from "@/context/useModal";
import AddToTheCart from "../cart/AddToTheCart";
import ZoneSelector from "../ZoneSelector";

interface Props {
  product: ProductFragment;
}

const ProductDetails: FC<Props> = ({ product }) => {
  const {openModal} = useModal()

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
        <PaddedView>
          <View style={{ flexDirection: "column", marginBottom: 15, padding: 8 }}>
            <Text style={styles.productTitle}>{product.name}</Text>
            {product.externalReference && (
              <Text style={{ fontSize:fonts.caption, color: colors.textSecondary }}>
                Référence # {product.externalReference}
              </Text>
            )}
          </View>
        </PaddedView>

        <PaddedView>
          <ProductImageCarousel
            images={
              product.media?.map((m, idx) => ({ url: m.url, alt: m.alt, id: idx })) || []
            }
          />
        </PaddedView>
        <PaddedView>
        <CompatibilityCheck product={product} />
        </PaddedView>

        <Divider style={{ borderBottomWidth: 5 }} />

        <PaddedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text style={styles.priceTitle}>Prix</Text>
          <Text style={styles.productPrice}>{price}</Text>
        </PaddedView>
        <Divider style={{ borderBottomWidth: 5 }} />
        
        <PaddedView>
       <DeliveryMethod variant={product.defaultVariant} /> 
       
        </PaddedView>
        
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
              openModal("CartPreview",<AddToTheCart />)
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
    fontSize:fonts.body,
  },
  productPrice: {
    fontWeight: "bold",
    fontSize:fonts.h2,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
  },
  descriptionTitle: {
    fontSize:fonts.h2,
    fontWeight: "bold",
    marginBottom: 8,
  },
  listBlock: {
    marginBottom: 8,
  },
  listItem: {
    fontSize:fonts.caption,
    marginBottom: 4,
  },
  priceTitle: {
    fontSize:fonts.body,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize:fonts.h2,
    marginBottom: 4,
  },
  listText: {
    fontSize:fonts.body,
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
