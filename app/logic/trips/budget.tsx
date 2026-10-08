import GlassFrost from "../../../components/GlassFrost";
import { useAxisTheme } from "../../../contexts/ThemeContext";
import { glassColor, glassDecoration, type GlassPalette } from "../../../constants/glass";
import GlassBackdrop from "../../../components/GlassBackdrop";
import React from "react";

import { useState } from "react";

import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tripDraft } from "./tripDraft";

const currencies = ["BRL", "EUR", "USD"];

const currencyNames: Record<string, string> = {
    BRL: "Real brasileiro",
    EUR: "Euro",
    USD: "Dólar americano",
    GBP: "Libra esterlina",
    JPY: "Iene japonês",
    CAD: "Dólar canadense",
    CHF: "Franco suíço",
    AUD: "Dólar australiano",
    CNY: "Yuan chinês",
    KRW: "Won sul-coreano",
    MXN: "Peso mexicano",
    ARS: "Peso argentino",
    CLP: "Peso chileno",
    PEN: "Sol peruano",
    THB: "Baht tailandês",
    AED: "Dirham dos Emirados",
    EGP: "Libra egípcia",
    MAD: "Dirham marroquino",
    TRY: "Lira turca",
    CZK: "Coroa tcheca",
    DOP: "Peso dominicano",
};

