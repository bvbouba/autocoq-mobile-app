import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the close icon

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
      {/* Scrollable pill list */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillContainer}>
        {pills.map(({ label, attributeSlug, choiceSlug }) => (
          <TouchableOpacity
            key={`${attributeSlug}-${choiceSlug}`}
            onPress={() => onRemoveAttribute(attributeSlug, choiceSlug)}
            style={styles.pill}
          >
            <Text style={styles.pillText}>{label}</Text>
            <FontAwesome name="times" size={12} color="#fff" style={styles.closeIcon} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Clear All button */}
      {pills.length > 0 && (
        <TouchableOpacity onPress={onClearFilters} style={styles.clearButton}>
          <Text style={styles.clearText}>Tout effacer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  pillContainer: {
    flexDirection: "row",
    flexGrow: 1,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  pillText: {
    color: "#fff",
    fontSize: 14,
    marginRight: 5,
  },
  closeIcon: {
    marginLeft: 4,
  },
  clearButton: {
    marginLeft: 10,
  },
  clearText: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default FilterPills;
