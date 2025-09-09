import { View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from "@/components/Themed";


export const StarRating = ({ rating,size=12 }: { rating: number ,size?:number}) => (
  <View style={styles.starContainer}>
    {[...Array(5)].map((_, index) => (
      <FontAwesome
        key={index}
        name={index < rating ? "star" : "star-o"}
        size={size}
        color={colors.primary}
      />
    ))}
  </View>
);

// Styles
const styles = StyleSheet.create({
    starContainer: {
      flexDirection: "row",
      marginRight: 8,
    },
    
  });