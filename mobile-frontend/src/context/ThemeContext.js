import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Shared "Quantum Terminal" tokens - mirrors web-frontend/src/theme/tokens.js
 * so the two clients read as one product (cyan primary, violet secondary, deep
 * navy surfaces, monospaced numerics).
 */
const brand = {
  cyan: "#22D3EE",
  violet: "#8B5CF6",
  mint: "#34D399",
  rose: "#FB7185",
  amber: "#FBBF24",
  fontSans: undefined, // system sans on device
  fontMono: "monospace",
};

const darkTheme = {
  ...brand,
  primary: brand.cyan,
  secondary: brand.violet,
  background: "#060A14",
  backgroundElevated: "#0A1020",
  card: "#0F1626",
  surface: "#15203A",
  text: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#5B6B85",
  border: "rgba(148,163,184,0.16)",
  notification: brand.rose,
  error: brand.rose,
  success: brand.mint,
  warning: brand.amber,
  info: brand.cyan,
  shadow: "#000000",
  gradient: [brand.cyan, brand.violet],
  chartBackground: "#0F1626",
  chartBackgroundGradientFrom: "#0F1626",
  chartBackgroundGradientTo: "#0F1626",
  isDark: true,
};

const lightTheme = {
  ...brand,
  primary: "#0891B2",
  secondary: brand.violet,
  background: "#F4F7FB",
  backgroundElevated: "#FFFFFF",
  card: "#FFFFFF",
  surface: "#F0F4FA",
  text: "#0B1020",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  border: "rgba(15,23,42,0.10)",
  notification: brand.rose,
  error: "#E11D48",
  success: "#059669",
  warning: "#D97706",
  info: "#0891B2",
  shadow: "#0B1020",
  gradient: ["#0891B2", brand.violet],
  chartBackground: "#FFFFFF",
  chartBackgroundGradientFrom: "#FFFFFF",
  chartBackgroundGradientTo: "#F4F7FB",
  isDark: false,
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // The brand is a dark trading terminal, so default to dark.
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("theme_preference")
      .then((pref) => {
        if (pref === "light") setIsDarkMode(false);
        else if (pref === "dark") setIsDarkMode(true);
      })
      .catch(() => {});
  }, []);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem("theme_preference", next ? "dark" : "light").catch(
        () => {},
      );
      return next;
    });
  }, []);

  const setTheme = useCallback((preference) => {
    setIsDarkMode(preference !== "light");
    AsyncStorage.setItem("theme_preference", preference).catch(() => {});
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
