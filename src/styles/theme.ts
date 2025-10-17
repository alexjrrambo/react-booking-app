import { alpha, createTheme } from "@mui/material/styles";

const brand = {
  main: "#6366F1",
  light: "#A5B4FC",
  dark: "#4F46E5",
  contrastText: "#FFFFFF",
};

const neutrals = {
  ink: "#0B0F19",
  paperDark: "#11161E",
  appDark: "#0B0E14",
  appLight: "#F7F9FC",
};

const commonTypography = {
  fontFamily: "Inter, system-ui, sans-serif",
  h6: { fontWeight: 600, letterSpacing: 0.2 },
  button: { textTransform: "none" as const, fontWeight: 600, letterSpacing: 0.2 },
};

function makeTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: brand,

      background:
        mode === "light"
          ? { default: neutrals.appLight, paper: "#FFFFFF" }
          : { default: neutrals.appDark, paper: neutrals.paperDark },
      text:
        mode === "light"
          ? { primary: neutrals.ink }
          : { primary: "#E6E9EF" },
    },
    shape: { borderRadius: 12 },
    typography: commonTypography,
    components: {
      MuiCssBaseline: {
        styleOverrides: { body: { backgroundImage: "none" } },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === "light"
                ? "0 6px 24px rgba(16,24,40,.06), 0 2px 8px rgba(16,24,40,.04)"
                : "none",
            border:
              mode === "light"
                ? "1px solid rgba(10,10,10,0.06)"
                : "1px solid rgba(255,255,255,0.06)",
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 12, paddingInline: 16, height: 36 },
          containedPrimary: {
            "color": brand.contrastText,
            "backgroundColor": brand.main,
            "&:hover": { backgroundColor: brand.dark },
            "&:focus-visible": {
              outline: `2px solid ${alpha(brand.main, 0.6)}`,
              outlineOffset: 2,
            },
          },
          outlinedPrimary: {
            "borderColor": alpha(brand.main, 0.45),
            "color": mode === "light" ? neutrals.ink : "#E6E9EF",
            "&:hover": {
              backgroundColor: alpha(brand.main, mode === "light" ? 0.10 : 0.12),
              borderColor: alpha(brand.main, mode === "light" ? 0.60 : 0.65),
            },
          },
          textPrimary: {
            "color": brand.main,
            "&:hover": { backgroundColor: alpha(brand.main, mode === "light" ? 0.08 : 0.10) },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 10, fontWeight: 600 },
          colorPrimary: {
            backgroundColor: alpha(brand.main, mode === "light" ? 0.18 : 0.22),
            color: mode === "light" ? "#1F2358" : "#0A0E2A",
          },
        },
      },

      MuiTextField: { defaultProps: { variant: "standard" } },

      MuiInputBase: {
        styleOverrides: {
          root: {
            "&.Mui-focused .MuiInputBase-input": {
              color: mode === "light" ? neutrals.ink : "#E6E9EF",
            },
          },
        },
      },

      MuiInput: {
        styleOverrides: {
          underline: {
            "&:after": { borderBottomColor: brand.main },
            "&:before": {
              borderBottomColor:
                mode === "light" ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.18)",
            },
            "&:hover:not(.Mui-disabled):before": {
              borderBottomColor:
                mode === "light" ? "rgba(0,0,0,0.36)" : "rgba(255,255,255,0.36)",
            },
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            "borderRadius": 16,
            "&:hover": { backgroundColor: alpha(brand.main, 0.12) },
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor:
              mode === "light" ? "rgba(10,10,10,0.08)" : "rgba(255,255,255,0.08)",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border:
              mode === "light"
                ? "1px solid rgba(10,10,10,0.06)"
                : "1px solid rgba(255,255,255,0.06)",
          },
        },
      },
    },
  });
}

export const lightTheme = makeTheme("light");
export const darkTheme = makeTheme("dark");
