import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome from Expo
import { colors, Divider, fonts } from "@/components/Themed";
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
  setList: React.Dispatch<React.SetStateAction<{
    select: FilterDropdownOption[];
    unselect: FilterDropdownOption[];
}>>;
}

export function FilterDropdown({
  label,
  options: propOptions, // Rename to avoid confusion
  setList,
}: FilterDropdownProps) {
  const [options, setOptions] = useState(propOptions); // Store options in state
  useEffect(() => {
    setOptions(propOptions);
  }, [propOptions]);

  const handleOptionPress = async (option: FilterDropdownOption) => {
    const newOptions = options?.map((opt) =>
      opt.id === option.id ? { ...opt, chosen: !opt.chosen } : opt
    );
    setOptions(newOptions);

        setList((prevList) => {
            const isSelected = option.chosen;
            const updatedSelect = isSelected
                ? prevList.select.filter((opt) => opt.id !== option.id)
                : [...prevList.select, { ...option, chosen: true }];

            const updatedUnselect = isSelected
                ? [...prevList.unselect, { ...option, chosen: false }]
                : prevList.unselect.filter((opt) => opt.id !== option.id);

            return { select: updatedSelect, unselect: updatedUnselect };
        });
   
};

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {options?.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.radioOption}
          onPress={() => handleOptionPress(option)}
        >
          <View style={[styles.radioCircle, option.chosen && styles.radioCircleSelected]}>
            {option.chosen && <FontAwesome name="check" size={12} color="white" />}
          </View>

          <Text style={styles.optionText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
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
