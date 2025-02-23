import { View, Text, PaddedView, Divider, fonts, colors } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { useCategoryBySlugQuery } from "@/saleor/api.generated";
import { useLocalSearchParams, useRouter } from "expo-router";

import { mapEdgesToItems } from "@/utils/map";
import ListItem from "../ListItem";
import { useEffect } from "react";
import { useNavigationContext } from "@/context/NavigationContext";
import { useLoading } from "@/context/LoadingContext";
import { Skeleton } from "moti/skeleton";

const CategoryList = () => {
    const { setLoading } = useLoading();
    const { setNavigationSlug } = useNavigationContext();
    const router = useRouter();

    const { slug } = useLocalSearchParams();
    const { data, loading, previousData } = useCategoryBySlugQuery({
        variables: {
            slug: slug ? String(slug) : "pieces-auto"
        }
    });

    useEffect(() => {
        setLoading(loading);
    }, [loading]);

    if (loading && !previousData) {
        return (
            <View style={styles.container}>
                <PaddedView>
                    <Skeleton colorMode="light" height={30} width={180} radius={2} />
                </PaddedView>
                <PaddedView style={{ flexDirection: "column" }}>
                    {[...Array(4)].map((_, index) => (
                        <View key={index}>
                            <Skeleton colorMode="light" height={20} width="100%" radius={2} />
                            <Divider />
                        </View>
                    ))}
                </PaddedView>
            </View>
        );
    }

    const category = data?.category || previousData?.category;
    if (!category) return null;

    setNavigationSlug(category.parent?.slug || "");

    const childrens = mapEdgesToItems(category.children);
    const categoryName = childrens ? category.name : "Voir par catégorie";

    return (
        <View style={styles.container}>
            <PaddedView>
                
                <Text style={styles.categoryListTitle}>{categoryName}</Text>
            </PaddedView>
            <PaddedView style={{ flexDirection: "column" }}>
                {childrens.map((children) => {
                    const child = mapEdgesToItems(children.children);
                    const icon = children.metadata.find(m=>m.key==="icon")
                    const onPress = () => {
                        if (child.length > 0) {
                            router.push(`/shop?slug=${children.slug}`);
                        } else {
                            router.push(`/categories/${children.slug}`);
                        }
                    };
                    return (
                        <View key={children.id}>
                            <ListItem name={children.name} onPress={onPress} icon={icon?.value}/>
                            <Divider />
                        </View>
                    );
                })}
            </PaddedView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    categoryListTitle: {
        fontSize: fonts.h2,
        lineHeight: 34,
        fontWeight: "bold",
        textAlign: "left",
        color:colors.textPrimary
    },
});

export default CategoryList;
