import { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useProductContext } from '@/context/useProductContext';

import { useLocalSearchParams } from 'expo-router';
import { getConfig } from '@/config';
import { AttributeFilterFragment, CategoryPathFragment, useCategoryPathsQuery, } from '@/saleor/api.generated';
import { colors, fonts, Text, View } from '@/components/Themed';
import { Button, IconButton } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import FilterPills, { FilterPill } from './FilterPills';
import { useModal } from '@/context/useModal';
import FilterDropdown, { FilterDropdownOption } from './FilterDropdown';
import { getFilterOptions } from './attributes';

interface Props {
    openFilters: () => void;
    pills: FilterPill[];
    clearFilters: () => void;
    removeAttributeFilter: (attributeSlug: string, choiceSlug: string) => void;
    attributeFiltersData: AttributeFilterFragment[];
    addAttributeFilter: (attributeSlug: string, choiceSlug: string) => void
}

const FilterBar: FC<Props> = ({ openFilters, pills, clearFilters, removeAttributeFilter, attributeFiltersData,
    addAttributeFilter

}) => {
    const { openModal } = useModal()
    const { categories: categoriesQueryString } = useLocalSearchParams();
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
            console.log("setCategory")
            setCategoryFilters(foundCategories)
        }
        if (!categoriesQueryString) {
            setCategoryFilters([])
        }
    }, [categoriesQueryString, categoriesData])

    const numberOfFilters = selectedCategories.length;

    return (
        <View style={styles.wrapper}>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filterWrapper, (numberOfFilters !== 0) && {
                backgroundColor: "white"
            }]}>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5
                }}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            numberOfFilters !== 0 && {
                                backgroundColor: colors.secondary,
                                borderRadius: 1,
                            }
                        ]}
                        onPress={() => openFilters()}

                    >
                        <FontAwesome name="filter" size={15} color={numberOfFilters !== 0 ? "white" : colors.secondary} />
                        <Text
                            style={[
                                styles.filterText,
                                numberOfFilters !== 0 && { color: "white" }
                            ]}
                        >Filtres</Text>

                    </TouchableOpacity>

                    {attributeFiltersData
                        ?.filter(
                            (attribute, index, self) =>
                                self.findIndex((a) => a.id === attribute.id) === index
                        )
                        .map((attribute) => (
                            <TouchableOpacity
                                key={attribute.id}
                                style={styles.filterButton}
                                onPress={() =>
                                    openModal({
                                       id: "productFilter",
                                       content: <FilterDropdown
                                            key={attribute.id}
                                            label={attribute.name || ""}
                                            optionToggle={addAttributeFilter}
                                            attributeSlug={attribute.slug!}
                                            options={getFilterOptions(attribute, pills)}
                                            removeAttributeFilter={removeAttributeFilter}
                                        />
                                    })
                                }
                            >
                                <Text style={styles.filterText}>{attribute.name}</Text>
                                <FontAwesome name="chevron-down" size={12} color={colors.textPrimary} style={styles.icon} />
                            </TouchableOpacity>
                        ))}

                    {/* {pills.length > 0 && <FilterPills pills={pills} onClearFilters={clearFilters} onRemoveAttribute={removeAttributeFilter} />} */}


                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    filterLabel: {
        fontSize: fonts.caption,

    },
    filterButton: {
        marginVertical: 0,
        borderRadius: 2,
        padding:5,
        backgroundColor: colors.background,
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10
    },
    wrapper: {
        width: "100%",
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: colors.border,
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    filterWrapper: {
        width: "100%",
        display: "flex",
        flexDirection: "row",

    },
    filterText: {
        fontSize: fonts.caption
    },
    icon: {
        marginLeft: 2,
    }
});

export default FilterBar;
