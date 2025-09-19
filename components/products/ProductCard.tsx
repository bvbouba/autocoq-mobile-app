
import  { FC } from "react";
import { View, Text, Image, TouchableOpacity,StyleSheet } from "react-native";
import { ProductCardFragment, useAdditionalProductDataQuery } from "@/saleor/api.generated";
import { useRouter } from "expo-router";
import { convertMoneyToString } from "@/utils/convertMoneytoString";
import { colors, fonts } from "../Themed";
import { renderStars } from "@/utils/renderStars";
import * as Sentry from '@sentry/react-native';

const defaultImageUrl = require("../../assets/images/photo-unavailable.png")


const ProductImage: FC<{ product: ProductCardFragment }> = ({ product }) => {
    if (product.media && product.media.length > 0) {
        return <Image
            style={[styles.tinyLogo,]} // Add pressed styles here
            resizeMode="contain"
            source={{
                uri: product?.media[0].url
            }}
            onError={(error) => {
              Sentry.captureException(error.nativeEvent.error);
              console.log('Image failed to load:', error.nativeEvent.error);
            }}
        />
    }
    return <Image source={defaultImageUrl} style={styles.tinyLogo} />
  }
  

const ProductCard = ({ product }: {  product: ProductCardFragment }) => {
  const router = useRouter()
  

  const { data } = useAdditionalProductDataQuery({
    variables:{
        slug:product.slug
    }
  });

  const productDetails = data?.product 

  return (<TouchableOpacity
            onPress={() => router.push(`/products/${product.id}`)}
            style={styles.container}
          >
             <ProductImage product={product} />
            <View style={{ padding: 8 }}>
            <Text style={{ fontSize: fonts.body, fontWeight: "bold" }}>
              {convertMoneyToString(product.pricing?.priceRange?.start?.gross)}
              </Text>
              {
                productDetails?.averageRating !== undefined && (
                    <Text style={styles.ratingText}>
                        {renderStars(productDetails?.averageRating || 0)} {productDetails?.averageRating} ({productDetails?.reviewCount})
                    </Text>
                )
              }
            
              <Text style={{ fontSize: fonts.body }}>{product.name}</Text>
            </View>
          </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#fff",
        marginRight: 10,
        borderRadius: 8,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    tinyLogo: {
        width: 150,
        height: 150,
        flexShrink: 0,
    },
    ratingText: {
        fontSize: fonts.caption,
        color: colors.textSecondary,
        marginVertical: 5,
    },

})
export default ProductCard;
