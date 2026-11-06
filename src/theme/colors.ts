/**
 * Kairo Chat Original Theme Colors
 * Dark-first, stealth charcoal surfaces with vibrant luminary accents
 */
export const Colors = {
  // Backgrounds
  background: '#08090C',
  surface: '#12141A',
  surfaceElevated: '#1A1D26',
  surfaceCard: '#1E222D',
  surfaceHover: '#262B39',

  // Borders & Dividers
  border: '#252936',
  borderFocus: '#00F0FF',
  divider: '#191D26',

  // Original Kairo Brand Accents (Electric Cyan / Luminary)
  primary: '#00F0FF',
  primaryDark: '#00B8C4',
  primaryGlow: 'rgba(0, 240, 255, 0.15)',
  
  // Secondary Accent (Neon Amethyst / Ephemeral Vibe)
  secondary: '#7928CA',
  secondaryGlow: 'rgba(121, 40, 202, 0.18)',

  // Streak Identity (Solar Amber / Ember Flare)
  streak: '#FF9900',
  streakGlow: 'rgba(255, 153, 0, 0.2)',

  // Status & Semantic Colors
  success: '#00E676',
  warning: '#FFB300',
  error: '#FF3366',
  info: '#29B6F6',

  // Text Hierarchy
  text: '#FFFFFF',
  textSecondary: '#9EABC0',
  textMuted: '#5F687A',
  textInverse: '#08090C',

  // Camera & Media Overlays
  overlayDark: 'rgba(8, 9, 12, 0.75)',
  overlayGlass: 'rgba(26, 29, 38, 0.85)',
  shutterInner: '#FFFFFF',
  shutterRing: 'rgba(255, 255, 255, 0.4)',
} as const;

export type ThemeColors = typeof Colors;
