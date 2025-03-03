import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, Pressable } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "@/components/Themed";

interface Props {
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  style?: object;
}

export const RoundedButton: React.FC<Props> = ({
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
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
};

export default RoundedButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    alignItems: "center",
    width: "95%",
    padding:8
  },
  pressed: {
    opacity: 0.6, // Makes the button slightly transparent when pressed
  },
  text: {
    color: "#fff",
    fontWeight: "400",
  },
});
