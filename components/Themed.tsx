/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, useColorScheme, View as DefaultView, StyleProp } from 'react-native';

import Colors from '../constants/Colors';
import { FC, PropsWithChildren } from 'react';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function PaddedView(props: ViewProps) {
  const { style, ...otherProps } = props;

  return <View style={[{ paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }, style]} {...otherProps} />;
}

interface DividerProps {
  style?: any
}

export function Divider(props: DividerProps) {
  return <View
    style={{
      marginTop: 10,
      marginBottom: 10,
      borderBottomColor: colors.border,
      borderBottomWidth: 0.5,
      ...(props.style || {})
    }}
  />
}

export const colors = {
  primary: "#ff6633",
  secondary:"#202124",
  background:"#F2F4F5",
  surface:"#ffffff",
  textPrimary: "#202124",
  textSecondary: "#878484",
  error: "#D32F2F",
  errorBg: "#FFE6E8",
  success: "#16B616",
  successBg:"#F6FFEF",
  warning: "#FFFF00",
  warningBg:"FFFFD2",
  info: "#1976D2",
  border: "#E0E0E0",
  disabled: "#BDBDBD",
}

export const fonts = {
  h1: 25, 
  h2: 18,
  body:14,
  caption:12,
  button:14,
} 

export const spacing = {
  small: 4,
  medium: 8,
  large: 12,
};
export const borderRadius = {
  small: 2,
  medium: 4,
  large: 8,
};