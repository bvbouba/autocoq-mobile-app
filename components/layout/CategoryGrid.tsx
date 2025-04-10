import { View, Text, PaddedView, Divider, fonts, colors } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { MenuItemFragment } from "@/saleor/api.generated";
import {  useRouter } from "expo-router";

import ListItem from "../ListItem";
import { useNavigationContext } from "@/context/NavigationContext";

interface Props {
    menuItem: (MenuItemFragment & { children?: MenuItemFragment[] | null })[]; 
    categoryName: string;
    id: string | string[];
}

const CategoryGrid = ({ menuItem,categoryName,id }: Props) => {
    const router = useRouter();
    const { setNavigationLink } = useNavigationContext();
   
    return (
        <View style={styles.container}>
            <PaddedView>
                <Text style={styles.categoryListTitle}>{categoryName}</Text>
            </PaddedView>
            <PaddedView style={{ flexDirection: "column" }}>
                {menuItem.map((child) => {
                    const greatChild = child.children;
                    const icon = child.category?.metadata.find(m => m.key === "icon");
                    const onPress = () => {
                        if (greatChild && greatChild.length > 0) {
                            router.push(`/shop?id=${child.id}`);
                        } else {
                            setNavigationLink(`/shop?id=${id}`)
                            router.push(`/categories/${child.category?.id}`);
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

export default CategoryGrid;
