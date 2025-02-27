import { FC, useState } from "react";
import {
  ProductFragment,
  ProductVariantFragment,
  useCheckoutShippingMethodUpdateMutation,
} from "@/saleor/api.generated";
import {
  colors,
  Divider,
  fonts,
  PaddedView,
  Text,
  View,
} from "@/components/Themed";
import { ActivityIndicator, StyleSheet } from "react-native";
import ProductImageCarousel from "./details/ProductImageCarousel";
import { getConfig } from "@/config";
import VariantSelector from "./details/VariantSelector";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import CompatibilityCheck from "../car/CompatibilityCheck";
import Fitment from "../car/Fitment";
import { useModal } from "@/context/useModal";
import AddToTheCart from "../cart/AddToTheCart";
import { useCheckout } from "@/context/CheckoutProvider";
import DeliveryMethod from "../DeliveryMethod/DeliveryMethod";
import { renderStars } from "@/utils/renderStars";

interface Props {
  product: ProductFragment;
}

const ProductDetails: FC<Props> = ({ product }) => {
  const {openModal} = useModal()
  const [checkedId, setCheckedId] = useState<string>()
  const [shippingAddressUpdate] = useCheckoutShippingMethodUpdateMutation();

  const isUniversal = product.isUniversal || true;
  const fitments = product.fitments || [];

  const { onAddToCart, loading,checkoutToken } = useCheckout();
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            {product.externalReference && (
              <Text style={{ fontSize:fonts.caption, color: colors.textSecondary }}>
                Référence # {product.externalReference}
              </Text>
            )}
            {product.externalReference && product.defaultVariant?.sku && <Text> | </Text>}
                                {product.defaultVariant?.sku && (
                                    <Text style={{ fontSize:fonts.caption, color: colors.textSecondary }}>
                                        SKU # {product.defaultVariant.sku}
                                    </Text>
                                )}
            </View>
             {/* Rating Section */}
             {product.rating !== undefined && (
                                <Text style={styles.ratingText}>
                                    {renderStars(product.rating || 0)} ({product.rating})
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

        <Divider style={{ borderBottomWidth: 10 }} />

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
        <Divider style={{ borderBottomWidth: 10 }} />
        
        <PaddedView>
       <DeliveryMethod variant={product.defaultVariant} setCheckedId={setCheckedId}/> 
       
        </PaddedView>
        
        <Divider style={{ borderBottomWidth: 10 }} />
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
              await onAddToCart(selectedVariant?.id);
              if (checkedId) {
                await shippingAddressUpdate({
                  variables: {
                      token: checkoutToken,
                      shippingMethodId: checkedId,
                  },
              });
              }
              
              openModal("CartPreview",<AddToTheCart />)
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? <ActivityIndicator color="white" /> : "AJOUTER AU PANIER"}
            </Text>
          </Button>
        </View>

        <Divider style={{ borderBottomWidth: 10 }} />

        <PaddedView style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description du produit</Text>
          {renderDescription()}
        </PaddedView>

        <Divider style={{ borderBottomWidth: 10 }} />

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
    fontWeight: "800",
    fontSize:fonts.h2,
    transform: [{ scaleY: 1.3 }],
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
    marginBottom: 0,
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
    fontWeight: "bold",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingText: {
    fontSize: fonts.caption,
    color: colors.textSecondary,
    marginVertical: 5,
},
});

export default ProductDetails;
