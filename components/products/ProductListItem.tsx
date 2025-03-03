import { useRouter, useLocalSearchParams } from "expo-router";
import { FC, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getConfig } from "@/config";
import { ProductFragment } from "@/saleor/api.generated";
import { colors, Divider, fonts, Text, View } from './../Themed';
import CompatibilityCheckBasic from "../car/CompatibilityCheckBasic";
import { Button } from "react-native-paper";
import { useCheckout } from "@/context/CheckoutProvider";
import { useModal } from "@/context/useModal";
import AddedToCart from "../cart/AddToTheCart";
import DeliveryMethodBasic from "../DeliveryMethod/DeliveryMethodBasic";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { renderStars } from "@/utils/renderStars";

interface Props {
    product: ProductFragment
}

const ProductImage: FC<{ product: ProductFragment, isPressed: boolean }> = ({ product, isPressed }) => {
    if (product.media && product.media.length > 0) {
        return <Image
            style={[styles.tinyLogo, isPressed && styles.pressedImage]} // Add pressed styles here
            resizeMode="contain"
            source={{
                uri: product?.media[0].url
            }}
        />
    }
    return <>No Image</>
}

const ProductListItem: FC<Props> = ({ product }) => {
    const { onAddToCart } = useCheckout();
    const { openModal } = useModal();
    const [loading, setLoading] = useState(false);
    const [isImagePressed, setIsImagePressed] = useState(false);
    const [isTitlePressed, setIsTitlePressed] = useState(false);

    const formatter = new Intl.NumberFormat(getConfig().locale, {
        style: 'currency',
        currency: product.defaultVariant?.pricing?.price?.gross.currency,
    });

    const router = useRouter();
    const searchParams = useLocalSearchParams();
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
        params.append(key, value as string);
    });

    const variants = product?.variants || [];
    const defaultVariant = product.defaultVariant;

    const handleAddItem = async () => {
        if (!(variants.length > 0)) return;
        setLoading(true);
        try {
            await onAddToCart(defaultVariant?.id || "");
            openModal("CartPreview", <AddedToCart />);
        } finally {
            setLoading(false);
        }
    };

    // Convert rating value to stars

    return (
        <>
            <View style={styles.productItem}>
                <View style={styles.imageWrapper} testID="product-image-wrapper">
                    <View>
                        <TouchableOpacity onPress={() => router.push(`/products/${product.id}?${params.toString()}`)}
                            onPressIn={() => setIsImagePressed(true)}
                            onPressOut={() => setIsImagePressed(false)}
                        >
                            <ProductImage product={product} isPressed={isImagePressed} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.productDetailWrapper}>
                        <View>
                            <TouchableOpacity onPress={() => router.push(`/products/${product.id}?${params.toString()}`)}
                                onPressIn={() => setIsTitlePressed(true)}
                                onPressOut={() => setIsTitlePressed(false)}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}>
                                    <Text style={[styles.productTitle, isTitlePressed && styles.pressedText]} numberOfLines={2}>
                                        {product.name}
                                    </Text>
                                    <FontAwesome name="arrow-right" size={15} color={colors.primary}
                                    />
                                </View>
                            </TouchableOpacity>
                            {/* Reference and SKU */}
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {product.externalReference && (
                                    <Text style={styles.referenceText}>
                                        Référence # {product.externalReference}
                                    </Text>
                                )}
                                {product.externalReference && product.defaultVariant?.sku && <Text> | </Text>}
                                {product.defaultVariant?.sku && (
                                    <Text style={styles.referenceText}>
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
                        <Text style={styles.productPrice}>
                            {formatter.format(product.defaultVariant?.pricing?.price?.gross.amount || 0)}
                        </Text>
                        {product.category && (
                            <View style={styles.notesWrapper}>
                                <Text style={styles.notesLabel}>Notes: </Text>
                                <Text style={styles.notesText}>{product.category.name}</Text>
                            </View>
                        )}
                        <CompatibilityCheckBasic product={product} />
                        {defaultVariant && <DeliveryMethodBasic variant={defaultVariant} />}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                activeOpacity={0.6} 
                                onPress={handleAddItem}
                                disabled={loading}
                                style={styles.button}
                            >
                                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>AJOUTER AU PANIER</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <Divider style={{ borderBottomWidth: 10, marginTop: 0, marginBottom: 0 }} />
        </>
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
        transform: [{ scaleY: 1.3 }],
    },
    notesWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    notesLabel: {
        fontSize: fonts.caption,
        fontWeight: "bold",
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
