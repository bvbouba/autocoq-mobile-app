import { FC } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from './../Themed';
import ProductListItem from './ProductListItem';
import { ProductFragment } from '@/saleor/api.generated';


interface Props {
    products:ProductFragment[]
}

const ProductListComponent: FC<Props> = ({ products }) => {
  
    if (products && products.length === 0) {
        return <View style={styles.noProductsContainer} testID="prod-list-safe">
            <View style={styles.noProductsTextWrapper}>
                <Text style={styles.noProductsText} >Aucun produit ne correspond aux critères donnés</Text>
            </View>
        </View>
    }

    return (
        <SafeAreaView style={styles.container} testID="prod-list-safe">
            
            <ScrollView contentContainerStyle={styles.scrollViewContent} testID="prod-list-scroll">
                {(products || []).map((product) => {
                    if (!product) {
                        return <></>
                    }
                    return (
                        <ProductListItem key={product?.slug} product={product} />
                    )
                })}
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    noProductsContainer: {
        flex: 1,
        justifyContent: "flex-start",
        flexDirection: "column",
        width: "100%",
    },
    noProductsTextWrapper: {
        marginTop: 32
    },
    noProductsText: {
        textAlign: "center"
    },
    fullHeight: {
        height: "100%"
    },
    scrollViewContent: {
        paddingBottom: 16,
    },
});

export default ProductListComponent
