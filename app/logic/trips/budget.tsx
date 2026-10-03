
import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    ScrollView,
    StatusBar,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [currency, setCurrency] = useState(
        tripDraft.budgetCurrency || "BRL"
    );

    const [limit, setLimit] = useState(tripDraft.budget || "");

    function continueToMethod() {
        tripDraft.budgetCurrency = currency;
        tripDraft.budget = limit;

        router.push("/logic/trips/method");
    }

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
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
                        color="#303030"
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
                    <MaterialIcons
                        name="place"
                        size={23}
                        color="#8492a8"
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
                        placeholderTextColor="#999999"
                        keyboardType="decimal-pad"
                        style={styles.input}
                        returnKeyType="done"
                    />
                </View>

                <View style={styles.estimateCard}>
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
                        color="#8492a8"
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
                        color="#ffffff"
                    />
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
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

    destinationCard: {
        marginTop: 26,
        padding: 16,
        minHeight: 70,
        borderRadius: 18,
        backgroundColor: "#ffffff",
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
        color: "#303030",
    },

    destinationSubtitle: {
        fontSize: 11,
        lineHeight: 17,
        color: "#8492a8",
        marginTop: 4,
    },

    label: {
        marginTop: 30,
        marginBottom: 12,
        fontSize: 14,
        fontWeight: "700",
        color: "#444444",
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
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },

    currencyActive: {
        backgroundColor: "#303030",
    },

    currencyText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666666",
    },

    currencyTextActive: {
        color: "#ffffff",
    },

    moneyInput: {
        height: 58,
        borderRadius: 29,
        paddingHorizontal: 20,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
    },

    moneySymbol: {
        fontSize: 13,
        fontWeight: "700",
        color: "#8492a8",
        marginRight: 10,
    },

    input: {
        flex: 1,
        fontSize: 17,
        color: "#333333",
    },

    estimateCard: {
        marginTop: 28,
        padding: 20,
        borderRadius: 18,
        backgroundColor: "#ffffff",
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
        color: "#333333",
    },

    estimateText: {
        marginTop: 5,
        fontSize: 12,
        lineHeight: 18,
        color: "#888888",
    },

    localCurrencyNote: {
        marginTop: 10,
        fontSize: 11,
        lineHeight: 16,
        color: "#999999",
    },

    button: {
        height: 56,
        marginTop: 35,
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