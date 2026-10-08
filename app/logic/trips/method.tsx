import GlassFrost from "../../../components/GlassFrost";
import { useAxisTheme } from "../../../contexts/ThemeContext";
import { glassColor, glassDecoration, type GlassPalette } from "../../../constants/glass";
import GlassBackdrop from "../../../components/GlassBackdrop";

import React from "react";

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

export default function MethodScreen() {
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);

    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <GlassBackdrop />
            <StatusBar
                barStyle={axisDarkMode ? "light-content" : "dark-content"}
                backgroundColor="#f7f7f7"
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
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={24}
                            color={axisPalette.text}
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
                    Escolha como prefere organizar os dias
                    e aproveitar seu destino.
                </Text>

                <View style={styles.summaryCard}>
                <GlassFrost />
                    <View style={styles.summaryIcon}>
                        <MaterialIcons
                            name="luggage"
                            size={26}
                            color={axisPalette.accentText}
                        />
                    </View>

                    <View style={styles.summaryText}>
                        <Text style={styles.summaryTitle}>
                            {tripDraft.destination}
                            {tripDraft.country
                                ? `, ${tripDraft.country}`
                                : ""}
                        </Text>

                        <Text style={styles.summaryDescription}>
                            {tripDraft.dateMode === "dates"
                                ? `${tripDraft.startDate} a ${tripDraft.endDate}`
                                : `${tripDraft.duration} dias`}
                        </Text>

                        <Text style={styles.summaryDescription}>
                            {tripDraft.interests.length > 0
                                ? tripDraft.interests.join(", ")
                                : "Nenhum interesse selecionado"}
                        </Text>

                        <Text style={styles.summaryBudget}>
                            Orçamento: {tripDraft.budgetCurrency}{" "}
                            {tripDraft.budget || "Não informado"}
                        </Text>
                    </View>
                </View>

                <Pressable
                    style={[styles.optionCard, styles.aiCard]}
                    disabled
                >
                    <View style={styles.optionIcon}>
                        <MaterialIcons
                            name="auto-awesome"
                            size={28}
                            color={axisPalette.muted}
                        />
                    </View>

                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>
                            Gerar roteiro com IA
                        </Text>

                        <Text style={styles.optionDescription}>
                            Receba sugestões de passeios e atividades
                            personalizadas para sua viagem.
                        </Text>

                        <Text style={styles.comingSoon}>
                            Em breve
                        </Text>
                    </View>

                    <MaterialIcons
                        name="arrow-forward"
                        size={21}
                        color={axisPalette.muted}
                    />
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.optionCard,
                        pressed && styles.pressed,
                    ]}
                    onPress={() =>
                        router.push("/logic/trips/itinerary")
                    }
                >
                    <View style={styles.optionIcon}>
                        <MaterialIcons
                            name="edit-calendar"
                            size={28}
                            color={axisPalette.muted}
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
                        size={21}
                        color={axisPalette.text}
                    />
                </Pressable>
            </ScrollView>
        </View>
    );
}

const createStyles = (palette: GlassPalette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
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
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: glassColor("color", "#8492a8", "headerTitle", palette),
    },

    headerSpace: {
        width: 40,
        height: 40,
    },

    step: {
        marginTop: 28,
        fontSize: 11,
        fontWeight: "700",
        color: glassColor("color", "#8492a8", "step", palette),
        letterSpacing: 1,
    },

    title: {
        marginTop: 10,
        fontSize: 29,
        lineHeight: 35,
        fontWeight: "800",
        color: glassColor("color", "#303030", "title", palette),
    },

    subtitle: {
        marginTop: 10,
        fontSize: 14,
        lineHeight: 21,
        color: glassColor("color", "#888888", "subtitle", palette),
    },

    summaryCard: {
        ...glassDecoration("summaryCard", palette),
        marginTop: 27,
        padding: 17,
        borderRadius: 20,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "summaryCard", palette),
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
        elevation: 2,
    },

    summaryIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: glassColor("backgroundColor", "#a7a7a7", "summaryIcon", palette),
        alignItems: "center",
        justifyContent: "center",
    },

    summaryText: {
        flex: 1,
    },

    summaryTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: glassColor("color", "#303030", "summaryTitle", palette),
    },

    summaryDescription: {
        fontSize: 11,
        lineHeight: 17,
        color: glassColor("color", "#888888", "summaryDescription", palette),
        marginTop: 4,
    },

    summaryBudget: {
        fontSize: 12,
        fontWeight: "600",
        color: glassColor("color", "#8492a8", "summaryBudget", palette),
        marginTop: 7,
    },

    optionCard: {
        ...glassDecoration("optionCard", palette),
        marginTop: 18,
        padding: 18,
        borderRadius: 20,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "optionCard", palette),
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
        elevation: 2,
    },

    aiCard: {
        ...glassDecoration("aiCard", palette),
        opacity: 0.65,
    },

    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: glassColor("backgroundColor", "#eef0f3", "optionIcon", palette),
        alignItems: "center",
        justifyContent: "center",
    },

    optionText: {
        flex: 1,
    },

    optionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: glassColor("color", "#303030", "optionTitle", palette),
    },

    optionDescription: {
        marginTop: 6,
        fontSize: 11,
        lineHeight: 17,
        color: glassColor("color", "#888888", "optionDescription", palette),
    },

    comingSoon: {
        marginTop: 8,
        fontSize: 10,
        fontWeight: "700",
        color: glassColor("color", "#8492a8", "comingSoon", palette),
    },

    pressed: {
        transform: [{ scale: 0.98 }],
    },
});