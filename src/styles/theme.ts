export const theme = {
  fonts: {
    primary: "'Inter', sans-serif",
  },
  colors: {
    primary: "#007bff",
    background: "#09090b",
    text: "#fafafa",
  },
} as const;

export type AppTheme = typeof theme;
