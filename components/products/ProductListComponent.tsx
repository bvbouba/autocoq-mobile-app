import React, { FC, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useProductContext } from '../../context/useProductContext';

import { Text, View } from './../Themed';
import ProductListItem from './ProductListItem';
import CarFilterModal from '../car/Modal';


interface Props {
}

const ProductListComponent: FC<Props> = ({  }) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const { products, loading } = useProductContext()
    if (loading) {
        return <></>
    }
    if (products && products.length === 0) {
        return <View style={styles.noProductsContainer} testID="prod-list-safe">
            <View style={styles.noProductsTextWrapper}>
                <Text style={styles.noProductsText} >No products match given criteria</Text>
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
                        <ProductListItem key={product?.slug} product={product} setFilterOpen={setFilterOpen} />
                    )
                })}
            </ScrollView>
            {filterOpen && <CarFilterModal onClose={() => setFilterOpen(false)} open={filterOpen} />}

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
