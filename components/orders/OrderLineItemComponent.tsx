import { FC } from "react";
import { OrderLineVariantFragment, OrderLineFragment } from "../../saleor/api.generated";
import { Text, View } from '../Themed';
import { Image, Pressable, StyleSheet } from 'react-native';
import { getConfig } from "../../config";
import { useRouter } from "expo-router";

interface Props {
    lineItem: OrderLineFragment
}

const OrderItemImage: FC<{ variant: OrderLineVariantFragment }> = ({ variant }) => {
    const media = variant.product.media || []
    if (variant.media && variant.media.length > 0) {
        return <Image
            style={styles.tinyLogo}
            source={{
                uri: variant.media[0].url
            }}
        />
    } else if (media.length > 0) {
        return <Image
            style={styles.tinyLogo}
            source={{
                uri: media[0].url
            }} 
            resizeMode="contain"
        />
    }
    return <>Aucune image</>
}

const OrderLineItemComponent: FC<Props> = ({ lineItem }) => {
    const router = useRouter()

    const formatter = new Intl.NumberFormat(getConfig().locale, {
        style: 'currency',
        currency: lineItem.totalPrice?.gross.currency,
    });

    if (!lineItem) {
        return <></>
    }
    
    return <Pressable onPress={() => router.push("products/details/" + lineItem.variant?.product.id)}>
        <View style={styles.productItem}>
            <View style={styles.imageWrapper} testID="product-image-wrapper">
                <OrderItemImage variant={lineItem?.variant as OrderLineVariantFragment} />
                <View style={styles.productDetailWrapper}>
                    <Text style={styles.productTitle} >
                        {lineItem.variant?.product.name}
                    </Text>
                    <Text style={styles.productVariant} numberOfLines={1} >
                        {lineItem.variant?.name}
                    </Text>
                    <Text style={styles.productPrice} >
                        {formatter.format(lineItem.undiscountedUnitPrice.gross.amount || 0)}
                    </Text>
                    <Text >
                        Quantité : {lineItem.quantity}
                    </Text>
                </View>
            </View>
        </View>
    </Pressable>
}

const styles = StyleSheet.create({
    productItem: {
        width: "100%",
        maxWidth: 600,
        marginBottom: 16,
    },
    tinyLogo: {
        width: 70,
        height: 70,
    },
    productVariant: {
        textAlign: "left",
        fontSize: 15,
        marginBottom: 16,
        overflow: "hidden",
        width: "90%"
    },
    productTitle: {
        textAlign: "left",
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 8
    },
    productPrice: {
        textAlign: "left",
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8
    },
    productDescription: {
        textAlign: "left",
    },
    imageWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    productDetailWrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        margin: 8,
    }
});

export default OrderLineItemComponent;
