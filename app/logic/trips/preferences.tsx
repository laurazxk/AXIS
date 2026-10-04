import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    StatusBar,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { tripDraft } from "./tripDraft";

const interests = [
    { name: "Gastronomia", emoji: "🍕" },
    { name: "Praias", emoji: "🏖️" },
    { name: "Cultura", emoji: "🌎" },
    { name: "Museus", emoji: "🏛️" },
    { name: "Natureza", emoji: "🌲" },
    { name: "Compras", emoji: "🛍️" },
    { name: "Aventura", emoji: "🎢" },
    { name: "Vida noturna", emoji: "🎉" },
    { name: "História", emoji: "📜" },
    { name: "Arte", emoji: "🎨" },
    { name: "Fotografia", emoji: "📸" },
    { name: "Esportes", emoji: "⚽" },
    { name: "Relaxamento", emoji: "🧘" },
    { name: "Arquitetura", emoji: "🏰" },
    { name: "Trilhas", emoji: "🥾" },
    { name: "Parques", emoji: "🎡" },
];

export default function Preferences() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [selected, setSelected] = useState<string[]>(
        [...tripDraft.interests]
    );

    function toggleInterest(item: string) {
        setSelected(current =>
            current.includes(item)
                ? current.filter(value => value !== item)
                : [...current, item]
        );
    }

    function continueToBudget() {
        if (selected.length === 0) return;

        tripDraft.interests = [...selected];

        router.push("/logic/trips/budget");
    }

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#f7f7f7"
            />

            {/* TELA INTEIRA COM ROLAGEM */}

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.content,
                    {
                        paddingTop: insets.top + 8,
                        paddingBottom: selected.length > 0 ? 80 : 16,
                    },
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* CABEÇALHO */}

                <View style={styles.header}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={24}
                            color="#303030"
                        />
                    </Pressable>

                    <Text style={styles.headerTitle}>
                        Preferências
                    </Text>

                    <View style={styles.headerSpace} />
                </View>

                {/* TÍTULOS */}

                <Text style={styles.step}>
                    ETAPA 3 DE 4
                </Text>

                <Text style={styles.title}>
                    O que você pretende fazer?
                </Text>

                <Text style={styles.subtitle}>
                    Selecione seus interesses para personalizarmos
                    sua experiência.
                </Text>

                {/* OPÇÕES DE INTERESSES */}

                <View style={styles.interests}>
                    {interests.map(item => {
                        const active = selected.includes(item.name);

                        return (
                            <Pressable
                                key={item.name}
                                onPress={() => toggleInterest(item.name)}
                                style={[
                                    styles.interest,
                                    active && styles.interestActive,
                                ]}
                            >
                                <Text style={styles.emoji}>
                                    {item.emoji}
                                </Text>

                                <Text
                                    style={[
                                        styles.interestText,
                                        active &&
                                            styles.interestTextActive,
                                    ]}
                                >
                                    {item.name}
                                </Text>

                                {active && (
                                    <MaterialIcons
                                        name="check-circle"
                                        size={15}
                                        color="#ffffff"
                                    />
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {/* CONTAGEM DE SELEÇÕES */}

                <Text style={styles.selectionHint}>
                    {selected.length === 0
                        ? "Você pode escolher várias opções."
                        : `${selected.length} interesses selecionados`}
                </Text>
            </ScrollView>

            {/* BOTÃO FIXO, FORA DA ROLAGEM */}

            {selected.length > 0 && (
                <View
                    style={[
                        styles.footer,
                        {
                            paddingBottom: Math.max(
                                insets.bottom,
                                12
                            ),
                        },
                    ]}
                >
                    <Pressable
                        style={styles.button}
                        onPress={continueToBudget}
                    >
                        <Text style={styles.buttonText}>
                            Continuar
                        </Text>

                        <MaterialIcons
                            name="arrow-forward"
                            size={20}
                            color="#ffffff"
                        />
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },

    scrollView: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 28,
    },

    header: {
        height: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#8492a8",
    },

    headerSpace: {
        width: 40,
        height: 40,
    },

    step: {
        marginTop: 28,
        fontSize: 11,
        fontWeight: "700",
        color: "#8492a8",
        letterSpacing: 1,
    },

    title: {
        marginTop: 10,
        fontSize: 29,
        lineHeight: 35,
        fontWeight: "800",
        color: "#303030",
    },

    subtitle: {
        marginTop: 10,
        fontSize: 14,
        lineHeight: 21,
        color: "#888888",
    },

    interests: {
        marginTop: 30,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 10,
    },

    interest: {
        width: "48%",
        minHeight: 53,
        paddingHorizontal: 10,
        borderRadius: 17,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        borderWidth: 1,
        borderColor: "#eeeeee",
        elevation: 2,
    },

    interestActive: {
        backgroundColor: "#303030",
        borderColor: "#303030",
    },

    emoji: {
        fontSize: 19,
    },

    interestText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#555555",
        flexShrink: 1,
    },

    interestTextActive: {
        color: "#ffffff",
    },

    selectionHint: {
        marginTop: 10,
        fontSize: 12,
        color: "#999999",
        textAlign: "center",
    },
    footer: {
        flexShrink: 0,
        paddingHorizontal: 28,
        paddingTop: 10,
        backgroundColor: "#f7f7f7",
    },

    button: {
        height: 56,
        borderRadius: 28,
        backgroundColor: "#303030",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },
});