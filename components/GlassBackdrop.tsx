import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAxisTheme } from "../contexts/ThemeContext";

/** Neutral, unobtrusive background: no colored orbs. */
export default function GlassBackdrop() {
  const { mode } = useAxisTheme();
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={mode === "dark" ? ["#070707", "#161616", "#0A0A0A"] : ["#FFFFFF", "#F2F2F2", "#EAEAEA"]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
