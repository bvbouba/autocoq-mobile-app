import { FC } from "react";
import { Image, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { colors, fonts, SurfaceView, Text, View } from "@/components/Themed";
import {  MenuItemFragment } from "@/saleor/api.generated";
import { useRouter } from "expo-router";

interface Props {
    menus: MenuItemFragment[];
    onClick: (category: string) => void;
}

const CategoriesScroll: FC<Props> = ({ menus, onClick }) => {
    const router = useRouter()
    const items = menus.map((menu) => {
            const media = menu.category?.backgroundImage;
            const product =
                menu.category?.products?.edges && menu.category.products.edges.length > 0
                    ? menu.category.products.edges[0]
                    : undefined;
            const productMedia =
                product &&
                product.node.media &&
                product.node.media.length > 0
                    ? product.node.media[0]
                    : undefined;

            return {
                url: media?.url || productMedia?.url,
                alt: media?.alt || productMedia?.alt,
                name: menu.name,
                slug: menu.category?.slug||"",
            };
        })
        .filter((item) => !!item.url) || [];

    return (
        <SurfaceView style={styles.container}>
            <View style={styles.paddedTitle}>
                <Text style={styles.collectionListTitle}>{"Catégories Populaires"}</Text>
               <TouchableOpacity 
               onPress={()=>router.push("/shop?slug=pieces-auto")}
               >
                <Text style={styles.viewAll}>Tout voir</Text></TouchableOpacity> 
            </View>
            
            <View style={styles.gridContainer}>
                {items.map((item, index) => (
                    <Pressable
                        key={index}
                        onPress={() => onClick(item.slug)}
                        style={styles.gridItem}
                    >
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.url }}
                                resizeMode="contain"
                                style={styles.image}
                            />
                        </View>
                        <Text style={styles.itemText}>{item.name}</Text>
                    </Pressable>
                ))}
            </View>
        </SurfaceView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingBottom: 16, // Add some space below the grid
    },
    paddedTitle: {
        paddingTop: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    collectionListTitle: {
        fontSize: fonts.h2,
        lineHeight: 34,
        fontWeight: "600",
        textAlign: "left",
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 16, // Space above the grid
    },
    gridItem: {
        width: "30%",
        marginBottom: 16, // Space between rows
        alignItems: "center",
    },
    imageContainer: {
        width: "60%", // Take the full width of the grid item
        aspectRatio: 1, // Ensures a square container
        marginBottom: 8, // Space between image and text
    },
    image: {
        width: "100%",
        height: "100%",
    },
    itemText: {
        fontSize:fonts.body,
        fontWeight:400,
        textAlign: "center",
    },
    viewAll: {
        fontSize:fonts.body,
        color: colors.primary,
        textDecorationLine: 'underline', 
        verticalAlign:'middle'
    },
});

export default CategoriesScroll;
