import React from "react";
import { ActivityIndicator, StyleSheet,Text } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "../Themed";

interface props {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  mode?: "text" | "outlined" | "contained";  
  style?: object;
}

export const SecondaryButton: React.FC<props> = ({
  onPress,
  title,
  loading = false,
  disabled = false,
  mode = "contained",
  style = {},
}) => {
  return (
    <Button
      style={[styles.button, style]}  
      onPress={onPress}
      mode={mode}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator color="white" /> : <Text style={{
        fontWeight:"400",
      }}>{title}</Text>}
    </Button>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondary, 
    paddingVertical: 0,
    margin:10,
    borderRadius: 30,
  },
});