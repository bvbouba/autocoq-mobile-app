import React, { FC, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useProductContext } from '../../../context/useProductContext';

import { useLocalSearchParams } from 'expo-router';
import { getConfig } from '../../../config';
import { CategoryPathFragment, CollectionFragment, useCategoryPathsQuery, useGetCollectionsQuery } from '../../../saleor/api.generated';
import { colors, Divider, Text, View } from '../../Themed';
import { Button } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

interface Props {
    openFilters: () => void
}

const ProductFilter: FC<Props> = ({ openFilters }) => {

    const { collection: collectionsQueryString, categories: categoriesQueryString } = useLocalSearchParams();
    const { data: collectionsData, called: collectionsCalled } = useGetCollectionsQuery()
    const { data: categoriesData } = useCategoryPathsQuery({
        variables: {
            channel: getConfig().channel
        }
    })

    const { setCategoryFilters, selectedCategories, collectionFilter, setCollectionFilter } = useProductContext();

    useEffect(() => {
        if (collectionsQueryString && collectionsCalled) {
            const foundCollection: CollectionFragment | undefined = collectionsData?.collections?.edges.map(edge => edge.node)
                .find(collection => collection.slug === collectionsQueryString);

            setCollectionFilter(foundCollection)
        }
        if (!collectionsQueryString) {
            setCollectionFilter(undefined)
        }
    }, [collectionsQueryString, collectionsData])

    useEffect(() => {
        if (categoriesQueryString && categoriesData) {
            const foundCategories: CategoryPathFragment[] = categoriesData?.categories?.edges.map(edge => edge.node)
                .filter(cat => {
                    if (typeof categoriesQueryString === "string") {
                        const categories = categoriesQueryString.split(",")
                        return categories.indexOf(cat.slug) !== -1
                    }

                    if (Array.isArray(categoriesQueryString)) {
                        return categoriesQueryString.indexOf(cat.slug) !== -1
                    }

                    return false;
                }) || [];

            setCategoryFilters(foundCategories)
        }
        if (!categoriesQueryString) {
            setCategoryFilters([])
        }
    }, [categoriesQueryString, categoriesData])

    const numberOfFilters = selectedCategories.length + (collectionFilter ? 1 : 0);

    return (
        <View style={styles.wrapper}>

            <Divider />
            <View style={[styles.filterWrapper, (numberOfFilters !== 0) && {
                backgroundColor:"white"
            }]}>
                {numberOfFilters !== 0 && <Text style={styles.filterLabel}>{numberOfFilters} filters applied</Text>}
                {numberOfFilters === 0 && <Text style={styles.filterLabel}>No Filters</Text>}
                <View style={{
                    flexDirection:"row",
                    alignItems:"center",
                    backgroundColor:colors.textInputGreyBackground,
                }}>
                
                <Button style={[styles.filterButton,(numberOfFilters !== 0)&&{
                    backgroundColor:"black",
                    borderRadius:3,
                }]} onPress={() => openFilters()} icon="chevron-down"
                    contentStyle={{ flexDirection: 'row-reverse' }} labelStyle={(numberOfFilters !== 0)&&{color:"white"}}> 
                     <FontAwesome name="filter" size={15} color={(numberOfFilters !== 0) ? "white" : colors.back} />
                    <Text style={[styles.filterText,
                     (numberOfFilters !== 0) && {color:"white"}
                    ]}>Filters</Text> </Button>

                </View>
            </View>
            <Divider />
        </View>
    );
}

const styles = StyleSheet.create({
    filterLabel: {
        paddingTop: 12,
        fontSize:12
    },
    filterButton: {
        paddingTop: 0,
        borderWidth:1,
    },
    wrapper: {
        width: "100%",
        paddingLeft: 16,
        paddingRight: 16,
    },
    filterWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingBottom: 4,
        backgroundColor:colors.textInputGreyBackground
    },
    filterText:{
        margin:2,
        fontSize:12
    }
});

export default ProductFilter
