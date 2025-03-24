/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, useColorScheme, View as DefaultView, Platform } from 'react-native';

import Colors from '../constants/Colors';

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

export function SurfaceView(props: ViewProps) {
  const { style, ...otherProps } = props;
  
  return (
    <View
      style={[
        {
          padding: 10,
          width: "100%",
          backgroundColor: "white",
          borderRadius: 8, 
          // iOS Shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 }, // Moves shadow down
          shadowOpacity: 0.12, // Makes shadow more visible
          shadowRadius: 3, // Increases spread
          
          // Android Shadow
          elevation: 2, // Stronger shadow on Android
        },
        style
      ]}
      {...otherProps}
    />
  );
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
  tertiary:"#202124",
  background:"#F2F4F5",
  surface:"#ffffff",
  textPrimary:"#555555", // "#202124",
  textSecondary: "#878484",
  error: "#D32F2F",
  errorBg: "#FFE6E8",
  success: "#16B616",
  successBg:"#F6FFEF",
  warning: "#ffc800",
  warningBg:"#fff9e0",
  info: "#1976D2",
  border: "#E0E0E0",
  disabled: "#BDBDBD",
}

export const fonts = {
  h1: 25, 
  h2: 22, 
  h3: 18,
  body:14,
  caption:12,
  button:14,
  sm:10
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