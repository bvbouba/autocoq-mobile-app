import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome from Expo
import { colors, fonts, PaddedView } from "@/components/Themed";
import { useLoading } from "@/context/LoadingContext";

export interface FilterDropdownOption {
  id: string;
  label: string;
  slug: string;
  chosen: boolean;
}

export interface FilterDropdownProps {
  label: string;
  options?: FilterDropdownOption[];
  attributeSlug: string;
  optionToggle: (attributeSlug: string, choiceSlug: string) => void;
  removeAttributeFilter: (attributeSlug: string, choiceSlug: string) => void
}

export function FilterDropdown({
  label,
  attributeSlug,
  optionToggle,
  removeAttributeFilter,
  options: propOptions, // Rename to avoid confusion
}: FilterDropdownProps) {
  const [options, setOptions] = useState(propOptions); // Store options in state
  const {setLoading, isLoading} = useLoading()
  useEffect(() => {
    setOptions(propOptions);
  }, [propOptions]);

  const handleOptionPress = async (option:FilterDropdownOption) => {
    if (isLoading) return;
    setLoading(true); 
    const newOptions = options?.map((opt) =>
      opt.id === option.id ? { ...opt, chosen: !opt.chosen } : opt
    );
    setOptions(newOptions); // Update UI instantly

    try {
      if (option.chosen) {
        removeAttributeFilter(attributeSlug, option.slug);
      } else {
       optionToggle(attributeSlug, option.slug);
      }
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <PaddedView style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {options?.map((option,index) => (
        <TouchableOpacity
          key={index}
          style={styles.radioOption}
          onPress={() => handleOptionPress(option)}
          disabled={isLoading}
        >
          <View style={[styles.radioCircle, option.chosen && styles.radioCircleSelected]}>
            {option.chosen && <FontAwesome name="check" size={12} color="white" />}
          </View>

          <Text style={styles.optionText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </PaddedView>
  );
}


const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: fonts.body,
    fontWeight: "600",
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    
  },
  radioCircle: {
    width: 20, 
    height: 20, 
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.border, 
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  radioCircleSelected: {
    borderColor: colors.primary,
    backgroundColor:colors.primary
  },
  optionText: {
    fontSize: fonts.body,
  },
});

export default FilterDropdown;
