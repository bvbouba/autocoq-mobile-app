import { useFormik } from "formik";
import { FC, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Modal } from "react-native-paper";
import * as yup from "yup";
import CheckBoxWithLabel from "@/utils/CheckboxWithLabel";
import { getConfig } from "@/config";
import { useProductContext } from "@/context/useProductContext";
import { CategoryPathFragment, useCategoryPathsQuery, useGetCollectionsQuery } from "@/saleor/api.generated";
import { colors, Divider, fonts, Text, View } from "@/components/Themed";

interface Props {
    open: boolean
    onClose: () => void
    onApply: (data: {
        categories: CategoryPathFragment[]
    }) => void
}

interface Form {
    collection: string,
    categories: string[]
}

const validationSchema = yup.object().shape({
    collection: yup.string().required("Required"),
    categories: yup.array().required("Required"),
});



const ProductFilterBottomSheet: FC<Props> = ({ open, onClose, onApply }) => {

    const { data: collectionsData } = useGetCollectionsQuery();
    const { data: categoriesData } = useCategoryPathsQuery({
        variables: {
            channel: getConfig().channel
        }
    });

    const {  selectedCategories } = useProductContext();
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
        <Text style={styles.bigTitle}>Filtrer & Trier</Text>
                  <Divider style={{ borderBottomWidth: 5 }} />



            <View style={styles.filterTypeContainer}>
                <Text style={styles.filterTypeTitle}>Catégories</Text>
                {categoriesData?.categories?.edges && categoriesData.categories?.edges
                    .map(cat =>
                        <CheckBoxWithLabel
                            status={formik.values.categories.find(c => c === cat.node.slug) ? "checked" : "unchecked"}
                            key={cat.node.id}
                            onPress={() => {
                                if (formik.values.categories.find(c => c === cat.node.slug)) {
                                    const removed = formik.values.categories.filter(c => c !== cat.node.slug);
                                    formik.setFieldValue("categories", [...removed])
                                } else {
                                    formik.setFieldValue("categories", [...formik.values.categories, cat.node.slug])
                                }
                            }}
                            label={cat.node.name}
                            
                        />
                    )}
            </View>
        </ScrollView>
        <View style={styles.buttonGroup}>
            <Button style={styles.primaryButton} mode="contained" onPress={submitForm}><Text>Apply</Text></Button>
            <Button style={styles.secondaryButton} mode="text"  textColor="black" onPress={() => formik.resetForm()}><Text>Reset</Text></Button>
        </View>
    </Modal >
    );
};

const styles = StyleSheet.create({
    bigTitle: {
        fontWeight: "bold",
        marginBottom: 8,
        fontSize:fonts.h1
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
        marginBottom: 16
    },
    buttonGroup: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16

    },
    primaryButton:{
    backgroundColor: colors.primary,
    marginTop:10,
    borderRadius: 3,
    alignItems: "center",
    width:"45%"
    },
    secondaryButton: {
        marginTop:10,
        borderRadius: 3,
        alignItems: "center",
        backgroundColor:"white",
        borderWidth:1,
        borderColor:"black",
        width:"45%",
    }
})

export default ProductFilterBottomSheet;