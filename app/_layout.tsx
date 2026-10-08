import React from "react";
import { Stack } from "expo-router";
import { AxisThemeProvider } from "../contexts/ThemeContext";

export default function RootLayout() {
  return (
    <AxisThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AxisThemeProvider>
  );
}
