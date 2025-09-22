import { useRouter, useLocalSearchParams } from "expo-router";
import { FC, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ProductCardFragment, useAdditionalProductDataQuery } from "@/saleor/api.generated";
import { colors, Divider, fonts, Text, View } from './../Themed';
import { useCheckout } from "@/context/CheckoutProvider";
import { useModal } from "@/context/useModal";
import AddedToCart from "../cart/AddToTheCart";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { renderStars } from "@/utils/renderStars";
import { convertMoneyToString } from "@/utils/convertMoneytoString";
import { Skeleton } from "moti/skeleton";
import analytics from '@react-native-firebase/analytics';

const dummyUri = require("../../assets/images/photo-unavailable.png");

interface Props {
    product: ProductCardFragment
}

const ProductImage: FC<{ product: ProductCardFragment }> = ({ product }) => {
    if (product.media && product.media.length > 0) {
        return <Image
            style={[styles.tinyLogo]} // Add pressed styles here
            resizeMode="contain"
            source={{
                uri: product?.media[0].url
            }}
        />
    }
    return <Image source={dummyUri} style={styles.tinyLogo} />
}

const ProductListItem: FC<Props> = ({ product }) => {
    const { onAddToCart } = useCheckout();
    const { openModal } = useModal();
    const [loading, setLoading] = useState(false);


    const { data, loading: additionalLoading } = useAdditionalProductDataQuery({
        variables: {
            slug: product.slug
        }
    });
    const productDetails = data?.product

    const condition = productDetails?.attributes.find(a => a.attribute.slug === "condition")
    const warranty = productDetails?.attributes.find(a => a.attribute.slug === "garantie")

    const router = useRouter();
    const searchParams = useLocalSearchParams();
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
        params.append(key, value as string);
    });

    // const variants = productDetails?.variants || [];
    const defaultVariant = productDetails?.defaultVariant;

    const handleAddItem = async () => {
        setLoading(true);
        try {
            analytics().logEvent('add_to_cart', {
                items: [{
                  item_id: defaultVariant?.id,
                  item_name: product.name,
                  item_category: product.category?.name || 'N/A',
                  price: defaultVariant?.pricing?.price?.gross.amount || 0,
                  item_variant: defaultVariant?.name || 'N/A',
                  quantity: 1, 
                }],
              });
            await onAddToCart(defaultVariant?.id || "");
            openModal({
                id: "CartPreview",
                content: <AddedToCart />,
                height: "110%",
                closeButtonVisible: true,
                disableScroll: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        < TouchableOpacity onPress={() => {
            // Log the select_item event
            analytics().logEvent('select_item', {
                item_list_id: 'filtered_product_list',
                item_list_name: 'Filtered Products',
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    item_category: product.category?.name || 'N/A',
                    price: product.pricing?.priceRange?.start?.gross.amount || 0,
                }],
            });
            router.push(`/products/${product.id}?${params.toString()}`)

        }}>
            <View style={styles.productItem}>
                <View style={styles.imageWrapper} testID="product-image-wrapper">
                    <View>
                        <ProductImage product={product} />
                    </View>
                    <View style={styles.productDetailWrapper}>
                        <View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}>
                                <Text style={[styles.productTitle]} numberOfLines={2}>
                                    {product.name}
                                </Text>
                                {/* <FontAwesome name="arrow-right" size={15} color={colors.primary}
                                    /> */}
                            </View>

                            {/* Reference and SKU */}
                            {additionalLoading ? <Skeleton height={20} width={200} radius={2} colorMode="light" /> :
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    {productDetails?.externalReference && (
                                        <Text style={styles.referenceText}>
                                            Référence # {productDetails?.externalReference}
                                        </Text>
                                    )}
                                    {productDetails?.externalReference && productDetails?.defaultVariant?.sku && <Text> | </Text>}
                                    {productDetails?.defaultVariant?.sku && (
                                        <Text style={styles.referenceText}>
                                            SKU # {productDetails?.defaultVariant.sku}
                                        </Text>
                                    )}
                                </View>
                            }
                            {/* Rating Section */}
                            {
                                additionalLoading ?

                                    <View style={{ marginVertical: 10 }}>
                                        <Skeleton height={20} width={200} radius={2} colorMode="light" />
                                    </View> :
                                    productDetails?.averageRating !== undefined && (
                                        <Text style={styles.ratingText}>
                                            {renderStars(productDetails?.averageRating || 0)} {productDetails?.averageRating} ({productDetails?.reviewCount})
                                        </Text>
                                    )

                            }
                        </View>
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
                        {additionalLoading ?
                            <Skeleton height={20} width={200} radius={2} colorMode="light" />
                            :
                            <Text style={styles.productPrice}>
                                {convertMoneyToString(productDetails?.defaultVariant?.pricing?.price?.gross)}
                            </Text>
                        }
                        {product.category && (
                            <View style={styles.notesWrapper}>
                                <Text style={styles.notesLabel}>Catégorie: </Text>
                                <Text style={styles.notesText}>{product.category.name}</Text>
                            </View>
                        )}
                        {(condition?.values && condition?.values.length > 0) && (
                            <View style={styles.notesWrapper}>
                                <Text style={styles.notesLabel}>Condition: </Text>
                                <Text style={styles.notesText}>{condition.values[0].name}</Text>
                            </View>
                        )}
                        {/* <CompatibilityCheckBasic product={product} /> */}
                        {/* {defaultVariant && <DeliveryMethodBasic variant={defaultVariant} />} */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={handleAddItem}
                                disabled={loading || !product.isAvailable}
                                style={[styles.button, !product.isAvailable && {
                                    backgroundColor: colors.background,
                                }]}
                            >
                                {loading ? <ActivityIndicator color="white" /> : <Text style={[styles.buttonText,
                                !product.isAvailable && {
                                    color: colors.textPrimary,
                                }
                                ]}>AJOUTER AU PANIER</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <Divider style={{ borderBottomWidth: 10, marginTop: 0, marginBottom: 0 }} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    productItem: {
        width: "100%",
        padding: 10,
        paddingTop: 20,
    },
    imageWrapper: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    productDetailWrapper: {
        flex: 1,
        gap: 10,
        paddingHorizontal: 5,
        paddingLeft: 10
    },
    tinyLogo: {
        width: 100,
        height: 100,
        flexShrink: 0,
    },
    pressedImage: {
        transform: [{ scale: 1.05 }], // Slight scaling effect when pressed
    },
    productTitle: {
        textAlign: "left",
        fontWeight: 'bold',
        fontSize: fonts.body,
    },
    pressedText: {
        transform: [{ scale: 1.05 }] // Slight scaling effect when pressed
    },
    referenceText: {
        fontSize: fonts.caption,
        color: colors.textSecondary,
    },
    ratingText: {
        fontSize: fonts.caption,
        color: colors.textSecondary,
        marginVertical: 5,
    },
    productPrice: {
        textAlign: "left",
        fontSize: fonts.h2,
        fontWeight: "800",
        // transform: [{ scaleY: 1.3 }],
    },
    notesWrapper: {
        flexDirection: "row",
        alignItems: "center",
    },
    notesLabel: {
        fontSize: fonts.caption,
        fontWeight: "400",
    },
    notesText: {
        fontSize: fonts.caption,
        color: colors.textSecondary,
    },
    buttonContainer: {
        alignItems: "center",
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 30,
        alignItems: "center",
        width: "70%",
        paddingVertical: 17
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: fonts.caption,

    },
});

export default ProductListItem;