export default function Budget() {
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);

    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [currency, setCurrency] = useState(
        tripDraft.budgetCurrency || "BRL"
    );

    const [limit, setLimit] = useState(tripDraft.budget || "");

    function normalizeBudget(value: string) {
        const cleaned = value.trim().replace(/\s/g, "");

        if (!cleaned) {
            return "";
        }

        // Exemplo: 50.000,50 → 50000.50
        if (
            cleaned.includes(",") &&
            cleaned.includes(".")
        ) {
            const lastComma = cleaned.lastIndexOf(",");
            const lastDot = cleaned.lastIndexOf(".");

            if (lastComma > lastDot) {
                return cleaned
                    .replace(/\./g, "")
                    .replace(",", ".");
            }

            return cleaned.replace(/,/g, "");
        }

        // Exemplo: 50,000 → 50000
        // Exemplo: 50,00 → 50.00
        if (cleaned.includes(",")) {
            const parts = cleaned.split(",");

            if (
                parts.length === 2 &&
                parts[1].length === 3
            ) {
                return parts[0] + parts[1];
            }

            return cleaned.replace(",", ".");
        }

        // Exemplo: 50.000 → 50000
        if (cleaned.includes(".")) {
            const parts = cleaned.split(".");

            if (
                parts.length === 2 &&
                parts[1].length === 3
            ) {
                return parts[0] + parts[1];
            }
        }

        return cleaned;
    }

    function continueToMethod() {
        tripDraft.budgetCurrency = currency;
        tripDraft.budget = normalizeBudget(limit);

        router.push("/logic/trips/method");
    }

    return (
        <View style={styles.container}>
            <GlassBackdrop />
            <StatusBar
                barStyle={axisDarkMode ? "light-content" : "dark-content"}
                backgroundColor="#f7f7f7"
            />

            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.content,
                    { paddingTop: insets.top + 8 },
                ]}
            >
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

                <Text style={styles.step}>ETAPA 4 DE 4</Text>

                <Text style={styles.title}>
                    Defina seu orçamento
                </Text>

                <Text style={styles.subtitle}>
                    Quanto pretende gastar durante sua viagem?
                </Text>

                <View style={styles.destinationCard}>
                <GlassFrost />
                    <MaterialIcons
                        name="place"
                        size={23}
                        color={axisPalette.muted}
                    />

                    <View style={styles.destinationText}>
                        <Text style={styles.destinationTitle}>
                            {tripDraft.destination || "Seu destino"}
                            {tripDraft.country
                                ? `, ${tripDraft.country}`
                                : ""}
                        </Text>

                        <Text style={styles.destinationSubtitle}>
                            Moeda local: {tripDraft.localCurrency}
                            {" · "}
                            {currencyNames[tripDraft.localCurrency] ||
                                tripDraft.localCurrency}
                        </Text>
                    </View>
                </View>

                <Text style={styles.label}>
                    Qual moeda deseja usar no orçamento?
                </Text>

                <View style={styles.currencyContainer}>
                    {currencies.map(item => (
                        <Pressable
                            key={item}
                            onPress={() => setCurrency(item)}
                            style={[
                                styles.currency,
                                currency === item &&
                                styles.currencyActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.currencyText,
                                    currency === item &&
                                    styles.currencyTextActive,
                                ]}
                            >
                                {item}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>
                    Limite de gasto
                </Text>

                <View style={styles.moneyInput}>
                    <Text style={styles.moneySymbol}>
                        {currency}
                    </Text>

                    <TextInput
                        value={limit}
                        onChangeText={setLimit}
                        placeholder="0,00"
                        placeholderTextColor={axisPalette.muted}
                        keyboardType="decimal-pad"
                        style={styles.input}
                        returnKeyType="done"
                    />
                </View>

                <View style={styles.estimateCard}>
                <GlassFrost />
                    <View style={styles.estimateContent}>
                        <Text style={styles.estimateLabel}>
                            Seu orçamento
                        </Text>

                        <Text style={styles.estimateText}>
                            {limit.trim()
                                ? `Limite informado: ${currency} ${limit}`
                                : "Informe quanto pretende gastar na viagem."}
                        </Text>

                        <Text style={styles.localCurrencyNote}>
                            A moeda local é identificada pelo destino.
                            A conversão cambial será integrada posteriormente.
                        </Text>
                    </View>

                    <MaterialIcons
                        name="trending-up"
                        size={28}
                        color={axisPalette.muted}
                    />
                </View>

                <Pressable
                    style={styles.button}
                    onPress={continueToMethod}
                >
                    <Text style={styles.buttonText}>
                        Continuar
                    </Text>

                    <MaterialIcons
                        name="arrow-forward"
                        size={20}
                        color={axisPalette.accentText}
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

    backButton: {
        width: 42,
        height: 42,
        marginTop: 18,
        alignItems: "center",
        justifyContent: "center",
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

    destinationCard: {
        ...glassDecoration("destinationCard", palette),
        marginTop: 26,
        padding: 16,
        minHeight: 70,
        borderRadius: 18,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "destinationCard", palette),
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    destinationText: {
        flex: 1,
    },

    destinationTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: glassColor("color", "#303030", "destinationTitle", palette),
    },

    destinationSubtitle: {
        fontSize: 11,
        lineHeight: 17,
        color: glassColor("color", "#8492a8", "destinationSubtitle", palette),
        marginTop: 4,
    },

    label: {
        marginTop: 30,
        marginBottom: 12,
        fontSize: 14,
        fontWeight: "700",
        color: glassColor("color", "#444444", "label", palette),
    },

    currencyContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    currency: {
        paddingHorizontal: 20,
        height: 42,
        borderRadius: 22,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "currency", palette),
        alignItems: "center",
        justifyContent: "center",
    },

    currencyActive: {
        backgroundColor: glassColor("backgroundColor", "#303030", "currencyActive", palette),
    },

    currencyText: {
        fontSize: 12,
        fontWeight: "600",
        color: glassColor("color", "#666666", "currencyText", palette),
    },

    currencyTextActive: {
        color: glassColor("color", "#ffffff", "currencyTextActive", palette),
    },

    moneyInput: {
        height: 58,
        borderRadius: 29,
        paddingHorizontal: 20,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "moneyInput", palette),
        flexDirection: "row",
        alignItems: "center",
    },

    moneySymbol: {
        fontSize: 13,
        fontWeight: "700",
        color: glassColor("color", "#8492a8", "moneySymbol", palette),
        marginRight: 10,
    },

    input: {
        flex: 1,
        fontSize: 17,
        color: glassColor("color", "#333333", "input", palette),
    },

    estimateCard: {
        ...glassDecoration("estimateCard", palette),
        marginTop: 28,
        padding: 20,
        borderRadius: 18,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "estimateCard", palette),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
    },

    estimateContent: {
        flex: 1,
    },

    estimateLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: glassColor("color", "#333333", "estimateLabel", palette),
    },

    estimateText: {
        marginTop: 5,
        fontSize: 12,
        lineHeight: 18,
        color: glassColor("color", "#888888", "estimateText", palette),
    },

    localCurrencyNote: {
        marginTop: 10,
        fontSize: 11,
        lineHeight: 16,
        color: glassColor("color", "#999999", "localCurrencyNote", palette),
    },

    button: {
        height: 56,
        marginTop: 35,
        borderRadius: 28,
        backgroundColor: glassColor("backgroundColor", "#303030", "button", palette),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    buttonText: {
        color: glassColor("color", "#ffffff", "buttonText", palette),
        fontSize: 15,
        fontWeight: "700",
    },
});