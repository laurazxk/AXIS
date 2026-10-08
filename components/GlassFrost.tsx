import React from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { useAxisTheme } from "../contexts/ThemeContext";

/** A non-interactive backdrop blur. Mount it as the first child of a glass surface. */
export default function GlassFrost() {
  const { mode } = useAxisTheme();
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: "hidden", borderRadius: 18 }]}>
      <BlurView
        intensity={mode === "dark" ? 28 : 38}
        tint={mode === "dark" ? "dark" : "light"}
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
