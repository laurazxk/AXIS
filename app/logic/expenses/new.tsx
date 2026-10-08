import GlassFrost from "../../../components/GlassFrost";
import { useAxisTheme } from "../../../contexts/ThemeContext";
import { glassColor, glassDecoration, type GlassPalette } from "../../../constants/glass";
import GlassBackdrop from "../../../components/GlassBackdrop";
import React from "react";
import { BlurView } from "expo-blur";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useState } from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import ColorPicker, {
    HueSlider,
    Panel1,
    Preview,
} from "reanimated-color-picker";

import { savedTrips } from "../trips/tripStore";

export default function NewExpenseScreen() {
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);

    const router = useRouter();

    const { id } = useLocalSearchParams<{ id: string }>();

    const [value, setValue] = useState(0);

    const [people, setPeople] = useState(1);

    const [selectedColor, setSelectedColor] = useState("red");

    const [name, setName] = useState("");

    const [currency, setCurrency] = useState("BRL");

    const [showColorPicker, setShowColorPicker] = useState(false);

    const [customColors, setCustomColors] = useState<string[]>([]);

    const [showCustomColorPicker, setShowCustomColorPicker] =
        useState(false);

    const [customColor, setCustomColor] = useState("#8B5CF6");

    function handleValueChange(text: string) {
        const number = Number(text.replace(",", "."));

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

    function handleSaveCustomColor() {
        const color = customColor.trim();

        if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
            return;
        }

        const formattedColor = color.toUpperCase();

        setCustomColors((current) => [
            ...current,
            formattedColor,
        ]);

        setSelectedColor(formattedColor);

        setShowCustomColorPicker(false);

        setShowColorPicker(true);
    }

    return (
        <View style={styles.container}>
            <GlassBackdrop />
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Text style={styles.cancelText}>
                        Cancelar
                    </Text>
                </Pressable>

                <Text style={styles.title}>
                    Nova Despesa
                </Text>

                <Pressable onPress={handleAddExpense}>
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
                        placeholderTextColor={axisPalette.muted}
                        value={
                            value === 0
                                ? ""
                                : String(value)
                        }
                        onChangeText={handleValueChange}
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
                    placeholderTextColor={axisPalette.muted}
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

                    <Pressable
                        onPress={() =>
                            setShowColorPicker(
                                !showColorPicker
                            )
                        }
                        style={styles.addColorButton}
                    >
                        <Text style={styles.addColorText}>
                            +
                        </Text>
                    </Pressable>
                </View>

                {showColorPicker && (
                    <View style={styles.colorPopupWrapper}>
                        <BlurView
                            intensity={90}
                            tint="dark"
                            style={styles.colorPopup}
                        >
                            <Text style={styles.popupTitle}>
                                Escolha uma cor
                            </Text>

                            <View
                                style={
                                    styles.popupColorRow
                                }
                            >
                                <Pressable
                                    onPress={() => {
                                        setSelectedColor("#e59a68");

                                        setShowColorPicker(
                                            false
                                        );
                                    }}
                                    style={[
                                        styles.popupColor,
                                        styles.orange,
                                    ]}
                                />

                                <Pressable
                                    onPress={() => {
                                        setSelectedColor("#a583d0");

                                        setShowColorPicker(
                                            false
                                        );
                                    }}
                                    style={[
                                        styles.popupColor,
                                        styles.purple,
                                    ]}
                                />

                                <Pressable
                                    onPress={() => {
                                        setSelectedColor("#e38eae");

                                        setShowColorPicker(
                                            false
                                        );
                                    }}
                                    style={[
                                        styles.popupColor,
                                        styles.pink,
                                    ]}
                                />

                                <Pressable
                                    onPress={() => {
                                       setSelectedColor("#71c5cf");

                                        setShowColorPicker(
                                            false
                                        );
                                    }}
                                    style={[
                                        styles.popupColor,
                                        styles.cyan,
                                    ]}
                                />

                                <Pressable
                                    onPress={() => {
                                       setSelectedColor("#a77b61");
                                        setShowColorPicker(
                                            false
                                        );
                                    }}
                                    style={[
                                        styles.popupColor,
                                        styles.brown,
                                    ]}
                                />

                                <Pressable
                                    onPress={() => {
                                       setSelectedColor("#a7adb5"); 

                                        setShowColorPicker(
                                            false
                                        );
                                    }}
                                    style={[
                                        styles.popupColor,
                                        styles.gray,
                                    ]}
                                />
                            </View>

                            <View
                                style={
                                    styles.myColorsSection
                                }
                            >
                                <Text
                                    style={
                                        styles.myColorsTitle
                                    }
                                >
                                    Minhas cores
                                </Text>

                                <View
                                    style={
                                        styles.myColorsRow
                                    }
                                >
                                    {customColors.length ===
                                    0 ? (
                                        <Text
                                            style={
                                                styles.noColorsText
                                            }
                                        >
                                            Você ainda não
                                            criou nenhuma
                                            cor.
                                        </Text>
                                    ) : (
                                        customColors.map(
                                            (color) => (
                                                <View
                                                    key={color}
                                                    style={
                                                        styles.customColorItem
                                                    }
                                                >
                                                    <Pressable
                                                        onPress={() => {
                                                            setSelectedColor(
                                                                color
                                                            );

                                                            setShowColorPicker(
                                                                false
                                                            );
                                                        }}
                                                        style={[
                                                            styles.popupColor,
                                                            {
                                                                backgroundColor:
                                                                    color,
                                                            },
                                                            selectedColor ===
                                                                color &&
                                                                styles.selectedPopupColor,
                                                        ]}
                                                    />

                                                    <Pressable
                                                        onPress={() => {
                                                            setCustomColors(
                                                                (
                                                                    current
                                                                ) =>
                                                                    current.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item !==
                                                                            color
                                                                    )
                                                            );

                                                            if (
                                                                selectedColor ===
                                                                color
                                                            ) {
                                                                setSelectedColor(
                                                                    "red"
                                                                );
                                                            }
                                                        }}
                                                        style={
                                                            styles.deleteColorButton
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.deleteColorText
                                                            }
                                                        >
                                                            ×
                                                        </Text>
                                                    </Pressable>
                                                </View>
                                            )
                                        )
                                    )}
                                </View>

                                <Pressable
                                    onPress={() => {
                                        setShowColorPicker(
                                            false
                                        );

                                        setShowCustomColorPicker(
                                            true
                                        );
                                    }}
                                    style={
                                        styles.createColorButton
                                    }
                                >
                                    <Text
                                        style={
                                            styles.createColorPlus
                                        }
                                    >
                                        +
                                    </Text>

                                    <Text
                                        style={
                                            styles.createColorText
                                        }
                                    >
                                        Criar nova cor
                                    </Text>
                                </Pressable>
                            </View>

                            <Pressable
                                onPress={() =>
                                    setShowColorPicker(
                                        false
                                    )
                                }
                                style={
                                    styles.closePopupButton
                                }
                            >
                                <Text
                                    style={
                                        styles.closePopupText
                                    }
                                >
                                    Fechar
                                </Text>
                            </Pressable>
                        </BlurView>
                    </View>
                )}

                {showCustomColorPicker && (
                    <View
                        style={
                            styles.customColorOverlay
                        }
                    >
                        <BlurView
                            intensity={95}
                            tint="dark"
                            style={
                                styles.customColorModal
                            }
                        >
                            <Text
                                style={
                                    styles.customColorTitle
                                }
                            >
                                Criar nova cor
                            </Text>

                            <Text
                                style={
                                    styles.customColorDescription
                                }
                            >
                                Escolha visualmente a cor
                                que deseja usar.
                            </Text>

                            <ColorPicker
                                value={customColor}
                                onCompleteJS={({ hex }) => {
                                    setCustomColor(hex);
                                }}
                                style={styles.colorPicker}
                            >
                                <Preview
                                    style={
                                        styles.colorPickerPreview
                                    }
                                />

                                <Panel1
                                    style={
                                        styles.colorPanel
                                    }
                                />

                                <HueSlider
                                    style={
                                        styles.hueSlider
                                    }
                                />
                            </ColorPicker>

                            <Pressable
                                style={
                                    styles.saveCustomColorButton
                                }
                                onPress={
                                    handleSaveCustomColor
                                }
                            >
                                <Text
                                    style={
                                        styles.saveCustomColorButtonText
                                    }
                                >
                                    Salvar cor
                                </Text>
                            </Pressable>

                            <Pressable
                                style={
                                    styles.cancelCustomColorButton
                                }
                                onPress={() =>
                                    setShowCustomColorPicker(
                                        false
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.cancelCustomColorButtonText
                                    }
                                >
                                    Cancelar
                                </Text>
                            </Pressable>
                        </BlurView>
                    </View>
                )}

                <Text style={styles.label}>
                    Divisão
                </Text>

                <View style={styles.peopleCard}>
                <GlassFrost />
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

const createStyles = (palette: GlassPalette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
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
        color: glassColor("color", "#303030", "title", palette),
    },

    cancelText: {
        fontSize: 14,
        color: glassColor("color", "#777777", "cancelText", palette),
    },

    addText: {
        fontSize: 14,
        fontWeight: "600",
        color: glassColor("color", "#303030", "addText", palette),
    },

    form: {
        marginTop: 35,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: glassColor("color", "#303030", "label", palette),
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
        backgroundColor: glassColor("backgroundColor", "#ffffff", "valueInput", palette),
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: glassColor("color", "#303030", "valueInput", palette),
    },

    currencyRow: {
        flexDirection: "row",
        gap: 6,
    },

    currencyButton: {
        height: 52,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "currencyButton", palette),
        alignItems: "center",
        justifyContent: "center",
    },

    selectedCurrency: {
        backgroundColor: glassColor("backgroundColor", "#303030", "selectedCurrency", palette),
    },

    currencyText: {
        fontSize: 12,
        fontWeight: "600",
        color: glassColor("color", "#777777", "currencyText", palette),
    },

    selectedCurrencyText: {
        color: glassColor("color", "#ffffff", "selectedCurrencyText", palette),
    },

    input: {
        height: 52,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "input", palette),
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: glassColor("color", "#303030", "input", palette),
    },

    colorRow: {
        flexDirection: "row",
        gap: 14,
        alignItems: "center",
    },

    color: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },

    selectedColor: {
        borderWidth: 3,
        borderColor: glassColor("borderColor", "#303030", "selectedColor", palette),
    },

    red: {
        backgroundColor: glassColor("backgroundColor", "#E57373", "red", palette),
    },

    blue: {
        backgroundColor: glassColor("backgroundColor", "#6C8CFF", "blue", palette),
    },

    green: {
        backgroundColor: glassColor("backgroundColor", "#7BCFA6", "green", palette),
    },

    yellow: {
        backgroundColor: glassColor("backgroundColor", "#F2C94C", "yellow", palette),
    },

    addColorButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "addColorButton", palette),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: glassColor("borderColor", "#dddddd", "addColorButton", palette),
    },

    addColorText: {
        fontSize: 22,
        fontWeight: "400",
        color: glassColor("color", "#777777", "addColorText", palette),
        lineHeight: 24,
    },

    colorPopupWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 82,
        zIndex: 20,
    },

    colorPopup: {
        borderRadius: 22,
        overflow: "hidden",
        backgroundColor: glassColor("backgroundColor", "rgba(255,255,255,0.12)", "colorPopup", palette),
        borderWidth: 1,
        borderColor: glassColor("borderColor", "rgba(255,255,255,0.35)", "colorPopup", palette),
        paddingHorizontal: 20,
        paddingVertical: 18,
        shadowColor: glassColor("shadowColor", "#000000", "colorPopup", palette),
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },

    popupTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: glassColor("color", "#ffffff", "popupTitle", palette),
        marginBottom: 16,
    },

    popupColorRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
    },

    popupColor: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: glassColor("borderColor", "rgba(255,255,255,0.25)", "popupColor", palette),
    },

    selectedPopupColor: {
        borderWidth: 3,
        borderColor: glassColor("borderColor", "#ffffff", "selectedPopupColor", palette),
    },

    orange: {
        backgroundColor: glassColor("backgroundColor", "#e59a68", "orange", palette),
    },

    purple: {
        backgroundColor: glassColor("backgroundColor", "#a583d0", "purple", palette),
    },

    pink: {
        backgroundColor: glassColor("backgroundColor", "#e38eae", "pink", palette),
    },

    cyan: {
        backgroundColor: glassColor("backgroundColor", "#72c5cf", "cyan", palette),
    },

    brown: {
        backgroundColor: glassColor("backgroundColor", "#a77b61", "brown", palette),
    },

    gray: {
        backgroundColor: glassColor("backgroundColor", "#a7adb5", "gray", palette),
    },

    myColorsSection: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: glassColor("borderTopColor", "rgba(255,255,255,0.15)", "myColorsSection", palette),
    },

    myColorsTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: glassColor("color", "#ffffff", "myColorsTitle", palette),
        marginBottom: 12,
    },

    myColorsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
    },

    customColorItem: {
        position: "relative",
        width: 34,
        height: 34,
    },

    deleteColorButton: {
        position: "absolute",
        top: -7,
        right: -7,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "deleteColorButton", palette),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: glassColor("borderColor", "rgba(0,0,0,0.15)", "deleteColorButton", palette),
    },

    deleteColorText: {
        fontSize: 14,
        lineHeight: 16,
        fontWeight: "700",
        color: glassColor("color", "#555555", "deleteColorText", palette),
    },

    noColorsText: {
        fontSize: 12,
        color: glassColor("color", "rgba(255,255,255,0.55)", "noColorsText", palette),
    },

    createColorButton: {
        marginTop: 16,
        height: 40,
        borderRadius: 12,
        backgroundColor: glassColor("backgroundColor", "rgba(255,255,255,0.10)", "createColorButton", palette),
        borderWidth: 1,
        borderColor: glassColor("borderColor", "rgba(255,255,255,0.20)", "createColorButton", palette),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
    },

    createColorPlus: {
        fontSize: 20,
        color: glassColor("color", "#ffffff", "createColorPlus", palette),
        lineHeight: 22,
    },

    createColorText: {
        fontSize: 12,
        fontWeight: "600",
        color: glassColor("color", "#ffffff", "createColorText", palette),
    },

    closePopupButton: {
        alignSelf: "flex-end",
        marginTop: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: glassColor("backgroundColor", "rgba(255,255,255,0.10)", "closePopupButton", palette),
    },

    closePopupText: {
        fontSize: 12,
        color: glassColor("color", "rgba(255,255,255,0.85)", "closePopupText", palette),
    },

    customColorOverlay: {
        position: "absolute",
        top: -35,
        left: -24,
        right: -24,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
    },

    customColorModal: {
        ...glassDecoration("customColorModal", palette),
        width: "86%",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: glassColor("backgroundColor", "rgba(255,255,255,0.13)", "customColorModal", palette),
        borderWidth: 1,
        borderColor: glassColor("borderColor", "rgba(255,255,255,0.38)", "customColorModal", palette),
        shadowColor: glassColor("shadowColor", "#000000", "customColorModal", palette),
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.30,
        shadowRadius: 25,
        elevation: 12,
    },

    customColorTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: glassColor("color", "#FFFFFF", "customColorTitle", palette),
        marginBottom: 8,
    },

    customColorDescription: {
        fontSize: 13,
        lineHeight: 19,
        color: glassColor("color", "rgba(255,255,255,0.75)", "customColorDescription", palette),
        textAlign: "center",
        marginBottom: 20,
    },

    colorPicker: {
        width: "100%",
        gap: 16,
    },

    colorPickerPreview: {
        width: "100%",
        height: 55,
        borderRadius: 14,
        marginBottom: 4,
    },

    colorPanel: {
        ...glassDecoration("colorPanel", palette),
        width: "100%",
        height: 180,
        borderRadius: 16,
    },

    hueSlider: {
        width: "100%",
        height: 28,
        borderRadius: 14,
        marginBottom: 8,
    },

    saveCustomColorButton: {
        width: "100%",
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: glassColor("backgroundColor", "rgba(255,255,255,0.18)", "saveCustomColorButton", palette),
        borderWidth: 1,
        borderColor: glassColor("borderColor", "rgba(255,255,255,0.35)", "saveCustomColorButton", palette),
        marginBottom: 10,
    },

    saveCustomColorButtonText: {
        color: glassColor("color", "#FFFFFF", "saveCustomColorButtonText", palette),
        fontSize: 15,
        fontWeight: "700",
    },

    cancelCustomColorButton: {
        paddingVertical: 8,
    },

    cancelCustomColorButtonText: {
        color: glassColor("color", "rgba(255,255,255,0.70)", "cancelCustomColorButtonText", palette),
        fontSize: 14,
    },

    peopleCard: {
        ...glassDecoration("peopleCard", palette),
        backgroundColor: glassColor("backgroundColor", "#ffffff", "peopleCard", palette),
        borderRadius: 14,
        padding: 16,
    },

    peopleText: {
        fontSize: 14,
        color: glassColor("color", "#303030", "peopleText", palette),
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
        backgroundColor: glassColor("backgroundColor", "#eeeeee", "peopleButton", palette),
        alignItems: "center",
        justifyContent: "center",
    },

    peopleButtonText: {
        fontSize: 22,
        color: glassColor("color", "#303030", "peopleButtonText", palette),
    },

    peopleNumber: {
        fontSize: 20,
        fontWeight: "700",
        color: glassColor("color", "#303030", "peopleNumber", palette),
    },

    peopleLabel: {
        textAlign: "center",
        marginTop: 4,
        fontSize: 13,
        color: glassColor("color", "#888888", "peopleLabel", palette),
    },

    perPerson: {
        marginTop: 12,
        textAlign: "center",
        fontSize: 13,
        color: glassColor("color", "#888888", "perPerson", palette),
    },
});