import { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useProductContext } from '@/context/useProductContext';

import { useLocalSearchParams } from 'expo-router';
import { getConfig } from '@/config';
import { AttributeFilterFragment, CategoryPathFragment, useCategoryPathsQuery,  } from '@/saleor/api.generated';
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
    attributeFiltersData: AttributeFilterFragment[]
}

const FilterBar: FC<Props> = ({ openFilters,pills,clearFilters,removeAttributeFilter,attributeFiltersData }) => {
    const [list, setList] = useState<{ select: FilterDropdownOption[]; unselect: FilterDropdownOption[] }>({
        select: [],
        unselect: [],
      }); 
    const {openModal} = useModal()
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
                    gap:5
                }}>
                    <Button
                        style={[
                            styles.filterButton,
                            numberOfFilters !== 0 && {
                                backgroundColor: colors.secondary,
                                borderRadius: 1,
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

                    {attributeFiltersData
                    ?.filter(
                        (attribute, index, self) =>
                            self.findIndex((a) => a.id === attribute.id) === index
                    )
                    .map((attribute) => (
                        <Button
                        icon={()=><IconButton icon="chevron-down" style={{}} size={12} />} 
                        style={styles.filterButton}
                        onPress={()=>openModal("productFilter",
                            <FilterDropdown
                            key={attribute.id}
                            label={attribute.name || ""}
                            options={getFilterOptions(attribute, pills)}
                            setList={setList}
                        />

                        )}>
                         <Text>
                            {attribute.name}
                         </Text>
                        </Button>
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
        borderWidth: 1,
        borderRadius:2,
        backgroundColor: colors.border,
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
    }
});

export default FilterBar;
