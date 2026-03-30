export const theme = {
  colors: {
    cream: '#F5EFE8',
    background: '#F5EFE8',
    backgroundAlt: '#F8F3ED',
    cardBg: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceTint: 'rgba(255,255,255,0.92)',
    primary: '#7B1B1B',
    primaryLight: '#F5E8E8',
    primarySoft: '#F5E8E8',
    primaryMuted: '#A66B6B',
    primaryDust: '#C4A0A0',
    amber: '#C97B2E',
    vegGreen: '#2E7D32',
    textHeading: '#2B211C',
    textBody: '#5F5148',
    textMuted: '#9A8F87',
    border: '#E8DDD4',
    borderStrong: '#C4A882',
    blobMaroon: 'rgba(123,27,27,0.10)',
    blobPeach: 'rgba(201,123,46,0.11)',
    shadowWarm: '#C4A882',
    white: '#FFFFFF',
    success: '#2E7D32',
    danger: '#B3261E',
    badgePending: '#7B7B7B',
    badgeConfirmed: '#2E7D32',
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    screen: 20,
    dockClearance: 100,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 14,
    xl: 16,
    xxl: 20,
    pill: 36,
    full: 999,
  },
  type: {
    display: {
      size: 40,
      lineHeight: 46,
    },
    heading: {
      size: 18,
      lineHeight: 24,
    },
    body: {
      size: 14,
      lineHeight: 22,
    },
    support: {
      size: 13,
      lineHeight: 21,
    },
    label: {
      size: 11,
      lineHeight: 14,
    },
    micro: {
      size: 10,
      lineHeight: 12,
    },
  },
  shadow: {
    card: {
      shadowColor: '#C4A882',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 4,
    },
    dock: {
      shadowColor: '#8B4A2A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 16,
    },
    soft: {
      shadowColor: '#C4A882',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 3,
    },
  },
} as const;

export const colors = theme.colors;
export const spacing = theme.spacing;
export const radius = theme.radius;
export const typeScale = theme.type;
export const shadows = theme.shadow;
