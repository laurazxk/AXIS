import React, { createContext, useContext, useMemo, useState } from "react";
import { glassPalette, type AxisMode } from "../constants/glass";

type ThemeContextValue = {
  mode: AxisMode;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  palette: (typeof glassPalette)[AxisMode];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AxisThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<AxisMode>("light");
  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    darkMode: mode === "dark",
    setDarkMode: (enabled: boolean) => setMode(enabled ? "dark" : "light"),
    palette: glassPalette[mode],
  }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAxisTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useAxisTheme must be inside AxisThemeProvider");
  return value;
}
