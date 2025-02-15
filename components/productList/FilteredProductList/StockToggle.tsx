import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // For optional icon

export interface StockToggleProps {
  enabled: boolean;
  onChange: (checked: boolean) => void;
}

const StockToggle: React.FC<StockToggleProps> = ({ enabled, onChange }) => {
  return (
    <View style={styles.container}>
      {/* Toggle Switch */}
      <Switch
        trackColor={{ false: "#ccc", true: "#007bff" }}
        thumbColor={enabled ? "#fff" : "#f4f4f4"}
        ios_backgroundColor="#ccc"
        onValueChange={onChange}
        value={enabled}
      />
      {/* Label */}
      <Text style={styles.label}>En stock</Text>
      {/* Optional FontAwesome Icon (if needed) */}
      {enabled ? (
        <FontAwesome name="check-circle" size={18} color="#007bff" style={styles.icon} />
      ) : (
        <FontAwesome name="times-circle" size={18} color="#ccc" style={styles.icon} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  icon: {
    marginLeft: 5,
  },
});

export default StockToggle;
