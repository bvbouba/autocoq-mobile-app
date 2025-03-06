import React, { FC, useCallback, useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { colors, Divider, fonts } from '../Themed';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useFormik, FormikProps } from 'formik';
import { Ionicons } from '@expo/vector-icons'; // Arrow icon
import { useSearchByCategoryNameLazyQuery, useSearchByProductNameLazyQuery } from '@/saleor/api.generated';
import { debounce } from 'lodash';
import { useModal } from '@/context/useModal';
import { highlightMatch } from '@/utils/highlightMatch';
import { clearRecentSearchs, getRecentSearchs, setRecentSearchs,clearRecentSearchItem } from '@/context/recentSearchs';
import { useLoading } from '@/context/LoadingContext';

interface Props {}

interface Form {
    search: string;
}

const ProductSearch: FC<Props> = () => {
    const { search: searchQueryString } = useGlobalSearchParams();
    const router = useRouter();
    const { closeModal } = useModal();
    const {setLoading:setIsLoading} = useLoading()
    const [pressedItem, setPressedItem] = useState<string | null>(null);
    const search = Array.isArray(searchQueryString) ? searchQueryString[0] : searchQueryString;
    const [isPressed, setIsPressed] = useState(false);

    // ✅ State for suggestions
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]); // Store recent searches
    const [isTyping, setIsTyping] = useState(false); // To track if the user is typing

    // ✅ GraphQL Lazy Query Hooks
    const [searchByCategory] = useSearchByCategoryNameLazyQuery({
        onCompleted: (data) => {
            const categories = data?.categories?.edges.map((edge) => edge.node.name) || [];
            if (categories.length > 0) {
                setSuggestions(categories);
            } else {
                // If no categories, search by product name
                searchByProductName({ variables: { first: 10, filter: { search: formik.values.search }, channel: "ci" } });
            }
            setLoading(false);
        },
        onError: () => setLoading(false),
    });

    const [searchByProductName] = useSearchByProductNameLazyQuery({
        onCompleted: (data) => {
            const products = data?.products?.edges.map((edge) => edge.node.name) || [];
            setSuggestions(products);
            setLoading(false);
        },
        onError: () => setLoading(false),
    });

    // ✅ Debounced search function
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            if (!query.trim()) return;
            setLoading(true);
            // First search by category
            searchByCategory({
                variables: {
                    first: 10,
                    filter: { search: query },
                },
            });
        }, 300),
        []
    );

    // ✅ Formik setup with explicit types
    const formik: FormikProps<Form> = useFormik<Form>({
        initialValues: { search: search || "" },
        onSubmit: (): void => {
            runSearch(formik.values.search);
        },
    });

    // ✅ Run search when submitting
    const runSearch = useCallback(async (value: string): Promise<void> => {
        if (!value.trim()) return;
    
        setIsLoading(true);  // ✅ Start loading
    
        // Introduce a small delay to ensure the UI updates
        await new Promise((resolve) => setTimeout(resolve, 100));
    
        const params = new URLSearchParams();
        params.append("q", value);
        
        router.push(`/search?${params.toString()}`);
        closeModal("search");

        setRecentSearchs(value);
    
        setIsLoading(false); // ✅ End loading
    }, []);
    

    // ✅ Handle text change (Triggers debounce)
    const handleInputChange = (value: string) => {
        formik.setFieldValue("search", value);
        debouncedSearch(value);
        setIsTyping(value.trim() !== ""); // Track if the user is typing
    };

    // ✅ Handle suggestion click
    const handleSuggestionClick = (value: string) => {
        formik.setFieldValue("search", value);
        setSuggestions([]); // Hide suggestions after selection
        runSearch(value);
    };

    // ✅ Load recent searches on component mount
    useEffect(() => {
        const loadRecentSearches = async () => {
            const recent = await getRecentSearchs();
            setRecentSearches(recent || []);
        };
        loadRecentSearches();
    }, []);

    // ✅ Clear recent searches
    const handleClearAll = async () => {
        await clearRecentSearchs();
        setRecentSearches([]); // Clear state
    };

    const handleClearRecentSearchItem = async (item: string) => {
        await clearRecentSearchItem(item);    
        const updatedRecentSearches = await getRecentSearchs();    
        setRecentSearches(updatedRecentSearches || []);
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View style={styles.scrollContainer}>
                        <View>
                            <View style={styles.container}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        mode="outlined"
                                        onChangeText={handleInputChange}
                                        onSubmitEditing={() => runSearch(formik.values.search)}
                                        value={formik.values.search}
                                        style={styles.searchBar}
                                        placeholder="Rechercher des pièces"
                                        outlineColor={colors.border}
                                        activeOutlineColor={colors.primary}
                                        placeholderTextColor={colors.textSecondary}
                                        left={<TextInput.Icon icon="magnify" />}
                                    />
                                    {loading && <ActivityIndicator style={styles.loader} size="small" color={colors.textSecondary} />}
                                </View>

                                {/* Annuler Button */}
                                <TouchableOpacity onPress={() => closeModal("search")} style={{ marginLeft: 10 }}>
                                    <Text style={{
                                        fontSize: fonts.body,
                                        color: colors.textPrimary,
                                    }}>
                                        Annuler
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Divider style={{ borderBottomWidth: 10 }} />

                            {/* Recently Searched Section */}
                            {!isTyping && recentSearches.length > 0 && (
                                <View style={styles.recentSearchContainer}>
                                    <Text style={styles.recentSearchTitle}>Recherches récentes</Text>
                                    <TouchableOpacity onPress={handleClearAll}>
                                        <Text style={styles.clearAllText}>Tout effacer</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Show recent searches if available */}
                            {!isTyping && recentSearches.length > 0 && (
                                <FlatList
                                    data={recentSearches}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <View style={styles.recentSearchItem}>
                                            <TouchableOpacity
                                                style={{
                                                    
                                                }}
                                                onPress={() => runSearch(item)}
                                            >
                                                <Text style={styles.recentSearchText}>{item}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                            style={{
                                                marginRight:20
                                            }}
                                            onPress={() => handleClearRecentSearchItem(item)}>
                                                <Ionicons name="close-circle" size={15} color={colors.textSecondary} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            )}

                            {/* Live Search Suggestions */}
                            {isTyping && suggestions.length > 0 && (
                                <View style={styles.suggestionsContainer}>
                                    <FlatList
                                        data={suggestions}
                                        keyExtractor={(item, index) => `${item}-${index}`}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.suggestionItem}
                                                onPress={() => handleSuggestionClick(item)}
                                                onPressIn={() => setPressedItem(item)}
                                                onPressOut={() => setPressedItem(null)}
                                            >
                                                <View style={styles.suggestionRow}>
                                                    <Text style={[styles.suggestionText, pressedItem === item && styles.suggestionTextPressed]}>
                                                        {highlightMatch(item, formik.values.search)}
                                                    </Text>
                                                    <Ionicons name="arrow-forward" size={15} color={colors.textSecondary} />
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}
                        </View>

                        {/* Search Button */}
                        <View style={styles.bottomContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.searchButton,
                                    isPressed && { opacity: 0.6 }, 
                                ]}
                                onPress={() => runSearch(formik.values.search)}
                                onPressIn={() => setIsPressed(true)}
                                onPressOut={() => setIsPressed(false)}
                                activeOpacity={0.6}
                            >
                                <Text style={styles.searchButtonText}>Cliquez pour rechercher</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ProductSearch;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        paddingHorizontal:10
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    searchBar: {
        flex: 1,
        height: 40,
        backgroundColor: colors.background,
        color: colors.secondary,
    },
    safeContainer: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === 'ios' ? 0 : 60
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "space-between",
    },
    loader: {
        position: "absolute",
        right: 15,
        top: 10,
    },
    recentSearchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    recentSearchTitle: {
        fontSize: fonts.h2,
        color: colors.textPrimary,
        fontWeight: "bold",
    },
    clearAllText: {
        fontSize: fonts.body,
        color: colors.primary,
    },
    recentSearchItem: {
        padding: 10,
        borderBottomColor: colors.border,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    recentSearchText: {
        fontSize: fonts.body,
        color: colors.textPrimary,
    },
    noRecentSearchesText: {
        fontSize: fonts.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 10,
    },
    suggestionsContainer: {
        marginTop: 20,
    },
    suggestionItem: {
        padding: 10,
    },
    suggestionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    suggestionText: {
        fontSize: fonts.body,
        color: colors.textPrimary,
    },
    suggestionTextPressed: {
        color: colors.textSecondary,
    },
    bottomContainer: {
        marginBottom: 20,
        paddingHorizontal:10
    },
    searchButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginBottom: 10,
    },
    searchButtonText: {
        color: "white",
        fontSize: fonts.button,
        fontWeight: "bold",
    },
});
