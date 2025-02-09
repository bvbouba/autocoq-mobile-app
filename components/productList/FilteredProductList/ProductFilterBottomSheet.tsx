import { useFormik } from "formik";
import { FC, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Chip, Modal } from "react-native-paper";
import * as yup from "yup";
import CheckBoxWithLabel from "../../../utils/CheckboxWithLabel";
import { getConfig } from "../../../config";
import { useProductContext } from "../../../context/useProductContext";
import { AttributeFilterFragment, CategoryPathFragment, OrderDirection, ProductOrderField, useCategoryPathsQuery, useGetCollectionsQuery } from "../../../saleor/api.generated";
import { colors, Divider, fonts, Text, View } from "../../Themed";
import FilterDropdown, { FilterDropdownOption } from "./FilterDropdown";
import { FilterPill } from "./FilterPills";
import { getFilterOptions } from "./attributes";
import SortingDropdown from "./SortingDropdown";
import { UrlSorting } from "./sorting";

interface Props {
    open: boolean
    onClose: () => void
    onApply: (data: {
        categories: CategoryPathFragment[]
    }) => void,
    attributeFiltersData: AttributeFilterFragment[],
    addAttributeFilter: (attributeSlug: string, choiceSlug: string) => void,
    pills: FilterPill[],
    clearFilters: () => void,
    removeAttributeFilter: (attributeSlug: string, choiceSlug: string) => void,
    setSortBy: (value: React.SetStateAction<UrlSorting | null>) => void,
    sortBy: UrlSorting | null,
    itemsCounter: number
}

interface Form {
    collection: string,
    categories: string[]
}

const validationSchema = yup.object().shape({
    collection: yup.string().required("Required"),
    categories: yup.array().required("Required"),
});



const ProductFilterBottomSheet: FC<Props> = ({ 
    open, 
    onClose, 
    onApply, 
    attributeFiltersData, 
    addAttributeFilter, 
    pills, 
    clearFilters, 
    removeAttributeFilter, 
    setSortBy, 
    sortBy,
   itemsCounter
}) => {

    const { data: collectionsData } = useGetCollectionsQuery();
    const { data: categoriesData } = useCategoryPathsQuery({
        variables: {
            channel: getConfig().channel
        }
    });

    const { selectedCategories } = useProductContext();
    const containerStyle = { backgroundColor: 'white', padding: 20, maxHeight: 500 };

    const formik = useFormik<Form>({
        initialValues: {
            collection: "",
            categories: [],
        },
        validationSchema: validationSchema,
        onSubmit: () => { }
    });


    const submitForm = () => {
        const formData = formik.values
        onApply({
            categories: categoriesData?.categories?.edges
                .filter(cat => formData.categories.findIndex(formCat => formCat === cat.node.slug) !== -1)
                .map(edge => edge.node) || [],
        })
    }


    useEffect(() => {
        if (selectedCategories && categoriesData) {
            formik.setFieldValue("categories", selectedCategories.map(cat => cat.slug))
        }
    }, [selectedCategories, categoriesData])


    return (<Modal visible={open} onDismiss={onClose} contentContainerStyle={containerStyle}>
        <ScrollView>
            <View>
                <Text style={styles.bigTitle}>Filter & Sort</Text>
                <View style={{
                    flexDirection: "row"
                }}>

                    <Text style={{
                        fontSize: fonts.caption
                    }}>{itemsCounter} {`${(itemsCounter < 2) ? " Résultat" : " Résultats"}`}</Text></View>

            </View>

            <SortingDropdown
                optionToggle={(field?: ProductOrderField, direction?: OrderDirection) =>
                    setSortBy(field && direction ? { field, direction } : null)
                }
                chosen={sortBy}
            />
            <Divider style={{ borderBottomWidth: 5 }} />



            <View style={styles.filterTypeContainer}>

                {attributeFiltersData?.map((attribute) => (
                    <FilterDropdown
                        key={attribute.id}
                        label={attribute.name || ""}
                        optionToggle={addAttributeFilter}
                        attributeSlug={attribute.slug!}
                        options={getFilterOptions(attribute, pills)}
                        removeAttributeFilter={removeAttributeFilter}
                    />
                ))}

            </View>
        </ScrollView>
        <View style={styles.buttonGroup}>
            <Button style={styles.primaryButton} mode="contained" onPress={submitForm}>Apply</Button>
            <Button style={styles.secondaryButton} mode="text" textColor="black" onPress={() => clearFilters()}>Reset</Button>
        </View>
    </Modal >
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
        marginTop: 16

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
    }
})

export default ProductFilterBottomSheet;