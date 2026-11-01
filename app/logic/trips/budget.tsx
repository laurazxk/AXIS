
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";

import GlassBackdrop from "../../../components/GlassBackdrop";
import GlassFrost from "../../../components/GlassFrost";

import {
    glassColor,
    glassDecoration,
    type GlassPalette,
} from "../../../constants/glass";

import { useAxisTheme } from "../../../contexts/ThemeContext";

import {
    Modal,
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

import { tripDraft } from "../../../stores/tripDraft";

type CurrencyOption = {
    code: string;
    name: string;
};

export default function Budget() {
    const {
        palette: axisPalette,
        darkMode: axisDarkMode,
    } = useAxisTheme();

    const styles = React.useMemo(
        () => createStyles(axisPalette),
        [axisPalette]
    );

    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [currency, setCurrency] = useState(
        tripDraft.budgetCurrency || "BRL"
    );

    const [limit, setLimit] = useState(tripDraft.budget || "");

    const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
    const [currenciesLoading, setCurrenciesLoading] = useState(true);
    const [currenciesError, setCurrenciesError] = useState(false);

    const [showAllCurrencies, setShowAllCurrencies] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadCurrencies() {
            try {
                setCurrenciesLoading(true);
                setCurrenciesError(false);

                const response = await fetch(
                    "https://api.frankfurter.dev/v2/currencies"
                );

                if (!response.ok) {
                    throw new Error("Erro ao carregar moedas.");
                }

                const data = await response.json();

                const options: CurrencyOption[] = Array.isArray(data)
                    ? data.map((item: any) => ({
                        code: item.iso_code || item.code,
                        name: item.name,
                    }))
                    : Object.entries(data).map(([code, name]) => ({
                        code,
                        name: String(name),
                    }));

                if (active) {
                    setCurrencies(
                        options
                            .filter(item => item.code && item.name)
                            .sort((a, b) => a.code.localeCompare(b.code))
                    );
                }
            } catch (error) {
                console.error("Erro ao carregar moedas:", error);

                if (active) {
                    setCurrenciesError(true);
                }
            } finally {
                if (active) {
                    setCurrenciesLoading(false);
                }
            }
        }

        loadCurrencies();

        return () => {
            active = false;
        };
    }, []);

    function normalizeBudget(value: string) {
        const cleaned = value.trim().replace(/\s/g, "");

        if (!cleaned) {
            return "";
        }

        if (cleaned.includes(",") && cleaned.includes(".")) {
            const lastComma = cleaned.lastIndexOf(",");
            const lastDot = cleaned.lastIndexOf(".");

            if (lastComma > lastDot) {
                return cleaned
                    .replace(/\./g, "")
                    .replace(",", ".");
            }

            return cleaned.replace(/,/g, "");
        }

        if (cleaned.includes(",")) {
            const parts = cleaned.split(",");

            if (parts.length === 2 && parts[1].length === 3) {
                return parts[0] + parts[1];
            }

            return cleaned.replace(",", ".");
        }

        if (cleaned.includes(".")) {
            const parts = cleaned.split(".");

            if (parts.length === 2 && parts[1].length === 3) {
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

    const localCurrencyName =
        currencies.find(
            item => item.code === tripDraft.localCurrency
        )?.name || tripDraft.localCurrency;

    const popularCurrencies = ["BRL", "USD", "EUR"];

    const otherCurrencies = currencies.filter(
        item => !popularCurrencies.includes(item.code)
    );

    function selectCurrency(code: string) {
        setCurrency(code);
        setShowAllCurrencies(false);
    }

    return (
        <View style={styles.container}>
            <GlassBackdrop />

            <StatusBar
                barStyle={axisDarkMode ? "light-content" : "dark-content"}
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
                            {localCurrencyName}
                        </Text>
                    </View>
                </View>

                <Text style={styles.label}>
                    Qual moeda deseja usar no orçamento?
                </Text>

                <View style={styles.currencySection}>
                    {currenciesLoading ? (
                        <Text style={styles.localCurrencyNote}>
                            Carregando moedas disponíveis...
                        </Text>
                    ) : currenciesError ? (
                        <Text style={styles.localCurrencyNote}>
                            Não foi possível carregar as moedas.
                            Verifique sua conexão e tente novamente.
                        </Text>
                    ) : (
                        <>
                            <View style={styles.currencyContainer}>
                                {popularCurrencies.map(code => {
                                    const item = currencies.find(
                                        currencyItem =>
                                            currencyItem.code === code
                                    );

                                    if (!item) return null;

                                    return (
                                        <Pressable
                                            key={item.code}
                                            onPress={() => setCurrency(item.code)}
                                            style={[
                                                styles.currency,
                                                currency === item.code &&
                                                styles.currencyActive,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.currencyText,
                                                    currency === item.code &&
                                                    styles.currencyTextActive,
                                                ]}
                                            >
                                                {item.code}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            <Pressable
                                style={styles.otherCurrenciesButton}
                                onPress={() => setShowAllCurrencies(true)}
                            >
                                <Text style={styles.otherCurrenciesText}>
                                    Outras moedas
                                </Text>

                                <MaterialIcons
                                    name="expand-more"
                                    size={22}
                                    color={axisPalette.text}
                                />
                            </Pressable>
                        </>
                    )}
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
                            O orçamento será definido na moeda escolhida
                            por você. Os valores poderão ser consultados
                            também na moeda local do destino.
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

            {/* POP-UP DE OUTRAS MOEDAS */}
            <Modal
                visible={showAllCurrencies}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => setShowAllCurrencies(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setShowAllCurrencies(false)}
                    />

                    <BlurView
                        intensity={90}
                        tint="dark"
                        style={[
                            styles.currencyModal,
                            {
                                marginTop: insets.top + 20,
                                marginBottom: insets.bottom + 20,
                            },
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Outras moedas
                            </Text>

                            <Pressable
                                onPress={() => setShowAllCurrencies(false)}
                                style={styles.modalCloseButton}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={22}
                                    color="#FFFFFF"
                                />
                            </Pressable>
                        </View>

                        <Text style={styles.modalSubtitle}>
                            Selecione a moeda que deseja utilizar.
                        </Text>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.modalCurrencyList}
                        >
                            {otherCurrencies.map(item => (
                                <Pressable
                                    key={item.code}
                                    onPress={() => selectCurrency(item.code)}
                                    style={[
                                        styles.modalCurrencyItem,
                                        currency === item.code &&
                                        styles.modalCurrencyItemActive,
                                    ]}
                                >
                                    <View style={styles.modalCurrencyInfo}>
                                        <Text style={styles.modalCurrencyCode}>
                                            {item.code}
                                        </Text>

                                        <Text style={styles.modalCurrencyName}>
                                            {item.name}
                                        </Text>
                                    </View>

                                    {currency === item.code && (
                                        <MaterialIcons
                                            name="check"
                                            size={20}
                                            color="#FFFFFF"
                                        />
                                    )}
                                </Pressable>
                            ))}
                        </ScrollView>

                        <Pressable
                            onPress={() => setShowAllCurrencies(false)}
                            style={styles.modalDoneButton}
                        >
                            <Text style={styles.modalDoneText}>
                                Fechar
                            </Text>
                        </Pressable>
                    </BlurView>
                </View>
            </Modal>
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
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "destinationCard",
                palette
            ),
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
            color: glassColor(
                "color",
                "#8492a8",
                "destinationSubtitle",
                palette
            ),
            marginTop: 4,
        },

        label: {
            marginTop: 30,
            marginBottom: 12,
            fontSize: 14,
            fontWeight: "700",
            color: glassColor("color", "#444444", "label", palette),
        },

        currencySection: {
            gap: 14,
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
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "currency",
                palette
            ),
            alignItems: "center",
            justifyContent: "center",
        },

        currencyActive: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#303030",
                "currencyActive",
                palette
            ),
        },

        currencyText: {
            fontSize: 12,
            fontWeight: "600",
            color: glassColor("color", "#666666", "currencyText", palette),
        },

        currencyTextActive: {
            color: glassColor("color", "#ffffff", "currencyTextActive", palette),
        },

otherCurrenciesButton: {
    alignSelf: "flex-start",
    minHeight: 42,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: glassColor(
        "backgroundColor",
        "#ffffff",
        "otherCurrenciesButton",
        palette
    ),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
},

otherCurrenciesText: {
    fontSize: 12,
    fontWeight: "600",
    color: glassColor(
        "color",
        "#444444",
        "otherCurrenciesText",
        palette
    ),
},

        // Modal glass
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 22,
        },

        currencyModal: {
            width: "100%",
            maxHeight: "80%",
            borderRadius: 26,
            overflow: "hidden",
            padding: 22,
            backgroundColor: "rgba(90,90,90,0.78)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.30)",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 12,
        },

        modalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },

        modalTitle: {
            fontSize: 21,
            fontWeight: "800",
            color: "#FFFFFF",
        },

        modalCloseButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.16)",
            alignItems: "center",
            justifyContent: "center",
        },

        modalSubtitle: {
            fontSize: 13,
            color: "rgba(255,255,255,0.75)",
            marginTop: 8,
            marginBottom: 18,
        },

        modalCurrencyList: {
            gap: 8,
            paddingBottom: 12,
        },

        modalCurrencyItem: {
            minHeight: 54,
            borderRadius: 14,
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: "rgba(255,255,255,0.12)",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
        },

        modalCurrencyItemActive: {
            backgroundColor: "rgba(255,255,255,0.25)",
            borderColor: "rgba(255,255,255,0.55)",
        },

        modalCurrencyInfo: {
            flex: 1,
            gap: 3,
        },

        modalCurrencyCode: {
            fontSize: 14,
            fontWeight: "700",
            color: "#FFFFFF",
        },

        modalCurrencyName: {
            fontSize: 11,
            color: "rgba(255,255,255,0.70)",
        },

        modalDoneButton: {
            marginTop: 14,
            minHeight: 46,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.16)",
            alignItems: "center",
            justifyContent: "center",
        },

        modalDoneText: {
            fontSize: 13,
            fontWeight: "700",
            color: "#FFFFFF",
        },

        moneyInput: {
            height: 58,
            borderRadius: 29,
            paddingHorizontal: 20,
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "moneyInput",
                palette
            ),
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
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "estimateCard",
                palette
            ),
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
            color: glassColor(
                "color",
                "#999999",
                "localCurrencyNote",
                palette
            ),
        },

        button: {
            height: 56,
            marginTop: 35,
            borderRadius: 28,
            backgroundColor: glassColor(
                "backgroundColor",
                "#303030",
                "button",
                palette
            ),
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
