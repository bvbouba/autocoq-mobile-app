import { FC, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { AttributeFilterFragment, OrderDirection, ProductOrderField } from "@/saleor/api.generated";
import { colors, Divider, fonts, Text, View } from "@/components/Themed";
import FilterDropdown, { FilterDropdownOption } from "./FilterDropdown";
import { FilterPill } from "./FilterPills";
import { getFilterOptions } from "./attributes";
import SortingDropdown from "./SortingDropdown";
import { UrlSorting } from "./sorting";

interface Props {
    attributeFiltersData: AttributeFilterFragment[],
    addAttributeFilter: (attributeSlug: string, choiceSlug: string) => void,
    pills: FilterPill[],
    clearFilters: () => void,
    removeAttributeFilter: (attributeSlug: string, choiceSlug: string) => void,
    setSortBy: (value: React.SetStateAction<UrlSorting | null>) => void,
    sortBy: UrlSorting | null,
    itemsCounter: number
}


const ProductFilterBottomSheet: FC<Props> = ({
    attributeFiltersData,
    addAttributeFilter,
    pills,
    clearFilters,
    removeAttributeFilter,
    setSortBy,
    sortBy,
    itemsCounter
}) => {
    const [list, setList] = useState<{ select: FilterDropdownOption[]; unselect: FilterDropdownOption[] }>({
        select: [],
        unselect: [],
      });

      const handleApplyFilters = () => {
        // Remove all filters in the "unselect" list
        list.unselect.forEach((option) => removeAttributeFilter(option.slug, option.slug));
    
        // Add all filters in the "select" list
        list.select.forEach((option) => addAttributeFilter(option.slug, option.slug));
    
        // Reset the selection list after applying
        setList({ select: [], unselect: [] });
      };

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 50 }}>
            <View>
                <Text style={styles.bigTitle}>Filtrer et trier</Text>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: fonts.caption }}>
                        {itemsCounter} {`${itemsCounter < 2 ? " Résultat" : " Résultats"}`}
                    </Text>
                </View>
            </View>

            <SortingDropdown
                optionToggle={(field?: ProductOrderField, direction?: OrderDirection) =>
                    setSortBy(field && direction ? { field, direction } : null)
                }
                chosen={sortBy}
            />
            <Divider style={{ borderBottomWidth: 5 }} />

            <View style={styles.filterTypeContainer}>
                {attributeFiltersData
                    ?.filter(
                        (attribute, index, self) =>
                            self.findIndex((a) => a.id === attribute.id) === index
                    )
                    .map((attribute) => (
                        <FilterDropdown
                            key={attribute.id}
                            label={attribute.name || ""}
                            options={getFilterOptions(attribute, pills)}
                            setList={setList}
                        />
                    ))}
            </View>

            <View style={styles.buttonGroup}>
                <Button style={styles.secondaryButton} mode="text" textColor="black" onPress={clearFilters}>
                    <Text>RÉINITIALISER</Text>
                </Button>
                <Button style={styles.primaryButton} mode="contained" textColor="white" onPress={handleApplyFilters}>
                <Text style={{
                    color:"#fff"
                }}>APPLIQUER</Text>
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    bigTitle: {
        fontWeight: "bold",
        fontSize: fonts.h1
    },
    filterTypeTitle: {
        fontWeight: "bold",
        marginBottom: 8
    },
    collectionsContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    collectionsChip: {
        marginRight: 4,
        marginBottom: 8
    },
    filterTypeContainer: {
        marginBottom: 16,
        padding: 10
    },
    buttonGroup: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        marginBottom: 50

    },
    primaryButton: {
        backgroundColor: colors.secondary,
        marginTop: 10,
        borderRadius: 3,
        alignItems: "center",
        width: "45%"
    },
    secondaryButton: {
        marginTop: 10,
        borderRadius: 3,
        alignItems: "center",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        width: "45%",
    },
    closeButton: {
        top: 0,
        right: 0,
    },
})

export default ProductFilterBottomSheet;