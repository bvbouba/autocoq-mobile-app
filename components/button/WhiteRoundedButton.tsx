import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, Pressable } from "react-native";
import { Button } from "react-native-paper";
import { colors, fonts } from "../Themed";

interface Props {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  style?: object;
}

export const WhiteButton: React.FC<Props> = ({
  onPress,
  title,
  loading = false,
  disabled = false,
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
        <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

export default WhiteButton;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: colors.secondary,
    padding:5
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    fontSize: fonts.sm
  },
});
