import { FC } from "react";
import { Image, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { colors, fonts, SurfaceView, Text, View } from "@/components/Themed";
import { MenuItemFragment } from "@/saleor/api.generated";
import { useRouter } from "expo-router";
import { Skeleton } from "moti/skeleton";

interface Props {
    menus: MenuItemFragment[];
    loading?: boolean;
}

const PopularCategoryGrid: FC<Props> = ({ menus, loading }) => {
    const router = useRouter();
    const items =
        menus.map((menu) => {
            const media = menu.category?.backgroundImage;
            const product =
                menu.category?.products?.edges && menu.category.products.edges.length > 0
                    ? menu.category.products.edges[0]
                    : undefined;
            const productMedia =
                product && product.node.media && product.node.media.length > 0
                    ? product.node.media[0]
                    : undefined;

            return {
                url: media?.url || productMedia?.url,
                alt: media?.alt || productMedia?.alt,
                name: menu.name,
                slug: menu.category?.slug || "",
                id:menu.category?.id 
            };
        }) || [];
    

    return (
        <SurfaceView style={styles.container}>
            <View style={styles.paddedTitle}>
            <View style={{
                        borderBottomWidth: 2, 
                        borderBottomColor: colors.primary,
                        paddingBottom: 0,
                    }}>
                <Text style={styles.collectionListTitle}>
                    {"Catégories Populaires"}</Text>
                    </View>
                <TouchableOpacity onPress={() => router.push("/shop?slug=pieces-auto")}>
                    <Text style={styles.viewAll}>Tout voir</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.gridContainer}>
                {loading
                    ? [...Array(6)].map((_, index) => (
                        <View key={index} style={styles.gridItem}>
                            <View style={styles.skeletonImageContainer}>
                                <Skeleton
                                    colorMode="light"
                                    height="100%"
                                    width="100%"
                                    radius={2}
                                />
                        
                            </View>
                        </View>
                    ))
                    : items.map((item, index) => (
                        <Pressable 
                        key={index}
                        onPress={() => router.push(`/categories/${item.id}`)}
                        style={({ pressed }) => [
                            styles.gridItem,
                            { opacity: pressed ? 0.3 : 1 } // Reduce opacity when pressed
                        ]}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.url }} resizeMode="contain" style={styles.image} />
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
        paddingBottom: 16,

    },
    paddedTitle: {
        paddingTop: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:"center",
    },
    collectionListTitle: {
        fontSize: fonts.h2,
        lineHeight: 34,
        fontWeight: "600",
        textAlign: "left",
        color:colors.textPrimary
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
    skeletonImageContainer: {
        width: "60%", // Matches imageContainer
        aspectRatio: 1, // Ensures the skeleton remains square
        borderRadius: 10,
        backgroundColor: "#E0E0E0",
    },
    skeletonTextContainer: {
        marginTop: 8, // Matches text spacing
    },
    image: {
        width: "100%",
        height: "100%",
    },
    itemText: {
        fontSize: fonts.body,
        fontWeight: "400",
        textAlign: "center",
        color:colors.textPrimary
    },
    viewAll: {
        fontSize: fonts.body,
        color: colors.primary,
        textDecorationLine: "underline",
        verticalAlign: "middle",
    },
});

export default PopularCategoryGrid;
