import React, { useState } from "react";

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";

import { useAxisTheme } from "../contexts/ThemeContext";

import {
  formatTripDate,
  type TripInvitation,
} from "../utils/tripInvitation";

type Props = {
  visible: boolean;
  invitation: TripInvitation | null;
  onClose: () => void;
};

export default function TripInvitationModal({
  visible,
  invitation,
  onClose,
}: Props) {
  const { palette, darkMode } = useAxisTheme();

  const [copying, setCopying] = useState(false);

  if (!invitation) return null;

  const copyCode = async () => {
    setCopying(true);

    try {
      await Clipboard.setStringAsync(invitation.code);
    } finally {
      setCopying(false);
    }
  };

  const shareInvitation = async () => {
    await Share.share({
      message:
        `Você foi convidado para uma viagem no AXIS!\n\n` +
        `Destino: ${invitation.destination}\n` +
        `Ida: ${formatTripDate(invitation.startDate)}\n` +
        `Volta: ${formatTripDate(invitation.endDate)}\n\n` +
        `Código: ${invitation.code}\n\n` +
        `Abra o AXIS e selecione "Entrar com código".`,
    });
  };

  const cardColor = darkMode ? "#222222" : "#FFFFFF";
  const secondaryColor = darkMode ? "#BDBDBD" : "#777777";
  const foreground = darkMode ? "#FFFFFF" : "#171717";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.center}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.ticket,
              {
                backgroundColor: cardColor,
                borderColor: palette.border,
              },
            ]}
          >
            <View style={styles.topRow}>
              <View style={styles.brandRow}>
                <MaterialIcons
                  name="flight-takeoff"
                  size={23}
                  color={foreground}
                />

                <Text
                  style={[
                    styles.brand,
                    { color: foreground },
                  ]}
                >
                  AXIS
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Fechar convite"
                hitSlop={12}
              >
                <MaterialIcons
                  name="close"
                  size={25}
                  color={foreground}
                />
              </Pressable>
            </View>

            <Text
              style={[
                styles.eyebrow,
                { color: secondaryColor },
              ]}
            >
              CONVITE DE VIAGEM
            </Text>

            <Text
              style={[
                styles.heading,
                { color: foreground },
              ]}
            >
              Sua próxima aventura
              começa aqui.
            </Text>

            <View style={styles.destinationSection}>
              <Text
                style={[
                  styles.fieldLabel,
                  { color: secondaryColor },
                ]}
              >
                DESTINO
              </Text>

              <Text
                style={[
                  styles.destination,
                  { color: foreground },
                ]}
              >
                {invitation.destination}
              </Text>
            </View>

            <View style={styles.datesRow}>
              <View style={styles.dateColumn}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: secondaryColor },
                  ]}
                >
                  IDA
                </Text>

                <Text
                  style={[
                    styles.dateValue,
                    { color: foreground },
                  ]}
                >
                  {formatTripDate(invitation.startDate)}
                </Text>
              </View>

              <MaterialIcons
                name="arrow-forward"
                size={20}
                color={secondaryColor}
              />

              <View style={styles.dateColumn}>
                <Text
                  style={[
                    styles.fieldLabel,
                    { color: secondaryColor },
                  ]}
                >
                  VOLTA
                </Text>

                <Text
                  style={[
                    styles.dateValue,
                    { color: foreground },
                  ]}
                >
                  {formatTripDate(invitation.endDate)}
                </Text>
              </View>
            </View>

            <View style={styles.perforationRow}>
              <View
                style={[
                  styles.cutoutLeft,
                  { backgroundColor: "#000000" },
                ]}
              />

              <View
                style={[
                  styles.dashedLine,
                  {
                    borderColor: darkMode
                      ? "#626262"
                      : "#CCCCCC",
                  },
                ]}
              />

              <View
                style={[
                  styles.cutoutRight,
                  { backgroundColor: "#000000" },
                ]}
              />
            </View>

            <Text
              style={[
                styles.fieldLabel,
                {
                  color: secondaryColor,
                  textAlign: "center",
                },
              ]}
            >
              CÓDIGO DE CONVITE
            </Text>

            <Text
              selectable
              style={[
                styles.code,
                { color: foreground },
              ]}
            >
              {invitation.code}
            </Text>

            <View style={styles.qrContainer}>
              <View style={styles.qrBackground}>
                <QRCode
                  value={invitation.code}
                  size={174}
                  backgroundColor="#FFFFFF"
                  color="#111111"
                />
              </View>
            </View>

            <Text
              style={[
                styles.helper,
                { color: secondaryColor },
              ]}
            >
              Compartilhe este código ou QR Code
              com quem vai viajar com você.
            </Text>

            <Pressable
              onPress={copyCode}
              disabled={copying}
              style={[
                styles.primaryButton,
                {
                  backgroundColor: palette.accent,
                },
              ]}
            >
              {copying ? (
                <ActivityIndicator
                  color={palette.accentText}
                />
              ) : (
                <>
                  <MaterialIcons
                    name="content-copy"
                    size={19}
                    color={palette.accentText}
                  />

                  <Text
                    style={[
                      styles.primaryText,
                      { color: palette.accentText },
                    ]}
                  >
                    Copiar código
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={shareInvitation}
              style={[
                styles.secondaryButton,
                {
                  borderColor: palette.border,
                },
              ]}
            >
              <MaterialIcons
                name="share"
                size={19}
                color={foreground}
              />

              <Text
                style={[
                  styles.secondaryText,
                  { color: foreground },
                ]}
              >
                Compartilhar convite
              </Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text
                style={{
                  color: secondaryColor,
                  fontWeight: "600",
                }}
              >
                Agora não
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
  },

  center: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 42,
  },

  ticket: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    borderRadius: 27,
    borderWidth: 1,
    overflow: "hidden",
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  brand: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 3,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 10,
  },

  heading: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "800",
    marginBottom: 28,
  },

  destinationSection: {
    marginBottom: 22,
  },

  fieldLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginBottom: 8,
  },

  destination: {
    fontSize: 23,
    fontWeight: "800",
  },

  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 27,
    gap: 12,
  },

  dateColumn: {
    flex: 1,
  },

  dateValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  perforationRow: {
    height: 25,
    justifyContent: "center",
    marginHorizontal: -24,
    marginBottom: 26,
  },

  dashedLine: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    marginHorizontal: 16,
  },

  cutoutLeft: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    left: -10,
    top: 2,
  },

  cutoutRight: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    right: -10,
    top: 2,
  },

  code: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 22,
  },

  qrContainer: {
    alignItems: "center",
    marginBottom: 18,
  },

  qrBackground: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
  },

  helper: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 23,
  },

  primaryButton: {
    minHeight: 52,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  primaryText: {
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryButton: {
    minHeight: 52,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },

  secondaryText: {
    fontSize: 14,
    fontWeight: "700",
  },

  closeButton: {
    alignItems: "center",
    padding: 14,
    marginTop: 4,
  },
});