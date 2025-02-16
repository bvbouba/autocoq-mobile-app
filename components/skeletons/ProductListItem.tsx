import { Skeleton } from "moti/skeleton";
import { View, StyleSheet } from "react-native";
import { Divider } from "../Themed";

export default function ProductListItemSkeleton() {
    return (
        <>
            <View style={styles.productItem}>
                <View style={styles.imageWrapper}>
                    <View>
                        <Skeleton height={100} width={100} radius={4} colorMode="light" />
                    </View>
                    <View style={styles.productDetailWrapper}>
                        <View>
                            <Skeleton height={25} width="80%" radius={4} colorMode="light" />
                        </View>
                        <Skeleton height={20} width="40%" radius={4} colorMode="light" />
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 5
                        }}>
                            <Skeleton height={20} width="60%" radius={4} colorMode="light" />
                        </View>

                        <Skeleton height={30} width="100%" radius={4} colorMode="light" />
                        <Skeleton height={30} width="100%" radius={4} colorMode="light" />

                        <View style={styles.buttonContainer}>
                            <Skeleton height={40} width="95%" radius={4} colorMode="light" />
                        </View>
                    </View>

                </View>
            </View>
            <Divider style={{ borderBottomWidth: 5, marginTop: 0, marginBottom: 0 }} />
        </>
    );
};


const styles = StyleSheet.create({
    productItem: {
        width: "100%",
        padding: 10,
        paddingTop: 20,
        minHeight: 300,
    },
    imageWrapper: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    productDetailWrapper: {
        flex: 1,
        gap: 10,
        paddingHorizontal: 5,
    },
    tinyLogo: {
        width: 100,
        height: 100,
        flexShrink: 0,
    },

    productDescription: {
        textAlign: "left",
    },
    buttonContainer: {
        alignItems: "center",
    },



});