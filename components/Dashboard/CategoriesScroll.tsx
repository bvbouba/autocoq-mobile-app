import { FC } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { colors, Text, View } from "../Themed";
import {  MenuItemFragment } from "../../saleor/api.generated";

interface Props {
    menus: MenuItemFragment[];
    onClick: (category: string) => void;
}

const CategoriesScroll: FC<Props> = ({ menus, onClick }) => {
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
        <View style={styles.container}>
            <View style={styles.paddedTitle}>
                <Text style={styles.collectionListTitle}>{"Catégories Populaires"}</Text>
                {/* <Text style={styles.viewAll}>Tout voir</Text> */}
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
        </View>
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
        fontSize: 16,
        lineHeight: 34,
        fontWeight: "bold",
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
        fontSize:13,
        fontWeight:400,
        textAlign: "center",
    },
    viewAll: {
        fontSize: 13,
        color: colors.primary,
        textDecorationLine: 'underline', 
        verticalAlign:'middle'
    },
});

export default CategoriesScroll;
