export const themes = {
  esoteriment: {
    accent: "#7C8A9E",
    accentLight: "#9BA8BA",
    accentDark: "#5D6B7C",
    background: "#FAFAF9",
    backgroundAlt: "#F5F4F2",
    text: "#1F2937",
    muted: "#6B7280",
  },
  lifeward: {
    accent: "#9A7B4F",
    accentLight: "#B89A6E",
    accentDark: "#7A5F3A",
    background: "#FFFDF8",
    backgroundAlt: "#FDF9F3",
    text: "#1F2937",
    muted: "#6B7280",
  },
  base: {
    white: "#FFFFFF",
    black: "#000000",
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
  },
};

export type ThemeName = keyof typeof themes;
export type SectionTheme = "esoteriment" | "lifeward";

