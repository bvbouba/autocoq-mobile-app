import { useRouter, useLocalSearchParams } from "expo-router";
import { FC, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet } from 'react-native';
import { getConfig } from "../../config";
import { ProductFragment } from "../../saleor/api.generated";
import { colors, Divider, Text, View } from './../Themed';
import CompatibilityCheckBasic from "../car/CompatibilityCheckBasic";
import DeliveryMethodBasic from "../DeliveryMethodBasic";
import { Button } from "react-native-paper";
import { useCartContext } from "@/context/useCartContext";

interface Props {
    product: ProductFragment
    setFilterOpen: (filterOpen:boolean)=>void,

}

const ProductImage: FC<{ product: ProductFragment }> = ({ product }) => {
    if (product.media && product.media.length > 0) {
        return <Image
            style={styles.tinyLogo}
            resizeMode="contain"
            source={{
                uri: product?.media[0].url
            }}

        />
    }
    return <>No Image</>
}

const ProductListItem: FC<Props> = ({ product,setFilterOpen }) => {
    const { addItem } = useCartContext();
    const [loading, setLoading] = useState(false);

    const formatter = new Intl.NumberFormat(getConfig().locale, {
        style: 'currency',
        currency: product.defaultVariant?.pricing?.price?.gross.currency,
    });
    const router = useRouter();

    //in order to fix flicking filter bug
    const searchParams = useLocalSearchParams();
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
        params.append(key, value as string)
    });

    const variants = product?.variants || []

    const handleAddItem = async () => {
        if (!(variants.length>0)) return;
        setLoading(true);
        try {
            await addItem(variants[0].id);
        } finally {
            setLoading(false);
        }
    };


    return <>
        <Pressable onPress={() => router.push("products/details/" + product.id + "?" + params.toString())}>
            <View style={styles.productItem}>
                <View style={styles.imageWrapper} testID="product-image-wrapper">
                    <View><ProductImage product={product} />
                    </View>
                    <View style={styles.productDetailWrapper}>
                        <Text style={styles.productTitle} numberOfLines={2} >
                            {product.name}
                        </Text>
                        {product.externalReference && (
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                Référence # {product.externalReference}
                            </Text>
                            )}
                        
                        <Text style={styles.productPrice} >
                            {formatter.format(product.defaultVariant?.pricing?.price?.gross.amount || 0)}
                        </Text>
                        {product.category && (
                            <View style={{
                                flexDirection:"row",
                                alignItems:"center",
                                marginTop:5
                            }}>
                            <Text style={{
                                fontSize: 12,
                                fontWeight:"bold"
                            }}>Notes: </Text>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                            {product.category.name}
                        </Text></View>
                        )}
                        <CompatibilityCheckBasic product={product} setFilterOpen={setFilterOpen}/>
                        <DeliveryMethodBasic  variant={variants[0]}/>
                        <View style={styles.buttonContainer}>
                        <Button
                            style={styles.button}
                            mode="contained"
                            onPress={handleAddItem}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                            {loading ? <ActivityIndicator color="white" /> : "AJOUTER AU PANIER"}
                            </Text>
                        </Button>
                        </View>
                    </View>

                </View>
            </View>
            <Divider style={{ borderBottomWidth: 5 }} />
        </Pressable>

    </>
}


const styles = StyleSheet.create({
    productItem: {
        width: "100%",
        marginVertical: 16,
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
        paddingHorizontal: 10,
    },
    tinyLogo: {
        width: 100,  
        height: 100,
        flexShrink: 0,
    },
    productTitle: {
        textAlign: "left",
        fontWeight: 'bold',
        fontSize: 15,
    },
    productPrice: {
        textAlign: "left",
        marginTop:8,
        fontSize: 20,
        fontWeight:"bold"
    },
    productDescription: {
        textAlign: "left",
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
        fontSize:12
      },
    
});

export default ProductListItem