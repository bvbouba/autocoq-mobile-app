import React, { FC, useCallback, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../Themed';

import { useRouter, useGlobalSearchParams } from 'expo-router';  // Correct import
import { useFormik } from 'formik';

interface Props {
    cleanSearch?: boolean;
    searchOnLoad?: boolean;
}

interface Form {
    search: string;
}

const ProductSearch: FC<Props> = ({ cleanSearch, searchOnLoad = true }) => {
    // Use the correct hook from expo-router
    const {
        search: searchQueryString,
        collection: collectionsQueryString,
        categories: categoriesQueryString
    } = useGlobalSearchParams();
    const router = useRouter();

    // Ensure that searchQueryString, collectionsQueryString, and categoriesQueryString are strings
    const search = Array.isArray(searchQueryString) ? searchQueryString[0] : searchQueryString;
    const collections = Array.isArray(collectionsQueryString) ? collectionsQueryString[0] : collectionsQueryString;
    const categories = Array.isArray(categoriesQueryString) ? categoriesQueryString[0] : categoriesQueryString;

    const formik = useFormik<Form>({
        initialValues: {
            search: search || "",  // Default to an empty string if undefined
        },
        initialTouched: {
            search: false,
        },
        onSubmit: () => {
            // No-op for form submission
        },
    });

    const runSearch = useCallback((value: string) => {
        if (cleanSearch) {
            const params = new URLSearchParams();
            if (value) {
                params.append("search", value);
            }
            router.push("/products/results?" + params.toString());
        }

        const params = new URLSearchParams();
        if (value) {
            params.append("search", value);
        }

        if (collections) {
            params.append("collection", collections);
        }
        if (categories) {
            params.append("categories", categories);
        }

        router.push("/products/results?" + params.toString());
    }, [categories, collections]);

    useEffect(() => {
        if (searchOnLoad && (search || collections || categories)) {
            runSearch(search || "");
        }
        formik.setFieldValue("search", search || "");
    }, [searchOnLoad, search, collections, categories]);

    const onChange = (value: string) => {
        formik.setFieldValue("search", value);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.textInputWrapper}>
                <TextInput
                    placeholderTextColor={colors.textInputGrey}
                    onChangeText={onChange}
                    onSubmitEditing={() => {
                        runSearch(formik.values.search);
                    }}
                    value={formik.values.search}
                    style={styles.searchBar}
                    placeholder="Search" />
            </View>
        </SafeAreaView>
    );
};

export default ProductSearch;

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    textInputWrapper: {
        display: "flex",
        width: "100%",
    },
    searchBar: {
        height: 36,
        lineHeight: 18,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 1,
        backgroundColor: colors.textInputGreyBackground,
        color: colors.textInputGrey,
    },
});
