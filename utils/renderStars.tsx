import { colors } from "@/components/Themed";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View } from "react-native";

export const renderStars = (rating: number) => {
    const maxStars = 5;
    return (
        <View style={{ flexDirection: "row", marginTop: 5 }}>
            {[...Array(maxStars)].map((_, index) => (
                <FontAwesome
                    key={index}
                    name={index < rating ? "star" : "star-o"}
                    size={12}
                    color={index < rating ? colors.primary : colors.border}
                    style={{ marginRight: 2 }}
                />
            ))}
        </View>
    );
};
