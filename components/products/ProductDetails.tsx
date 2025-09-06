import { FC, useState } from "react";
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
} from "@/components/Themed";
import { ActivityIndicator, StyleSheet, TouchableOpacity,Image } from "react-native";
import ProductImageCarousel from "./details/ProductImageCarousel";
import { getConfig } from "@/config";
import VariantSelector from "./details/VariantSelector";
import { ScrollView } from "react-native-gesture-handler";
import { useModal } from "@/context/useModal";
import { useCheckout } from "@/context/CheckoutProvider";
import { renderStars } from "@/utils/renderStars";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AddedToCart from "../cart/AddToTheCart";
import Review from "./Review";
import ProductSpecifications from "./ProductSpecifications";
import RecommendedProducts from "./RecommendedProducts";
import ItemNotAvailable from "../ItemNotAvailable";

interface Props {
  product: ProductFragment;
}

const defaultImageUrl = require("../../assets/images/photo-unavailable.png")


const ProductDetails: FC<Props> = ({ product }) => {
  const { openModal } = useModal()

  const condition = product?.attributes.find(a => a.attribute.slug === "condition")
  const warranty = product?.attributes.find(a => a.attribute.slug === "garantie")
  
  const media = product.media || []

  // const isUniversal = product.isUniversal || true;
  const { onAddToCart, loading } = useCheckout();
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
                <Text style={{ fontSize: fonts.caption, color: colors.textSecondary }}>
                  Référence # {product.externalReference}
                </Text>
              )}
              {product.externalReference && product.defaultVariant?.sku && <Text> | </Text>}
              {product.defaultVariant?.sku && (
                <Text style={{ fontSize: fonts.caption, color: colors.textSecondary }}>
                  SKU # {product.defaultVariant.sku}
                </Text>
              )}
            </View>
            {/* Rating Section */}
            {product.averageRating !== undefined && (
              <Text style={styles.ratingText}>
                {renderStars(product.averageRating || 0)} {product?.averageRating} ({product.reviewCount})
              </Text>
            )}
            <View>
              {(warranty?.values && warranty?.values.length > 0) && (
                <View style={styles.notesWrapper}>
                  <FontAwesome name="shield" size={15} color={colors.primary}
                  />
                  <Text style={styles.notesText}> {warranty.values[0].name}</Text>
                  <Text style={styles.notesText}> Garantie</Text>
                </View>
              )}
            </View>
            {(condition?.values && condition?.values.length > 0) && (
              <View style={styles.notesWrapper}>
                <Text style={styles.notesText}>Condition: </Text>
                <Text style={styles.notesText}>{condition.values[0].name}</Text>
              </View>
            )}
          </View>
        </PaddedView>

        <PaddedView>
          {media.length > 0 ? <ProductImageCarousel
            images={
              product.media?.map((m, idx) => ({ url: m.url, alt: m.alt, id: idx })) || []
            }
          /> : 
          <View
          style={{
            alignItems:"center"
          }}
          ><Image source={defaultImageUrl} style={styles.image} /></View>
          }
        </PaddedView>
        {/* <PaddedView>
          <CompatibilityCheck product={product} />
        </PaddedView> */}

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
        {/* <Divider style={{ borderBottomWidth: 10 }} />

        <PaddedView>
          <DeliveryMethod variant={product.defaultVariant} setCheckedId={setCheckedId} isAvailable={product.isAvailable || undefined} />

        </PaddedView> */}

        <Divider style={{ borderBottomWidth: 10 }} />
        <View style={styles.buttonContainer}>
          <View style={{ marginVertical: 5 }}>
            <VariantSelector
              product={product}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={async () => {
              await onAddToCart(selectedVariant?.id);
        
              openModal({
                id: "CartPreview",
                content:<AddedToCart />,
                height: "110%",
                closeButtonVisible: true,
                disableScroll:true

              })
            }}
            disabled={loading || !product.isAvailable}
            style={[styles.button, 
              !product.isAvailable && {
                backgroundColor: colors.background,
            }
            ]}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={[styles.buttonText,
              !product.isAvailable && {
                color: colors.textPrimary,
            }
            ]}>AJOUTER AU PANIER</Text>}
          </TouchableOpacity>
          {!loading && !product.isAvailable &&           <ItemNotAvailable />          }

        </View>

        <Divider style={{ borderBottomWidth: 10 }} />

        <PaddedView style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description du produit</Text>
          {renderDescription()}
        </PaddedView>

        {(product?.attributes && product.attributes.length > 0) && 
        <>
        <Divider style={{ borderBottomWidth: 10 }} />   
        <ProductSpecifications product={product}/>
        </>
        }
        {product.category?.id && <>
          <Divider style={{ borderBottomWidth: 10 }} />
        <RecommendedProducts categoryID={product.category?.id}/></>}
        {/* <Fitment fitmentData={fitments} isUniversal={isUniversal} /> */}
        <Divider style={{ borderBottomWidth: 10 }} />
      <Review product={product} />
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
    fontSize: fonts.body,
  },
  productPrice: {
    fontWeight: "800",
    fontSize: fonts.h2,
    transform: [{ scaleY: 1.3 }],
  },
  descriptionContainer: {
    paddingHorizontal: 16,
  },
  descriptionTitle: {
    fontSize: fonts.h2,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listBlock: {
    marginBottom: 8,
  },
  listItem: {
    fontSize: fonts.caption,
    marginBottom: 4,
  },
  priceTitle: {
    fontSize: fonts.body,
    fontWeight: "bold",
    marginBottom: 0,
  },
  subtitle: {
    fontSize: fonts.h2,
    marginBottom: 4,
  },
  listText: {
    fontSize: fonts.body,
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  buttonContainer: {
    padding: 5,
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    alignItems: "center",
    width: "100%",
    padding: 15
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
  notesWrapper: {
    marginTop:5,
    flexDirection: "row",
    alignItems: "center",
  },
  notesLabel: {
    fontSize: fonts.caption,
    fontWeight: "bold",
  },
  notesText: {
    fontSize: fonts.caption,
    color: colors.textSecondary,
  },
  image:{
    width: 200,
    height: 200,
    flexShrink: 0,
  }
});

export default ProductDetails;
