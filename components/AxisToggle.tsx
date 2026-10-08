import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useAxisTheme } from "../contexts/ThemeContext";

type Props = { value: boolean; onValueChange: (value: boolean) => void; label: string };

/** Fixed-size toggle: the thumb is centered vertically and stays inside the track. */
export default function AxisToggle({ value, onValueChange, label }: Props) {
  const { darkMode } = useAxisTheme();
  const track = value ? (darkMode ? "#E8E8E8" : "#202020") : (darkMode ? "#414141" : "#D6D6D6");
  const thumb = value ? (darkMode ? "#151515" : "#FFFFFF") : (darkMode ? "#F7F7F7" : "#FFFFFF");
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={[styles.track, { backgroundColor: track }]}
    >
      <View style={[styles.thumb, { backgroundColor: thumb, left: value ? 29 : 3 }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 60, height: 34, borderRadius: 17, justifyContent: "center", flexShrink: 0 },
  thumb: { position: "absolute", top: 3, width: 28, height: 28, borderRadius: 14 },
});
