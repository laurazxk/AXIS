import React, { useState } from "react";

import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AxisToggle from "../../components/AxisToggle";
import GlassBackdrop from "../../components/GlassBackdrop";
import GlassBottomNav from "../../components/GlassBottomNav";
import GlassFrost from "../../components/GlassFrost";
import UserAvatar from "../../components/UserAvatar";

import { useAxisAuth } from "../../contexts/AuthContext";
import { useAxisTheme } from "../../contexts/ThemeContext";

import {
  glassColor,
  glassDecoration,
  type GlassPalette,
} from "../../constants/glass";

export default function ProfileScreen() {
  const {
    palette: axisPalette,
    darkMode,
    setDarkMode,
  } = useAxisTheme();

  const { user } = useAxisAuth();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState(true);

  const styles = React.useMemo(
    () => createStyles(axisPalette),
    [axisPalette]
  );

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : "Visitante";

  const email = user?.email ?? "Entre na sua conta";

  return (
    <View style={styles.container}>
      <GlassBackdrop />

      <StatusBar
        barStyle={
          darkMode ? "light-content" : "dark-content"
        }
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 8,
          },
        ]}
      >
        {/* CABEÇALHO */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Meu Perfil
          </Text>
        </View>

        {/* CARD DO PERFIL */}

        <View style={styles.profileCard}>
          <GlassFrost />

          <UserAvatar user={user} size={72} />

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {fullName}
            </Text>

            <Text style={styles.email}>
              {email}
            </Text>
          </View>
        </View>

        {/* CONFIGURAÇÕES */}

        <View style={styles.settings}>
          <Text style={styles.sectionTitle}>
            Configurações
          </Text>

          <View style={styles.settingsCard}>
            <GlassFrost />

            {/* MODO ESCURO */}

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <MaterialIcons
                  name="dark-mode"
                  size={23}
                  color={axisPalette.muted}
                />

                <Text style={styles.settingText}>
                  Modo escuro
                </Text>
              </View>

              <AxisToggle
                label="Modo escuro"
                value={darkMode}
                onValueChange={setDarkMode}
              />
            </View>

           

            {/* SOBRE */}

            <Pressable
              style={styles.settingRow}
              onPress={() => router.push("/logic/about")}
            >
              <View style={styles.settingInfo}>
                <MaterialIcons
                  name="info-outline"
                  size={24}
                  color={axisPalette.muted}
                />

                <Text style={styles.settingText}>
                  Sobre
                </Text>
              </View>

              <MaterialIcons
                name="chevron-right"
                size={25}
                color={axisPalette.muted}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* NAVEGAÇÃO INFERIOR */}

      <GlassBottomNav />
    </View>
  );
}

const createStyles = (palette: GlassPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: glassColor(
        "backgroundColor",
        "#f7f7f7",
        "container",
        palette
      ),
    },

    content: {
      flex: 1,
    },

    scrollContent: {
      paddingBottom: 30,
    },

    header: {
      height: 58,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      position: "absolute",
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 17,
      fontWeight: "700",
      color: glassColor(
        "color",
        "#8492a8",
        "headerTitle",
        palette
      ),
    },

    profileCard: {
      ...glassDecoration("profileCard", palette),

      marginHorizontal: 25,
      marginTop: 25,
      paddingVertical: 22,

      backgroundColor: glassColor(
        "backgroundColor",
        "#ffffff",
        "profileCard",
        palette
      ),

      borderRadius: 18,
      alignItems: "center",

      shadowColor: glassColor(
        "shadowColor",
        "#000000",
        "profileCard",
        palette
      ),

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.07,
      shadowRadius: 6,
      elevation: 3,
    },

    profileInfo: {
      alignItems: "center",
      marginTop: 12,
      paddingHorizontal: 16,
    },

    name: {
      fontSize: 19,
      fontWeight: "700",
      textAlign: "center",

      color: glassColor(
        "color",
        "#303030",
        "name",
        palette
      ),
    },

    email: {
      marginTop: 5,
      fontSize: 13,
      textAlign: "center",

      color: glassColor(
        "color",
        "#8b8b8b",
        "email",
        palette
      ),
    },

    settings: {
      marginTop: 35,
      marginHorizontal: 25,
    },

    sectionTitle: {
      marginBottom: 12,
      fontSize: 19,
      fontWeight: "700",

      color: glassColor(
        "color",
        "#8492a8",
        "sectionTitle",
        palette
      ),
    },

    settingsCard: {
      ...glassDecoration("settingsCard", palette),

      backgroundColor: glassColor(
        "backgroundColor",
        "#ffffff",
        "settingsCard",
        palette
      ),

      borderRadius: 18,
      paddingHorizontal: 17,

      shadowColor: glassColor(
        "shadowColor",
        "#000000",
        "settingsCard",
        palette
      ),

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.07,
      shadowRadius: 6,
      elevation: 3,
    },

    settingRow: {
      minHeight: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      borderBottomWidth: 1,

      borderBottomColor: glassColor(
        "borderBottomColor",
        "#f0f0f0",
        "settingRow",
        palette
      ),
    },

    settingInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    settingText: {
      fontSize: 14,
      fontWeight: "600",

      color: glassColor(
        "color",
        "#333333",
        "settingText",
        palette
      ),
    },

    bottomSpace: {
      height: 120,
    },
  });