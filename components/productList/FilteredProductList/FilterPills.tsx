import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the close icon
import { colors, fonts } from "@/components/Themed";
import { Button } from "react-native-paper";

export interface FilterPill {
  label: string;
  choiceSlug: string;
  attributeSlug: string;
}

export interface FilterPillsProps {
  pills: FilterPill[];
  onRemoveAttribute: (attributeSlug: string, choiceSlug: string) => void;
  onClearFilters: () => void;
}

export function FilterPills({ pills, onRemoveAttribute, onClearFilters }: FilterPillsProps) {
  return (
    <View style={styles.container}>

      <View style={styles.pillContainer}>
        {pills.map(({ label, attributeSlug, choiceSlug }) => (
          <Button
            key={`${attributeSlug}-${choiceSlug}`}
            onPress={() => onRemoveAttribute(attributeSlug, choiceSlug)}
            style={styles.filterButton}
          >
            <Text style={styles.pillText}>{`${label} `}</Text>
            <FontAwesome name="times" size={12} color={colors.secondary} style={styles.closeIcon} />
          </Button>
        ))}
             {/* Clear All button */}
      {pills.length > 0 && (
        <Button onPress={onClearFilters} style={styles.clearButton}>
          <Text style={styles.clearText}>Tout effacer</Text>
        </Button>
      )}
      </View>

 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  pillContainer: {
    flexDirection: "row",
    flexGrow: 1,
  },
  filterButton: {
    margin: 0,
    borderWidth: 1,
    borderRadius:2,
    backgroundColor: colors.background,
    marginLeft:5
},
  pillText: {
    color: colors.textPrimary,
    fontSize: fonts.caption,
  },
  closeIcon: {
    color: colors.textPrimary,
  },
  clearButton: {
    marginLeft: 10,
    borderWidth:1
  },
  clearText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default FilterPills;
