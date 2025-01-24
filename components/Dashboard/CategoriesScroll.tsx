import { FC } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { PaddedView, Text, View } from "../Themed";
import { CategoryPathFragment } from "../../saleor/api.generated";

interface Props {
    categories: CategoryPathFragment[];
    onClick: (category: string) => void;
}

const CategoriesScroll: FC<Props> = ({ categories, onClick }) => {
    const categoryItems = categories.filter(cat=>cat.level===0)
        ?.map((cat) => {
            const media = cat?.backgroundImage;
            const product =
                cat.products?.edges && cat.products.edges.length > 0
                    ? cat.products.edges[0]
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
                name: cat.name,
                slug: cat.slug,
            };
        })
        .filter((item) => !!item.url) || [];

    return (
        <View style={styles.container}>
            <View style={styles.paddedTitle}>
                <Text style={styles.collectionListTitle}>Categories</Text>
            </View>
            <View style={styles.gridContainer}>
                {categoryItems.map((item, index) => (
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
    },
    collectionListTitle: {
        fontSize: 18,
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
        width: "100%", // Take the full width of the grid item
        aspectRatio: 1, // Ensures a square container
        marginBottom: 8, // Space between image and text
    },
    image: {
        width: "100%",
        height: "100%",
    },
    itemText: {
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default CategoriesScroll;
