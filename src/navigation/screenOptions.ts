import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { colors, fontFamilies, fontSizes } from '../theme';

export const stackScreenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.textOnPrimary,
  headerTitleStyle: {
    fontFamily: fontFamilies.headingMedium,
    fontSize: fontSizes.lg,
  },
};
