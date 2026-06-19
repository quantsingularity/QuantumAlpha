import { createTheme } from "@mui/material/styles";
import { fonts, gradients, palette, radii } from "./tokens";

/**
 * Build the MUI theme from the shared "Quantum Terminal" tokens.
 *
 * The signature in MUI is that every number renders in a monospaced face with
 * tabular figures (see the `mono` typography variants and component overrides),
 * giving the whole product a trading-terminal feel.
 */
export const createAppTheme = (darkMode = true, primaryColor) => {
  const primary = primaryColor || palette.cyan;

  return createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: primary,
        light: "#67E8F9",
        dark: palette.cyanDim,
        contrastText: palette.void,
      },
      secondary: {
        main: palette.violet,
        light: "#A78BFA",
        dark: palette.violetDim,
        contrastText: palette.white,
      },
      error: { main: palette.rose },
      warning: { main: palette.amber },
      info: { main: palette.cyan },
      success: { main: palette.mint },
      background: {
        default: palette.void,
        paper: palette.surface,
      },
      text: {
        primary: palette.text,
        secondary: palette.textDim,
        disabled: palette.textMute,
      },
      divider: palette.border,
    },
    typography: {
      fontFamily: fonts.sans,
      h1: {
        fontWeight: 800,
        fontSize: "3.25rem",
        lineHeight: 1.04,
        letterSpacing: "-0.03em",
      },
      h2: {
        fontWeight: 800,
        fontSize: "2.4rem",
        lineHeight: 1.08,
        letterSpacing: "-0.025em",
      },
      h3: {
        fontWeight: 700,
        fontSize: "1.85rem",
        lineHeight: 1.12,
        letterSpacing: "-0.02em",
      },
      h4: {
        fontWeight: 700,
        fontSize: "1.4rem",
        lineHeight: 1.2,
        letterSpacing: "-0.015em",
      },
      h5: {
        fontWeight: 700,
        fontSize: "1.15rem",
        lineHeight: 1.25,
        letterSpacing: "-0.01em",
      },
      h6: { fontWeight: 600, fontSize: "1rem", lineHeight: 1.3 },
      subtitle1: { fontWeight: 500, fontSize: "1rem", lineHeight: 1.6 },
      subtitle2: {
        fontWeight: 600,
        fontSize: "0.85rem",
        letterSpacing: "0.01em",
      },
      body1: { fontWeight: 400, fontSize: "0.975rem", lineHeight: 1.6 },
      body2: {
        fontWeight: 400,
        fontSize: "0.875rem",
        lineHeight: 1.55,
        color: palette.textDim,
      },
      button: {
        fontWeight: 600,
        fontSize: "0.9rem",
        letterSpacing: "0.01em",
        textTransform: "none",
      },
      caption: {
        fontWeight: 500,
        fontSize: "0.75rem",
        letterSpacing: "0.02em",
        color: palette.textDim,
      },
      overline: {
        fontWeight: 700,
        fontSize: "0.7rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: palette.textDim,
      },
      // Custom monospaced variant for numerics
      mono: {
        fontFamily: fonts.mono,
        fontFeatureSettings: '"tnum" 1',
        fontWeight: 600,
      },
    },
    shape: { borderRadius: radii.md },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": { colorScheme: "dark" },
          body: {
            background: gradients.app,
            backgroundAttachment: "fixed",
            minHeight: "100vh",
            fontFeatureSettings: '"cv11", "ss01"',
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: 10,
              height: 10,
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 999,
              backgroundColor: "rgba(148,163,184,0.25)",
              border: "2px solid transparent",
              backgroundClip: "content-box",
            },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
              {
                backgroundColor: "rgba(148,163,184,0.45)",
              },
          },
          "::selection": { background: `${palette.cyan}55` },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radii.sm,
            textTransform: "none",
            fontWeight: 600,
            paddingInline: 18,
            paddingBlock: 9,
            transition:
              "transform .18s ease, box-shadow .18s ease, background .18s ease",
          },
          containedPrimary: {
            background: gradients.brand,
            color: palette.void,
            "&:hover": {
              background: gradients.brand,
              transform: "translateY(-1px)",
              boxShadow: `0 10px 28px -10px ${palette.cyan}aa`,
            },
          },
          outlinedPrimary: {
            borderColor: palette.borderStrong,
            color: palette.text,
            "&:hover": {
              borderColor: palette.cyan,
              background: `${palette.cyan}12`,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: palette.surface,
            border: `1px solid ${palette.border}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: palette.surface,
            border: `1px solid ${palette.border}`,
            borderRadius: radii.lg,
            backgroundImage: "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(10,16,32,0.72)",
            backdropFilter: "blur(14px)",
            borderBottom: `1px solid ${palette.border}`,
            boxShadow: "none",
            backgroundImage: "none",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "rgba(10,16,32,0.85)",
            backdropFilter: "blur(14px)",
            borderRight: `1px solid ${palette.border}`,
            backgroundImage: "none",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radii.sm,
            backgroundColor: "rgba(255,255,255,0.02)",
            "& fieldset": { borderColor: palette.border },
            "&:hover fieldset": { borderColor: palette.borderStrong },
            "&.Mui-focused fieldset": {
              borderColor: palette.cyan,
              borderWidth: 1.5,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: radii.sm },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottom: `1px solid ${palette.border}` },
          head: { fontWeight: 700, color: palette.textDim },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: palette.surfaceRaised,
            border: `1px solid ${palette.border}`,
            fontSize: "0.78rem",
          },
        },
      },
    },
  });
};

export default createAppTheme;
