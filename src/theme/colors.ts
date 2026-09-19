export const colors = {
  forestGreen: '#1E3A1A',
  heritageGold: '#C9A84C',
  cream: '#F5EFE0',

  background: '#F5EFE0',
  surface: '#FFFFFF',
  primary: '#1E3A1A',
  accent: '#C9A84C',

  text: '#1E2A1A',
  textMuted: '#5C6B58',
  textOnPrimary: '#F5EFE0',
  textOnAccent: '#1E3A1A',

  border: '#E1D6BC',
  success: '#2E7D32',
  warning: '#B4690E',
  danger: '#B3261E',
} as const;

export type AppColors = typeof colors;
