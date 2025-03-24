import { View, Text, PaddedView, Divider, fonts, colors } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { useGetMenuItemQuery } from "@/saleor/api.generated";
import { useLocalSearchParams, useRouter } from "expo-router";

import ListItem from "../ListItem";
import { useEffect } from "react";
import { useNavigationContext } from "@/context/NavigationContext";
import { useLoading } from "@/context/LoadingContext";
import { Skeleton } from "moti/skeleton";
import { useMenuContext } from "@/context/MenuProvider";
import CategoryGrid from "./CategoryGrid";

const CategoryList = () => {
    const { setLoading } = useLoading();
    const { setNavigationLink } = useNavigationContext();
    const router = useRouter();
    const { menu } = useMenuContext(); 
    
    const { id } = useLocalSearchParams();


    // Fetch Subcategories (Level 1+)
    const { data: menuItemData, loading, previousData } = useGetMenuItemQuery({
        variables: {
            channel: "ci",
            id: id ? String(id) : "",
        },
        skip: !id, // Skip if no ID exists (meaning user is at Level 0)
    });

    useEffect(() => {
        setLoading(loading);
    }, [ loading]);

    useEffect(() => {
        if (menuItemData?.menuItem) {
            if(menuItemData.menuItem.parent?.id) {
                setNavigationLink(`/shop?id=${menuItemData.menuItem.parent?.id}`)
            }else {
                setNavigationLink("/shop")
            } 
        }
    }, [id, menuItemData, setNavigationLink,menu]);

    if (loading) {
        return (
            <CategoryGrid  
                menuItem={previousData?.menuItem?.children|| menu?.items || []}
                categoryName={previousData?.menuItem ? previousData.menuItem?.name : "Voir par catégorie"}
                id={id}
                />
        );
    }
    
    const menuItem = menuItemData?.menuItem 

    // Ensure we don't return null for Level 0
    if (!menuItem && !menu) return null;

    const children = menuItem?.children || menu?.items || [];
    const categoryName = menuItem ? menuItem.name : "Voir par catégorie";
    
    return (
        <CategoryGrid  
        menuItem={children}
        categoryName={categoryName}
        id={id}
        />
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
