export const brand = {
  primary: "#3055A4",
  primary50: "#EAF1FB",
  primary100: "#C0D8F5",
  primary200: "#8AB4E8",
  primary300: "#4E89D4",
  primary400: "#3055A4",
  primary500: "#244085",
  primary600: "#192D65",
  primary700: "#0F1D45",
} as const;

export const surface = {
  page: "#F5F7FA",
  card: "#FFFFFF",
  dark: "#1A1A2E",
  header: "#3055A4",
  overlay: "rgba(0,0,0,0.4)",
} as const;

export const accent = {
  mint: "#E8F8F2",
  sky: "#EAF4FF",
  peach: "#FFF0EC",
  lemon: "#FFFBE6",
  lavender: "#F3EEFF",
} as const;

export const status = {
  success: "#5CB85C",
  successBg: "#EBF8F0",
  warning: "#F0A500",
  warningBg: "#FFF8E6",
  error: "#D9534F",
  errorBg: "#FEEEED",
  info: "#3055A4",
  infoBg: "#EAF1FB",
  sos: "#C0392B",
  sosBg: "#FFF0F0",
} as const;

export const text = {
  primary: "#333333",
  secondary: "#737373",
  disabled: "#BFBFBF",
  inverse: "#FFFFFF",
  link: "#3055A4",
} as const;

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
  // aliases v2
  xl2: "24px",
} as const;

export const shadow = {
  sm: "0 1px 3px rgba(0,0,0,0.08)",
  md: "0 4px 12px rgba(0,0,0,0.10)",
  lg: "0 8px 24px rgba(0,0,0,0.12)",
  card: "0 2px 8px rgba(48,85,164,0.08)",
} as const;

export const motion = {
  fast: "120ms",
  normal: "200ms",
  slow: "320ms",
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
  // aliases v2
  xl2: 24,
  xl3: 32,
  xl4: 40,
  xl5: 48,
  xl6: 64,
} as const;

export const typography = {
  display: { size: "32px", weight: "700", font: "sora" },
  h1: { size: "24px", weight: "700", font: "sora" },
  h2: { size: "20px", weight: "600", font: "sora" },
  h3: { size: "18px", weight: "500", font: "sora" },
  body: { size: "16px", weight: "400", font: "manrope" },
  bodySm: { size: "14px", weight: "400", font: "manrope" },
  caption: { size: "12px", weight: "400", font: "manrope" },
  label: { size: "12px", weight: "500", font: "manrope" },
} as const;

export const approach = {
  psicanalise: { bg: "#EAF1FB", text: "#0F1D45", accent: "#3055A4" },
  behaviorismo: { bg: "#FFF8E6", text: "#875F00", accent: "#F0A500" },
  humanismo: { bg: "#EBF8F0", text: "#166534", accent: "#5CB85C" },
  cognitivismo: { bg: "#F0F4FF", text: "#1E3A8A", accent: "#3B82F6" },
  psicPositiva: { bg: "#FEF9C3", text: "#713F12", accent: "#EAB308" },
  neuropsicologia: { bg: "#FDF2F8", text: "#701A75", accent: "#A855F7" },
  sistemica: { bg: "#FFF7ED", text: "#7C2D12", accent: "#F97316" },
  transpessoal: { bg: "#F0FDFA", text: "#134E4A", accent: "#14B8A6" },
} as const;

export const moodBackground = {
  1: "#2D1A1A",
  2: "#2D2610",
  3: "#222230",
  4: "#1A2D1E",
  5: "#1A1D2D",
} as const;

// Aliases v2 para compatibilidade
export const colors = {
  primary: {
    50: brand.primary50,
    100: brand.primary100,
    200: brand.primary200,
    300: brand.primary300,
    400: brand.primary400,
    500: brand.primary500,
    600: brand.primary600,
    700: brand.primary700,
  },
  neutral: {
    0: "#FFFFFF",
    50: "#F5F7FA",
    100: "#EAEDF2",
    200: "#BFBFBF",
    300: "#737373",
    400: "#333333",
    500: "#1A1A1A",
  },
  surface,
  semantic: status,
  approach,
  moodBackground,
} as const;

export type ApproachKey = keyof typeof approach;
export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type ConsultStatus = "pending" | "confirmed" | "active" | "ended";
export type UserRole = "patient" | "professional" | "admin";
export type VinculoStatus = "ATIVO" | "INATIVO";
