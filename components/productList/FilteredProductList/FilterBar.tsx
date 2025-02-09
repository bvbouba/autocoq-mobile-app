import React, { FC, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useProductContext } from '../../../context/useProductContext';

import { useLocalSearchParams } from 'expo-router';
import { getConfig } from '../../../config';
import { CategoryPathFragment, useCategoryPathsQuery, useGetCollectionsQuery } from '../../../saleor/api.generated';
import { colors, Divider, fonts, Text, View } from '../../Themed';
import { Button } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

interface Props {
    openFilters: () => void
}

const FilterBar: FC<Props> = ({ openFilters }) => {

    const { collection: collectionsQueryString, categories: categoriesQueryString } = useLocalSearchParams();
    const { data: collectionsData, called: collectionsCalled } = useGetCollectionsQuery()
    const { data: categoriesData } = useCategoryPathsQuery({
        variables: {
            channel: getConfig().channel
        }
    })

    const { setCategoryFilters, selectedCategories, } = useProductContext();


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

    const numberOfFilters = selectedCategories.length;

    return (
        <View style={styles.wrapper}>

            <View style={[styles.filterWrapper, (numberOfFilters !== 0) && {
                backgroundColor: "white"
            }]}>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.background,
                }}>
                    <Button
                        style={[
                            styles.filterButton,
                            numberOfFilters !== 0 && {
                                backgroundColor: "black",
                                borderRadius: 3,
                            }
                        ]}
                        onPress={() => openFilters()}
                        icon={() => <FontAwesome name="filter" size={15} color={numberOfFilters !== 0 ? "white" : colors.secondary} />}
                        contentStyle={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }} // Adds spacing
                        labelStyle={[
                            styles.filterText,
                            numberOfFilters !== 0 && { color: "white" }
                        ]}
                    >
                        <Text>Filtres</Text>
                    </Button>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    filterLabel: {
        fontSize: fonts.caption,

    },
    filterButton: {
        margin: 0,
        borderWidth: 1,
        backgroundColor: colors.background,
    },
    wrapper: {
        width: "100%",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    filterWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",

    },
    filterText: {
        fontSize: fonts.caption
    }
});

export default FilterBar;
