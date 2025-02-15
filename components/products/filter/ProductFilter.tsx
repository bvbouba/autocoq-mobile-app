import React, { FC, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useProductContext } from '@/context/useProductContext';

import { useLocalSearchParams } from 'expo-router';
import { getConfig } from '@/config';
import { CategoryPathFragment, useCategoryPathsQuery, useGetCollectionsQuery } from '@/saleor/api.generated';
import { colors, Divider, fonts, Text, View } from '@/components/Themed';
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

    const { setCategoryFilters, selectedCategories,  } = useProductContext();


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

    const numberOfFilters = selectedCategories.length ;

    return (
        <View style={styles.wrapper}>

        <Divider />
        <View style={[styles.filterWrapper, (numberOfFilters !== 0) && {
            backgroundColor:"white"
        }]}>
            {numberOfFilters !== 0 && <Text style={styles.filterLabel}>{numberOfFilters} filtres appliqués</Text>}
            {numberOfFilters === 0 && <Text style={styles.filterLabel}>Aucun filtre</Text>}
            <View style={{
                flexDirection:"row",
                alignItems:"center",
                backgroundColor:colors.background,
            }}>
            
            <Button style={[styles.filterButton,(numberOfFilters !== 0)&&{
                backgroundColor:"black",
                borderRadius:3,
            }]} onPress={() => openFilters()} icon="chevron-down"
                contentStyle={{ flexDirection: 'row-reverse' }} labelStyle={(numberOfFilters !== 0)&&{color:"white"}}> 
                 <FontAwesome name="filter" size={15} color={(numberOfFilters !== 0) ? "white" : colors.secondary} />
                <Text style={[styles.filterText,
                 (numberOfFilters !== 0) && {color:"white"}
                ]}>Filtres</Text> </Button>
    
            </View>
        </View>
        <Divider />
    </View>
    
    );
}

const styles = StyleSheet.create({
    filterLabel: {
        paddingTop: 12,
        fontSize:fonts.caption
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
        backgroundColor:colors.background
    },
    filterText:{
        margin:2,
        fontSize:fonts.caption
    }
});

export default ProductFilter
