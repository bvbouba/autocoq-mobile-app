import { View, Text, PaddedView, Divider, fonts, colors } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { useGetMenuItemQuery, useGetMenuQuery } from "@/saleor/api.generated";
import { useLocalSearchParams, useRouter } from "expo-router";

import ListItem from "../ListItem";
import { useEffect } from "react";
import { useNavigationContext } from "@/context/NavigationContext";
import { useLoading } from "@/context/LoadingContext";
import { Skeleton } from "moti/skeleton";

const CategoryList = () => {
    const { setLoading } = useLoading();
    const { setNavigationParams } = useNavigationContext();
    const router = useRouter();

    const { id } = useLocalSearchParams();

    // Fetch Level 0 menu
    const { data: menuData, loading: menuLoading} = useGetMenuQuery({
        variables: {
            channel: "ci",
            slug: "shop",
        },
        skip: !!id, // Skip if ID exists (meaning user is at a deeper level)
    });

    // Fetch Subcategories (Level 1+)
    const { data: menuItemData, loading: menuItemLoading } = useGetMenuItemQuery({
        variables: {
            channel: "ci",
            id: id ? String(id) : "",
        },
        skip: !id, // Skip if no ID exists (meaning user is at Level 0)
    });

    useEffect(() => {
        setLoading(menuLoading || menuItemLoading);
    }, [menuLoading, menuItemLoading]);

    useEffect(() => {
        if (id && !menuItemLoading && menuItemData?.menuItem) {
            setNavigationParams(menuItemData.menuItem.parent?.id || "");
        }
    }, [id, menuItemLoading, menuItemData, setNavigationParams,menuData]);

    if (menuItemLoading) {
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
    
    const menu = menuData?.menu 
    const menuItem = menuItemData?.menuItem 

    // Ensure we don't return null for Level 0
    if (!menuItem && !menu) return null;

    const children = menuItem?.children || menu?.items || [];
    const categoryName = menuItem ? menuItem.name : "Voir par catégorie";

    return (
        <View style={styles.container}>
            <PaddedView>
                <Text style={styles.categoryListTitle}>{categoryName}</Text>
            </PaddedView>
            <PaddedView style={{ flexDirection: "column" }}>
                {children.map((child) => {
                    const greatChild = child.children;
                    const icon = child.category?.metadata.find(m => m.key === "icon");
                    const onPress = () => {
                        if (greatChild && greatChild.length > 0) {
                            router.push(`/shop?id=${child.id}`);
                        } else {
                            router.push(`/categories/${child.category?.slug}`);
                        }
                    };
                    return (
                        <View key={child.id}>
                            <ListItem name={child.name} onPress={onPress} icon={icon?.value} />
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
        color: colors.textPrimary,
    },
});

export default CategoryList;
