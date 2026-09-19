import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, fontFamilies, fontSizes, lineHeights } from '../theme';

type Variant = 'display' | 'heading' | 'subheading' | 'body' | 'bodyMedium' | 'caption';

interface ThemedTextProps extends TextProps {
  variant?: Variant;
  color?: string;
}

export function ThemedText({ variant = 'body', color, style, ...rest }: ThemedTextProps) {
  return <Text style={[styles[variant], color ? { color } : null, style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.display,
    lineHeight: lineHeights.display,
    color: colors.text,
  },
  heading: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.xxl,
    lineHeight: lineHeights.xxl,
    color: colors.text,
  },
  subheading: {
    fontFamily: fontFamilies.headingMedium,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    color: colors.text,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    color: colors.text,
  },
  bodyMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.md,
    color: colors.text,
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    color: colors.textMuted,
  },
});
