import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAxisTheme } from "../contexts/ThemeContext";

export default function GlassBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { mode, palette } = useAxisTheme();
  const isExpenses = pathname === "/logic/trips/expenses" || pathname.startsWith("/logic/expenses");
  const tabs = [
    { key: "trips", icon: "luggage", href: "/logic/trips", active: pathname.startsWith("/logic/trips") && !isExpenses },
    { key: "home", icon: "home", href: "/logic/home", active: pathname === "/logic/home" },
    { key: "expenses", icon: "attach-money", href: "/logic/trips/expenses", active: isExpenses },
    { key: "profile", icon: "person", href: "/logic/profile", active: pathname.startsWith("/logic/profile") },
  ] as const;
  return (
    <View style={[styles.wrapper, { bottom: Math.max(12, insets.bottom + 2) }]}>
      <BlurView
        tint={mode === "dark" ? "dark" : "light"}
        intensity={mode === "dark" ? 48 : 58}
        style={[styles.navigation, {
          backgroundColor: palette.nav,
          borderColor: palette.border,
          shadowColor: palette.shadow,
        }]}
      >
        {tabs.map((tab) => (
          <Pressable key={tab.key} style={styles.navItem} onPress={() => router.push(tab.href)}>
            <View style={[styles.iconContainer, tab.active && {
              backgroundColor: palette.navSelected,
              borderWidth: 1,
              borderColor: palette.border,
            }]}>
              <MaterialIcons name={tab.icon} size={tab.key === "trips" ? 25 : 27}
                color={tab.active ? palette.text : palette.navIcon} />
            </View>
          </Pressable>
        ))}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "absolute", left: 20, right: 20, height: 66, zIndex: 100 },
  navigation: {
    height: 66, borderRadius: 34, overflow: "hidden", flexDirection: "row",
    alignItems: "center", justifyContent: "space-around",
    borderWidth: 1, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 5,
  },
  navItem: { width: 60, height: 60, alignItems: "center", justifyContent: "center" },
  iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
});
