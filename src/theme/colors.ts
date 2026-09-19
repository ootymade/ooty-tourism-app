export const colors = {
  forestGreen: '#1E3A1A',
  heritageGold: '#C9A84C',
  cream: '#F5EFE0',

  background: '#F5EFE0',
  surface: '#FFFFFF',
  primary: '#1E3A1A',
  accent: '#C9A84C',
  // Heritage Gold itself fails WCAG AA as text on cream/white (~2:1) — fine
  // as a background, border or icon tint (paired with textOnAccent, which
  // does pass), but never as a text color. Use this darker variant instead
  // wherever gold-toned text is needed; it reads as the same "gold" at a
  // glance while passing 4.5:1 on both background and surface.
  accentText: '#7D682F',

  text: '#1E2A1A',
  textMuted: '#5C6B58',
  textOnPrimary: '#F5EFE0',
  textOnAccent: '#1E3A1A',

  border: '#E1D6BC',
  success: '#2D7B31',
  warning: '#9E5C0C',
  danger: '#B3261E',
} as const;

export type AppColors = typeof colors;
