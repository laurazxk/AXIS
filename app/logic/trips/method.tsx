import React, { useMemo } from "react";
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

import GlassBackdrop from "../../../components/GlassBackdrop";
import GlassFrost from "../../../components/GlassFrost";
import {
  glassDecoration,
  type GlassPalette,
} from "../../../constants/glass";
import { useAxisTheme } from "../../../contexts/ThemeContext";
import { tripDraft } from "../../../stores/tripDraft";

export default function MethodScreen() {
  const { palette, darkMode } = useAxisTheme();

  const styles = useMemo(
    () => createStyles(palette, darkMode),
    [palette, darkMode]
  );

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const destination = tripDraft.destination || "Destino";
  const country = tripDraft.country || "";

  const locationLabel =
    country &&
    destination.trim().toLowerCase() ===
      country.trim().toLowerCase()
      ? destination
      : [destination, country].filter(Boolean).join(", ");

  const durationLabel =
    tripDraft.dateMode === "dates"
      ? `${tripDraft.startDate || "Data a definir"} a ${
          tripDraft.endDate || "Data a definir"
        }`
      : `${tripDraft.duration || 1} dias`;

  const interestsLabel =
    tripDraft.interests?.length > 0
      ? tripDraft.interests.join(", ")
      : "Nenhum interesse selecionado";

  const budgetLabel =
    tripDraft.budget != null
      ? `${tripDraft.budgetCurrency || "BRL"} ${tripDraft.budget}`
      : "Não informado";

  return (
    <View style={styles.container}>
      <GlassBackdrop />

      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8 },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <MaterialIcons
              name="arrow-back"
              size={25}
              color={palette.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Seu roteiro
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <Text style={styles.step}>
          ÚLTIMA ETAPA
        </Text>

        <Text style={styles.title}>
          Como você quer{"\n"}planejar sua viagem?
        </Text>

        <Text style={styles.subtitle}>
          Escolha como prefere organizar os dias e
          aproveitar seu destino.
        </Text>

        <View style={styles.summaryCard}>
          <GlassFrost />

          <View style={styles.summaryIcon}>
            <MaterialIcons
              name="luggage"
              size={27}
              color={darkMode ? "#FFFFFF" : "#171717"}
            />
          </View>

          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>
              {locationLabel}
            </Text>

            <Text style={styles.summaryDescription}>
              {durationLabel}
            </Text>

            <Text style={styles.summaryDescription}>
              {interestsLabel}
            </Text>

            <Text style={styles.summaryBudget}>
              Orçamento: {budgetLabel}
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.optionCard,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            router.push("/logic/trips/itinerary")
          }
          accessibilityRole="button"
        >
          <View style={styles.optionIcon}>
            <MaterialIcons
              name="edit-calendar"
              size={28}
              color={palette.text}
            />
          </View>

          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>
              Criar roteiro manualmente
            </Text>

            <Text style={styles.optionDescription}>
              Organize seus dias e adicione as atividades
              que deseja fazer.
            </Text>
          </View>

          <MaterialIcons
            name="arrow-forward"
            size={23}
            color={palette.text}
          />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const createStyles = (
  palette: GlassPalette,
  darkMode: boolean
) => {
  const cardBackground = darkMode
    ? "rgba(40,40,40,0.80)"
    : "rgba(255,255,255,0.82)";

  const iconBackground = darkMode
    ? "rgba(255,255,255,0.14)"
    : "rgba(0,0,0,0.07)";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },

    content: {
      paddingHorizontal: 28,
      paddingBottom: 50,
    },

    header: {
      height: 58,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: iconBackground,
    },

    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: palette.text,
    },

    headerSpace: {
      width: 44,
      height: 44,
    },

    step: {
      marginTop: 28,
      fontSize: 11,
      fontWeight: "700",
      color: palette.muted,
      letterSpacing: 1,
    },

    title: {
      marginTop: 10,
      fontSize: 29,
      lineHeight: 35,
      fontWeight: "800",
      color: palette.text,
    },

    subtitle: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 21,
      color: palette.muted,
    },

    summaryCard: {
      ...glassDecoration("summaryCard", palette),
      marginTop: 27,
      padding: 17,
      borderRadius: 20,
      backgroundColor: cardBackground,
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
      elevation: 2,
      overflow: "hidden",
    },

    summaryIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: iconBackground,
      alignItems: "center",
      justifyContent: "center",
    },

    summaryText: {
      flex: 1,
    },

    summaryTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: palette.text,
    },

    summaryDescription: {
      fontSize: 11,
      lineHeight: 17,
      color: palette.muted,
      marginTop: 4,
    },

    summaryBudget: {
      fontSize: 12,
      fontWeight: "600",
      color: palette.text,
      marginTop: 7,
    },

    optionCard: {
      ...glassDecoration("optionCard", palette),
      marginTop: 18,
      padding: 18,
      borderRadius: 20,
      backgroundColor: cardBackground,
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
      elevation: 2,
      overflow: "hidden",
    },

    optionIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: iconBackground,
      alignItems: "center",
      justifyContent: "center",
    },

    optionText: {
      flex: 1,
    },

    optionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: palette.text,
    },

    optionDescription: {
      marginTop: 6,
      fontSize: 11,
      lineHeight: 17,
      color: palette.muted,
    },

    pressed: {
      transform: [{ scale: 0.98 }],
    },
  });
};