import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { AxisThemeProvider } from "../contexts/ThemeContext";

export default function RootLayout() {
  return (
    <AxisThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </AxisThemeProvider>
  );
}