import { Skeleton } from "moti/skeleton";
import { View, StyleSheet } from "react-native";
import ProductListItemSkeleton from "./ProductListItem";
import { colors } from "../Themed";

export default function ProductCollectionSkeleton() {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.wrapper}>
                    <View style={styles.filterWrapper}>
                        <View style={{ marginRight: 10 }}>
                            <Skeleton height={40} width={100} radius={2} colorMode="light" />
                        </View>
                        {/* <Skeleton height={20} width={60} radius={4} colorMode="light" /> */}
                    </View>
                </View>
                <View style={{ padding: 10 }}>
                    {[...Array(4)].map((_, index) => (
                        <ProductListItemSkeleton key={index} />
                    ))}
                </View>
            </View>
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterContainer: {
        flexDirection: "column",
        // paddingBottom: 10,
    },
    wrapper: {
        width: "100%",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: colors.border,
    },
    filterWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",

    },
});
