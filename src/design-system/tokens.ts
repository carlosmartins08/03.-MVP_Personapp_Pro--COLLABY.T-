export const colors = {
  primary: {
    50: '#EAF1FB',
    100: '#C0D8F5',
    200: '#8AB4E8',
    300: '#4E89D4',
    400: '#3055A4',
    500: '#244085',
    600: '#192D65',
    700: '#0F1D45',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F5F7FA',
    100: '#EAEDF2',
    200: '#BFBFBF',
    300: '#737373',
    400: '#333333',
    500: '#1A1A1A',
  },
  surface: {
    page: '#F5F7FA',
    card: '#FFFFFF',
    dark: '#1A1A2E',
    header: '#3055A4',
  },
  semantic: {
    success: '#5CB85C',
    successBg: '#EBF8F0',
    warning: '#F0A500',
    warningBg: '#FFF8E6',
    error: '#D9534F',
    errorBg: '#FEEEED',
    sos: '#C0392B',
    sosBg: '#FFF0F0',
  },
  approach: {
    psicanalise: { bg: '#EAF1FB', text: '#0F1D45', accent: '#3055A4' },
    behaviorismo: { bg: '#FFF8E6', text: '#875F00', accent: '#F0A500' },
    humanismo: { bg: '#EBF8F0', text: '#166534', accent: '#5CB85C' },
    cognitivismo: { bg: '#F0F4FF', text: '#1E3A8A', accent: '#3B82F6' },
    psicPositiva: { bg: '#FEF9C3', text: '#713F12', accent: '#EAB308' },
    neuropsicologia: { bg: '#FDF2F8', text: '#701A75', accent: '#A855F7' },
    sistemica: { bg: '#FFF7ED', text: '#7C2D12', accent: '#F97316' },
    transpessoal: { bg: '#F0FDFA', text: '#134E4A', accent: '#14B8A6' },
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xl2: 24,
  xl3: 32,
  xl4: 40,
  xl5: 48,
  xl6: 64,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xl2: 24,
  full: 9999,
} as const;

export const typography = {
  display: { size: 32, weight: 700 },
  h1: { size: 24, weight: 700 },
  h2: { size: 20, weight: 600 },
  h3: { size: 18, weight: 500 },
  body: { size: 16, weight: 400 },
  bodySm: { size: 14, weight: 400 },
  caption: { size: 12, weight: 400 },
  label: { size: 12, weight: 500 },
} as const;

export type ApproachKey = keyof typeof colors.approach;
