import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    ScrollView,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";


const currencies = [
    "BRL",
    "EUR",
    "USD",
    "GBP",
    "JPY",
];


export default function Budget() {

    const router = useRouter();

    const insets = useSafeAreaInsets();

    const [currency, setCurrency] = useState("BRL");
    const [limit, setLimit] = useState("");


    return (

        <View style={styles.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.content,
                    {
                        paddingTop: insets.top + 8,
                    },
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


                <Text style={styles.step}>
                    3 DE 4
                </Text>


                <Text style={styles.title}>
                    Defina seu orçamento
                </Text>


                <Text style={styles.subtitle}>
                    Quanto pretende gastar durante
                    sua viagem?
                </Text>


                <Text style={styles.label}>
                    Qual moeda?
                </Text>


                <View style={styles.currencyContainer}>

                    {currencies.map((item) => (

                        <Pressable
                            key={item}
                            onPress={() =>
                                setCurrency(item)
                            }
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
                        keyboardType="numeric"
                        style={styles.input}
                    />

                </View>


                {/* ESTIMATIVA */}

                <View style={styles.estimateCard}>

                    <View>

                        <Text style={styles.estimateLabel}>
                            Estimativa de gasto
                        </Text>

                        <Text style={styles.estimateText}>
                            A estimativa será calculada
                            conforme seu roteiro.
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
                    onPress={() =>
                        router.push("/logic/trips")
                    }
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

    label: {
        marginTop: 32,
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
        paddingHorizontal: 17,
        height: 40,
        borderRadius: 20,
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
        alignItems: "center",
    },

    estimateLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#333333",
    },

    estimateText: {
        marginTop: 5,
        maxWidth: 250,
        fontSize: 12,
        lineHeight: 18,
        color: "#999999",
    },

    button: {
        height: 56,
        marginTop: 40,
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