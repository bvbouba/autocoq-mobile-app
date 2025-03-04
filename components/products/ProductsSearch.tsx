import { FC, } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper'
import { colors, fonts } from '../Themed';

import { useRouter } from 'expo-router';  // Correct import
import { useCheckout } from '@/context/CheckoutProvider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useModal } from '@/context/useModal';
import SearchUI from './SearchUI';

interface Props {
    cleanSearch?: boolean;
    searchOnLoad?: boolean;
    carIconColor?:string;
}

interface Form {
    search: string;
}

const ProductSearch: FC<Props> = ({ cleanSearch, searchOnLoad = true,carIconColor }) => {
    // Use the correct hook from expo-router
    const router = useRouter();
    const { checkout } = useCheckout();
    const {openModal} = useModal()

    const number = checkout && checkout.lines.length > 0 ? checkout.lines.map(line => line.quantity).reduce((prev, curr) => prev + curr, 0) : undefined

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.textInputWrapper}>
                <Pressable onPress={() => openModal({
                    id:"search",
                    content:<SearchUI />,
                    marginTop:0,
                    height:"130%"
                    })} >
                <View pointerEvents="none">
                <TextInput
                    mode="outlined"
                    style={styles.searchBar}
                    placeholder="Rechercher des pièces"
                    outlineColor={colors.border}
                    placeholderTextColor={colors.textSecondary}
                    left={
                        <TextInput.Icon
                            icon="magnify"
                        />
                    }
                />
                </View>
                </Pressable>
            </View>
            <TouchableOpacity onPress={()=>router.push("/cart")}>
            <View style={{ position: "relative", padding: 10, backgroundColor: colors.background, borderRadius: 20 }}>
                <FontAwesome size={18} name="shopping-cart" color={carIconColor ? carIconColor : colors.primary} />
                {number && (
                    <View style={styles.cartCountIcon}>
                        <Text style={{ color: "white", fontSize: fonts.sm, fontWeight: "bold" }}>{number}</Text>
                    </View>
                )}
            </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ProductSearch;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap:4
    },
    textInputWrapper: {
        display: "flex",
        width: "92%",
    },
    searchBar: {
        height: 36,
        lineHeight: 18,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 1,
        backgroundColor: colors.background,
        color: colors.secondary,
    },
    cartCountIcon: {
        position: 'absolute',
        right: -0,
        top: -0,
        backgroundColor: colors.textPrimary,
        color: "white",
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontSize: fonts.sm,
        fontWeight: "bold",
        lineHeight: 18,
    },
});
