import { useLocalSearchParams, useRouter } from "expo-router";

import { useState } from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { savedTrips } from "../trips/tripStore";

export default function NewExpenseScreen() {
    const router = useRouter();

    const { id } = useLocalSearchParams<{ id: string }>();

    const [value, setValue] = useState(0);
    const [people, setPeople] = useState(1);
    const [selectedColor, setSelectedColor] =
        useState("red");
    const [name, setName] = useState("");

    const [currency, setCurrency] =
        useState("BRL");

    function handleValueChange(text: string) {
        const number = Number(
            text.replace(",", ".")
        );

        if (isNaN(number)) {
            setValue(0);
            return;
        }

        setValue(number);
    }

    function handleAddExpense() {
        const trip = savedTrips.find(
            (item) => item.id === id
        );

        if (!trip || !name.trim() || value <= 0) {
            return;
        }

        const expense = {
            id: Date.now().toString(),
            name: name.trim(),
            value,
            currency,
            color: selectedColor,
            people,
            perPerson: value / people,
        };

        if (!trip.expenses) {
            trip.expenses = [];
        }

        trip.expenses.push(expense);

        router.back();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                >
                    <Text style={styles.cancelText}>
                        Cancelar
                    </Text>
                </Pressable>

                <Text style={styles.title}>
                    Nova Despesa
                </Text>

                <Pressable
                    onPress={handleAddExpense}
                >
                    <Text style={styles.addText}>
                        Adicionar
                    </Text>
                </Pressable>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>
                    Valor
                </Text>

                <View style={styles.valueRow}>
                    <TextInput
                        style={styles.valueInput}
                        placeholder="0,00"
                        keyboardType="numeric"
                        placeholderTextColor="#999999"
                        value={
                            value === 0
                                ? ""
                                : String(value)
                        }
                        onChangeText={
                            handleValueChange
                        }
                    />

                    <View style={styles.currencyRow}>
                        <Pressable
                            onPress={() =>
                                setCurrency("BRL")
                            }
                            style={[
                                styles.currencyButton,
                                currency === "BRL" &&
                                    styles.selectedCurrency,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.currencyText,
                                    currency === "BRL" &&
                                        styles.selectedCurrencyText,
                                ]}
                            >
                                BRL
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() =>
                                setCurrency("EUR")
                            }
                            style={[
                                styles.currencyButton,
                                currency === "EUR" &&
                                    styles.selectedCurrency,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.currencyText,
                                    currency === "EUR" &&
                                        styles.selectedCurrencyText,
                                ]}
                            >
                                EUR
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() =>
                                setCurrency("USD")
                            }
                            style={[
                                styles.currencyButton,
                                currency === "USD" &&
                                    styles.selectedCurrency,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.currencyText,
                                    currency === "USD" &&
                                        styles.selectedCurrencyText,
                                ]}
                            >
                                USD
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.label}>
                    Nome
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ex: Compras"
                    placeholderTextColor="#999999"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>
                    Cor
                </Text>

                <View style={styles.colorRow}>
                    <Pressable
                        onPress={() =>
                            setSelectedColor("red")
                        }
                        style={[
                            styles.color,
                            styles.red,
                            selectedColor === "red" &&
                                styles.selectedColor,
                        ]}
                    />

                    <Pressable
                        onPress={() =>
                            setSelectedColor("blue")
                        }
                        style={[
                            styles.color,
                            styles.blue,
                            selectedColor === "blue" &&
                                styles.selectedColor,
                        ]}
                    />

                    <Pressable
                        onPress={() =>
                            setSelectedColor("green")
                        }
                        style={[
                            styles.color,
                            styles.green,
                            selectedColor === "green" &&
                                styles.selectedColor,
                        ]}
                    />

                    <Pressable
                        onPress={() =>
                            setSelectedColor("yellow")
                        }
                        style={[
                            styles.color,
                            styles.yellow,
                            selectedColor === "yellow" &&
                                styles.selectedColor,
                        ]}
                    />
                </View>

                <Text style={styles.label}>
                    Divisão
                </Text>

                <View style={styles.peopleCard}>
                    <Text style={styles.peopleText}>
                        Dividir entre
                    </Text>

                    <View
                        style={styles.peopleSelector}
                    >
                        <Pressable
                            onPress={() =>
                                setPeople(
                                    Math.max(
                                        1,
                                        people - 1
                                    )
                                )
                            }
                            style={styles.peopleButton}
                        >
                            <Text
                                style={
                                    styles.peopleButtonText
                                }
                            >
                                −
                            </Text>
                        </Pressable>

                        <Text
                            style={styles.peopleNumber}
                        >
                            {people}
                        </Text>

                        <Pressable
                            onPress={() =>
                                setPeople(
                                    people + 1
                                )
                            }
                            style={styles.peopleButton}
                        >
                            <Text
                                style={
                                    styles.peopleButtonText
                                }
                            >
                                +
                            </Text>
                        </Pressable>
                    </View>

                    <Text style={styles.peopleLabel}>
                        pessoas
                    </Text>

                    <Text style={styles.perPerson}>
                        {currency}{" "}
                        {(value / people)
                            .toFixed(2)
                            .replace(".", ",")}{" "}
                        por pessoa
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
        paddingHorizontal: 24,
        paddingTop: 60,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#303030",
    },

    cancelText: {
        fontSize: 14,
        color: "#777777",
    },

    addText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#303030",
    },

    form: {
        marginTop: 35,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#303030",
        marginBottom: 8,
        marginTop: 20,
    },

    valueRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    valueInput: {
        flex: 1,
        height: 52,
        backgroundColor: "#ffffff",
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#303030",
    },

    currencyRow: {
        flexDirection: "row",
        gap: 6,
    },

    currencyButton: {
        height: 52,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },

    selectedCurrency: {
        backgroundColor: "#303030",
    },

    currencyText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#777777",
    },

    selectedCurrencyText: {
        color: "#ffffff",
    },

    input: {
        height: 52,
        backgroundColor: "#ffffff",
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#303030",
    },

    colorRow: {
        flexDirection: "row",
        gap: 14,
    },

    color: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },

    selectedColor: {
        borderWidth: 3,
        borderColor: "#303030",
    },

    red: {
        backgroundColor: "#E57373",
    },

    blue: {
        backgroundColor: "#6C8CFF",
    },

    green: {
        backgroundColor: "#7BCFA6",
    },

    yellow: {
        backgroundColor: "#F2C94C",
    },

    peopleCard: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 16,
    },

    peopleText: {
        fontSize: 14,
        color: "#303030",
    },

    peopleSelector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
        gap: 20,
    },

    peopleButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#eeeeee",
        alignItems: "center",
        justifyContent: "center",
    },

    peopleButtonText: {
        fontSize: 22,
        color: "#303030",
    },

    peopleNumber: {
        fontSize: 20,
        fontWeight: "700",
        color: "#303030",
    },

    peopleLabel: {
        textAlign: "center",
        marginTop: 4,
        fontSize: 13,
        color: "#888888",
    },

    perPerson: {
        marginTop: 12,
        textAlign: "center",
        fontSize: 13,
        color: "#888888",
    },
});