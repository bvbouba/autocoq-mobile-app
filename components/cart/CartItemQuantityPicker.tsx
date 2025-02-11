import { FC } from "react"

import { View, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { Text } from "@/components/Themed"

interface Props {
    onSelect: (value: number) => void
    value: number
    disabled?: boolean
}

const CartItemQuantityPicker: FC<Props> = ({ onSelect, value, disabled }) => {
    return <View style={styles.container}>
        <IconButton style={{marginTop: -5, right:4}} icon="minus" onPress={() => onSelect(value - 1)} disabled={disabled} />
        <View style={styles.valueContainer}>
            <Text>{value}</Text>
        </View>
        <IconButton style={{marginTop: -5, left:-4}} icon="plus" onPress={() => onSelect(value + 1)} disabled={disabled} />
    </View>
}

export default CartItemQuantityPicker


const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        width: 100,
        borderWidth:1,
        borderRadius:15,
        height:30
    
    },
    valueContainer: {
        marginTop: 5
    }
});