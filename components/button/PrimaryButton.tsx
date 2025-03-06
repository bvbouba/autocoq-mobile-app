import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, Pressable } from "react-native";
import { Button } from "react-native-paper";
import { colors, fonts } from "@/components/Themed";

interface Props {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  mode?: "text" | "outlined" | "contained";
  style?: object;
}

export const PrimaryButton: React.FC<Props> = ({
  onPress,
  title,
  loading = false,
  disabled = false,
  mode = "contained",
  style = {},
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => [
        styles.button,
        isPressed || pressed ? styles.pressed : null,
        style,
      ]}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6, // Makes the button slightly transparent when pressed
  },
  text: {
    fontWeight: "bold",
    color: "white",
    fontSize:fonts.body
  },
});
