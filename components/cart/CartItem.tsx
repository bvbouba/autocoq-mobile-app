import { FC, useEffect } from "react";
import { CheckoutLine } from "@/saleor/api.generated";
import { Text, View, Divider, colors, fonts } from "@/components/Themed"

import { Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { getConfig } from "@/config";
import { useRouter } from "expo-router";
import CartItemQuantityPicker from "./CartItemQuantityPicker";
import { useCheckout } from "@/context/CheckoutProvider";
// import { useLoading } from "@/context/LoadingContext";

interface Props {
    lineItem: CheckoutLine;
}

const CartImage: FC<{ line: CheckoutLine }> = ({ line }) => {
    if (line.variant.media && line.variant.media.length > 0) {
        return <Image
            style={styles.tinyLogo}
            source={{
                uri: line.variant.media[0].url
            }}
            resizeMode="contain"
        />
    } else if (line.variant.product.thumbnail) {
        return <Image
            style={styles.tinyLogo}
            source={{
                uri: line.variant.product.thumbnail.url
            }}
            resizeMode="contain"
        />
    }
    return <Text>Pas d'image</Text>
}

const CartItem: FC<Props> = ({ lineItem }) => {
    const router = useRouter();
    const { onQuantityUpdate, loading, onCheckoutLineDelete } = useCheckout();
    // const {setLoading} = useLoading()
    
    // useEffect(()=>{
    //   setLoading(loading)
    // },[loading])

    const formatter = new Intl.NumberFormat(getConfig().locale, {
        style: 'currency',
        currency: lineItem.totalPrice?.gross.currency,
    });
    const variants = lineItem.variant.product.variants || [];

    return <>
        <Pressable onPress={() => router.push(`/products/${lineItem.variant.product.id}`)}>
            <View style={styles.productItem}>
                <View style={styles.productWrapper} testID="product-image-wrapper">
                    <View style={styles.imageWrapper}>
                        <CartImage line={lineItem} />
                    </View>

                    <View style={styles.productDetailWrapper}>
                        <Text style={[styles.productTitle, { maxWidth: "99%" }]}>
                            {lineItem.variant.product.name}
                        </Text>
                        {variants.length > 1 && <Text style={styles.productVariant}>
                            {lineItem.variant.name}
                        </Text>}
                        {lineItem.variant.product.externalReference &&
                            <Text style={styles.partNo}>
                                Référence # {lineItem.variant.product.externalReference}
                            </Text>}
                        <Text style={styles.productPrice}>
                            {formatter.format(lineItem.totalPrice.gross.amount || 0)}
                        </Text>
                    </View>
                </View>

                <View style={{
                    flexDirection: "row",
                    paddingHorizontal: 15,
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <View style={{ width: "auto" }}>
                        <TouchableOpacity
                            onPress={async () => await onCheckoutLineDelete(lineItem.id)
                            }
                        >
                            <Text style={{ textDecorationLine: "underline" }}>
                                Supprimer
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.picker}>
                        <CartItemQuantityPicker
                            value={lineItem.quantity}
                            onSelect={async (value) => await onQuantityUpdate(lineItem.variant.id, value)}
                            disabled={loading}
                        />
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceText}>
                                {formatter.format(lineItem.undiscountedUnitPrice.amount || 0)} chacun
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
        <Divider />
    </>
}

const styles = StyleSheet.create({
    productItem: {
        width: "100%",
        maxWidth: 600,
        marginTop: 0,
        marginBottom: 16
    },
    tinyLogo: {
        width: 70,
        height: 70,
    },
    productTitle: {
        textAlign: "left",
        fontWeight: 'bold',
        fontSize: fonts.caption,
        marginBottom: 8,
        flexShrink: 1,      
       flexWrap: "wrap",  
    },
    productVariant: {
        textAlign: "left",
        fontSize: fonts.h2,
        marginBottom: 16
    },
    productPrice: {
        textAlign: "left",
        fontWeight: "800",
        fontSize: fonts.h2,
        marginBottom: 16,
        // transform: [{ scaleY: 1.3 }],
    },
    productDescription: {
        textAlign: "left",
    },
    productWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    imageWrapper: {
        flexDirection: "column",
        justifyContent: "space-between",
    },
    productDetailWrapper: {
        flex: 1, 
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: 10,
    },
    partNo: {
        fontSize: fonts.caption,
        color: colors.textSecondary
    },

    picker: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        maxWidth: "60%",
    },

    priceContainer: {
        marginLeft: 8,
    },

    priceText: {
        fontSize: 10,
        marginTop: 5,
        flexShrink: 1, // Prevents text from getting cut off
        textAlign: "right", // Align text to the right
    }

});

export default CartItem;
