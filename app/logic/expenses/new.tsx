import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
    Modal,
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

import GlassBackdrop from "../../../components/GlassBackdrop";
import GlassFrost from "../../../components/GlassFrost";
import { useAxisTheme } from "../../../contexts/ThemeContext";

import {
    glassColor,
    glassDecoration,
    type GlassPalette,
} from "../../../constants/glass";

import {
    addTripExpense,
    savedTrips,
} from "../../../stores/tripStore";

function ColorCheck() {
    return (
        <View style={stylesCheck.container}>
            <MaterialIcons
                name="check"
                size={19}
                color="#FFFFFF"
            />
        </View>
    );
}

const stylesCheck = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default function NewExpenseScreen() {
    const { palette: axisPalette, mode } = useAxisTheme();

    const styles = React.useMemo(
        () => createStyles(axisPalette, mode === "dark"),
        [axisPalette, mode]
    );

    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const trip = savedTrips.find((item) => item.id === id);

    const localCurrency = (
        trip?.localCurrency || "BRL"
    ).toUpperCase();

    const [value, setValue] = useState(0);
    const [people, setPeople] = useState(1);
    const [selectedColor, setSelectedColor] = useState("red");
    const [name, setName] = useState("");
    const [currency, setCurrency] = useState("BRL");

    const [exchangeRate, setExchangeRate] = useState<number | null>(1);
    const [rateLoading, setRateLoading] = useState(false);
    const [rateError, setRateError] = useState("");

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [customColors, setCustomColors] = useState<string[]>([]);
    const [showCustomColorPicker, setShowCustomColorPicker] =
        useState(false);
    const [customColor, setCustomColor] = useState("#8B5CF6");

    useEffect(() => {
        let isActive = true;

        async function fetchExchangeRate() {
            if (currency === "BRL") {
                setExchangeRate(1);
                setRateError("");
                setRateLoading(false);
                return;
            }

            setRateLoading(true);
            setRateError("");
            setExchangeRate(null);

            try {
                const response = await fetch(
                    `https://api.frankfurter.dev/v2/rate/${currency}/BRL`
                );

                if (!response.ok) {
                    throw new Error("Não foi possível consultar a cotação.");
                }

                const data = await response.json();
                const rate = Number(data.rate);

                if (!Number.isFinite(rate) || rate <= 0) {
                    throw new Error("Cotação inválida.");
                }

                if (isActive) {
                    setExchangeRate(rate);
                }
            } catch {
                if (isActive) {
                    setExchangeRate(null);
                    setRateError(
                        "Não foi possível obter a cotação. Tente novamente."
                    );
                }
            } finally {
                if (isActive) {
                    setRateLoading(false);
                }
            }
        }

        fetchExchangeRate();

        return () => {
            isActive = false;
        };
    }, [currency]);

    function handleValueChange(text: string) {
        const number = Number(text.replace(",", "."));

        if (isNaN(number)) {
            setValue(0);
            return;
        }

        setValue(number);
    }

    function handleAddExpense() {
        if (!trip || !name.trim() || value <= 0) {
            return;
        }

        if (rateLoading || exchangeRate === null) {
            return;
        }

        const valueBRL = value * exchangeRate;

        const expense = {
            id: Date.now().toString(),
            name: name.trim(),
            value,
            currency,
            exchangeRate,
            valueBRL,
            color: selectedColor,
            people,
            perPerson: value / people,
            perPersonBRL: valueBRL / people,
        };

        addTripExpense(trip.id, expense);
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

                <Pressable
                    onPress={handleAddExpense}
                    disabled={rateLoading || exchangeRate === null}
                >
                    <Text
                        style={[
                            styles.addText,
                            (rateLoading || exchangeRate === null) &&
                                styles.disabledAddText,
                        ]}
                    >
                        Adicionar
                    </Text>
                </Pressable>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Valor</Text>

                <View style={styles.valueRow}>
                    <TextInput
                        style={styles.valueInput}
                        placeholder="0,00"
                        keyboardType="numeric"
                        placeholderTextColor={axisPalette.muted}
                        value={value === 0 ? "" : String(value)}
                        onChangeText={handleValueChange}
                    />

                    <View style={styles.currencyRow}>
                        <Pressable
                            onPress={() => setCurrency("BRL")}
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

                        {localCurrency !== "BRL" && (
                            <Pressable
                                onPress={() => setCurrency(localCurrency)}
                                style={[
                                    styles.currencyButton,
                                    currency === localCurrency &&
                                        styles.selectedCurrency,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.currencyText,
                                        currency === localCurrency &&
                                            styles.selectedCurrencyText,
                                    ]}
                                >
                                    {localCurrency}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                {rateLoading && (
                    <Text style={styles.perPerson}>
                        Consultando cotação...
                    </Text>
                )}

                {!!rateError && (
                    <Text style={styles.rateError}>
                        {rateError}
                    </Text>
                )}

                <Text style={styles.label}>Nome</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ex: Compras"
                    placeholderTextColor={axisPalette.muted}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Cor</Text>

                <View style={styles.colorRow}>
                    {[
                        { id: "red", style: styles.red },
                        { id: "blue", style: styles.blue },
                        { id: "green", style: styles.green },
                        { id: "yellow", style: styles.yellow },
                    ].map((item) => (
                        <Pressable
                            key={item.id}
                            onPress={() => setSelectedColor(item.id)}
                            style={[
                                styles.color,
                                item.style,
                                selectedColor === item.id &&
                                    styles.selectedColor,
                            ]}
                        >
                            {selectedColor === item.id && <ColorCheck />}
                        </Pressable>
                    ))}

                    <Pressable
                        onPress={() =>
                            setShowColorPicker(!showColorPicker)
                        }
                        style={styles.addColorButton}
                    >
                        <Text style={styles.addColorText}>+</Text>
                    </Pressable>
                </View>

                <Modal
                    visible={showColorPicker}
                    transparent
                    animationType="fade"
                    statusBarTranslucent
                    onRequestClose={() => setShowColorPicker(false)}
                >
                    <View style={styles.colorPopupWrapper}>
                        <View style={styles.colorPopup}>
                            <Text style={styles.popupTitle}>
                                Escolha uma cor
                            </Text>

                            <View style={styles.popupColorRow}>
                                {[
                                    { id: "#E59A68", style: styles.orange },
                                    { id: "#A583D0", style: styles.purple },
                                    { id: "#E38EAE", style: styles.pink },
                                    { id: "#71C5CF", style: styles.cyan },
                                    { id: "#A77B61", style: styles.brown },
                                    { id: "#A7ADB5", style: styles.gray },
                                ].map((item) => {
                                    const isSelected =
                                        selectedColor.toLowerCase() ===
                                        item.id.toLowerCase();

                                    return (
                                        <Pressable
                                            key={item.id}
                                            onPress={() => {
                                                setSelectedColor(
                                                    item.id.toLowerCase()
                                                );
                                                setShowColorPicker(false);
                                            }}
                                            style={[
                                                styles.popupColor,
                                                item.style,
                                                isSelected &&
                                                    styles.selectedPopupColor,
                                            ]}
                                        >
                                            {isSelected && <ColorCheck />}
                                        </Pressable>
                                    );
                                })}
                            </View>

                            <View style={styles.myColorsSection}>
                                <Text style={styles.myColorsTitle}>
                                    Minhas cores
                                </Text>

                                <View style={styles.myColorsRow}>
                                    {customColors.length === 0 ? (
                                        <Text style={styles.noColorsText}>
                                            Você ainda não criou nenhuma cor.
                                        </Text>
                                    ) : (
                                        customColors.map((color) => {
                                            const isSelected =
                                                selectedColor.toLowerCase() ===
                                                color.toLowerCase();

                                            return (
                                                <View
                                                    key={color}
                                                    style={styles.customColorItem}
                                                >
                                                    <Pressable
                                                        onPress={() => {
                                                            setSelectedColor(color);
                                                            setShowColorPicker(false);
                                                        }}
                                                        style={[
                                                            styles.popupColor,
                                                            {
                                                                backgroundColor: color,
                                                            },
                                                            isSelected &&
                                                                styles.selectedPopupColor,
                                                        ]}
                                                    >
                                                        {isSelected && (
                                                            <ColorCheck />
                                                        )}
                                                    </Pressable>

                                                    <Pressable
                                                        onPress={() => {
                                                            setCustomColors(
                                                                (current) =>
                                                                    current.filter(
                                                                        (item) =>
                                                                            item !== color
                                                                    )
                                                            );

                                                            if (
                                                                selectedColor.toLowerCase() ===
                                                                color.toLowerCase()
                                                            ) {
                                                                setSelectedColor("red");
                                                            }
                                                        }}
                                                        style={styles.deleteColorButton}
                                                    >
                                                        <Text
                                                            style={styles.deleteColorText}
                                                        >
                                                            ×
                                                        </Text>
                                                    </Pressable>
                                                </View>
                                            );
                                        })
                                    )}
                                </View>

                                <Pressable
                                    onPress={() => {
                                        setShowColorPicker(false);
                                        setShowCustomColorPicker(true);
                                    }}
                                    style={styles.createColorButton}
                                >
                                    <Text style={styles.createColorPlus}>+</Text>
                                    <Text style={styles.createColorText}>
                                        Criar nova cor
                                    </Text>
                                </Pressable>
                            </View>

                            <Pressable
                                onPress={() => setShowColorPicker(false)}
                                style={styles.closePopupButton}
                            >
                                <Text style={styles.closePopupText}>
                                    Fechar
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={showCustomColorPicker}
                    transparent
                    animationType="fade"
                    statusBarTranslucent
                    onRequestClose={() => setShowCustomColorPicker(false)}
                >
                    <View style={styles.customColorOverlay}>
                        <View style={styles.customColorModal}>
                            <Text style={styles.customColorTitle}>
                                Criar nova cor
                            </Text>

                            <Text style={styles.customColorDescription}>
                                Escolha visualmente a cor que deseja usar.
                            </Text>

                            <ColorPicker
                                value={customColor}
                                onCompleteJS={({ hex }) => {
                                    setCustomColor(hex);
                                }}
                                style={styles.colorPicker}
                            >
                                <Preview
                                    style={styles.colorPickerPreview}
                                />

                                <Panel1 style={styles.colorPanel} />

                                <HueSlider style={styles.hueSlider} />
                            </ColorPicker>

                            <Pressable
                                style={styles.saveCustomColorButton}
                                onPress={handleSaveCustomColor}
                            >
                                <Text
                                    style={styles.saveCustomColorButtonText}
                                >
                                    Salvar cor
                                </Text>
                            </Pressable>

                            <Pressable
                                style={styles.cancelCustomColorButton}
                                onPress={() =>
                                    setShowCustomColorPicker(false)
                                }
                            >
                                <Text
                                    style={styles.cancelCustomColorButtonText}
                                >
                                    Cancelar
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <Text style={styles.label}>Divisão</Text>

                <View style={styles.peopleCard}>
                    <GlassFrost />

                    <Text style={styles.peopleText}>
                        Dividir entre
                    </Text>

                    <View style={styles.peopleSelector}>
                        <Pressable
                            onPress={() =>
                                setPeople(Math.max(1, people - 1))
                            }
                            style={styles.peopleButton}
                        >
                            <Text style={styles.peopleButtonText}>−</Text>
                        </Pressable>

                        <Text style={styles.peopleNumber}>
                            {people}
                        </Text>

                        <Pressable
                            onPress={() => setPeople(people + 1)}
                            style={styles.peopleButton}
                        >
                            <Text style={styles.peopleButtonText}>+</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.peopleLabel}>pessoas</Text>

                    <Text style={styles.perPerson}>
                        {rateLoading
                            ? "Calculando divisão..."
                            : exchangeRate !== null
                                ? `BRL ${((value * exchangeRate) / people)
                                    .toFixed(2)
                                    .replace(".", ",")} por pessoa`
                                : "Cotação indisponível"}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const createStyles = (palette: GlassPalette, darkMode: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: glassColor(
                "backgroundColor",
                "#f7f7f7",
                "container",
                palette
            ),
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

        disabledAddText: {
            opacity: 0.4,
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
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "valueInput",
                palette
            ),
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
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "currencyButton",
                palette
            ),
            alignItems: "center",
            justifyContent: "center",
        },

        selectedCurrency: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#303030",
                "selectedCurrency",
                palette
            ),
        },

        currencyText: {
            fontSize: 12,
            fontWeight: "600",
            color: glassColor(
                "color",
                "#777777",
                "currencyText",
                palette
            ),
        },

        selectedCurrencyText: {
            color: glassColor(
                "color",
                "#ffffff",
                "selectedCurrencyText",
                palette
            ),
        },

        rateError: {
            marginTop: 8,
            fontSize: 12,
            color: glassColor("color", "#D9534F", "rateError", palette),
        },

        input: {
            height: 52,
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "input",
                palette
            ),
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
            alignItems: "center",
            justifyContent: "center",
        },

        selectedColor: {
            borderWidth: 2,
            borderColor: "rgba(35, 35, 35, 0.85)",
            transform: [{ scale: 1.12 }],
            elevation: 5,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },

        red: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#E57373",
                "red",
                palette
            ),
        },

        blue: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#6C8CFF",
                "blue",
                palette
            ),
        },

        green: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#7BCFA6",
                "green",
                palette
            ),
        },

        yellow: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#F2C94C",
                "yellow",
                palette
            ),
        },

        addColorButton: {
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "addColorButton",
                palette
            ),
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: glassColor(
                "borderColor",
                "#dddddd",
                "addColorButton",
                palette
            ),
        },

        addColorText: {
            fontSize: 22,
            fontWeight: "400",
            color: glassColor(
                "color",
                "#777777",
                "addColorText",
                palette
            ),
            lineHeight: 24,
        },

        colorPopupWrapper: {
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 30,
            backgroundColor: "rgba(0,0,0,0.45)",
        },

        colorPopup: {
            width: "100%",
            maxWidth: 420,
            alignSelf: "center",
            borderRadius: 22,
            overflow: "hidden",
            backgroundColor: darkMode ? "rgba(30,30,30,0.98)" : "rgba(248,248,248,0.98)",
            borderWidth: 1,
            borderColor: darkMode ? "#505050" : "#D5D5D5",
            paddingHorizontal: 20,
            paddingVertical: 18,
            shadowColor: glassColor(
                "shadowColor",
                "#000000",
                "colorPopup",
                palette
            ),
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
        },

        popupTitle: {
            fontSize: 15,
            fontWeight: "600",
            color: palette.text,
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
            borderColor: glassColor(
                "borderColor",
                "rgba(255,255,255,0.25)",
                "popupColor",
                palette
            ),
            alignItems: "center",
            justifyContent: "center",
        },

        selectedPopupColor: {
            borderWidth: 2,
            borderColor: "rgba(25, 25, 25, 0.9)",
            transform: [{ scale: 1.12 }],
            elevation: 5,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
        },

        orange: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#e59a68",
                "orange",
                palette
            ),
        },

        purple: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#a583d0",
                "purple",
                palette
            ),
        },

        pink: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#e38eae",
                "pink",
                palette
            ),
        },

        cyan: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#72c5cf",
                "cyan",
                palette
            ),
        },

        brown: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#a77b61",
                "brown",
                palette
            ),
        },

        gray: {
            backgroundColor: glassColor(
                "backgroundColor",
                "#a7adb5",
                "gray",
                palette
            ),
        },

        myColorsSection: {
            marginTop: 20,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: palette.divider,
        },

        myColorsTitle: {
            fontSize: 14,
            fontWeight: "600",
            color: palette.text,
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
            backgroundColor: darkMode ? "#EDEDED" : "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: glassColor(
                "borderColor",
                "rgba(0,0,0,0.15)",
                "deleteColorButton",
                palette
            ),
        },

        deleteColorText: {
            fontSize: 14,
            lineHeight: 16,
            fontWeight: "700",
            color: "#171717",
        },

        noColorsText: {
            fontSize: 12,
            color: palette.muted,
        },

        createColorButton: {
            marginTop: 16,
            height: 40,
            borderRadius: 12,
            backgroundColor: darkMode ? "#F4F4F4" : "#171717",
            borderWidth: 1,
            borderColor: darkMode ? "#F4F4F4" : "#171717",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
        },

        createColorPlus: {
            fontSize: 20,
            color: darkMode ? "#171717" : "#FFFFFF",
            lineHeight: 22,
        },

        createColorText: {
            fontSize: 12,
            fontWeight: "600",
            color: darkMode ? "#171717" : "#FFFFFF",
        },

        closePopupButton: {
            alignSelf: "flex-end",
            marginTop: 16,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 10,
            backgroundColor: darkMode ? "#3B3B3B" : "#E8E8E8",
        },

        closePopupText: {
            fontSize: 12,
            color: darkMode ? "#FFFFFF" : "#171717",
        },

        customColorOverlay: {
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 24,
            backgroundColor: "rgba(0,0,0,0.55)",
        },

        customColorModal: {
            ...glassDecoration("customColorModal", palette),
            width: "100%",
            maxWidth: 420,
            maxHeight: "95%",
            alignSelf: "center",
            borderRadius: 24,
            padding: 24,
            alignItems: "center",
            overflow: "hidden",
            backgroundColor: darkMode ? "rgba(30,30,30,0.98)" : "rgba(248,248,248,0.98)",
            borderWidth: 1,
            borderColor: darkMode ? "#505050" : "#D5D5D5",
            shadowColor: glassColor(
                "shadowColor",
                "#000000",
                "customColorModal",
                palette
            ),
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.30,
            shadowRadius: 25,
            elevation: 12,
        },

        customColorTitle: {
            fontSize: 22,
            fontWeight: "800",
            color: palette.text,
            marginBottom: 8,
        },

        customColorDescription: {
            fontSize: 13,
            lineHeight: 19,
            color: palette.muted,
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
            backgroundColor: darkMode ? "#F4F4F4" : "#171717",
            borderWidth: 1,
            borderColor: darkMode ? "#F4F4F4" : "#171717",
            marginBottom: 10,
        },

        saveCustomColorButtonText: {
            color: darkMode ? "#171717" : "#FFFFFF",
            fontSize: 15,
            fontWeight: "700",
        },

        cancelCustomColorButton: {
            paddingVertical: 8,
        },

        cancelCustomColorButtonText: {
            color: palette.muted,
            fontSize: 14,
        },

        peopleCard: {
            ...glassDecoration("peopleCard", palette),
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "peopleCard",
                palette
            ),
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
            backgroundColor: glassColor(
                "backgroundColor",
                "#eeeeee",
                "peopleButton",
                palette
            ),
            alignItems: "center",
            justifyContent: "center",
        },

        peopleButtonText: {
            fontSize: 22,
            color: glassColor(
                "color",
                "#303030",
                "peopleButtonText",
                palette
            ),
        },

        peopleNumber: {
            fontSize: 20,
            fontWeight: "700",
            color: glassColor(
                "color",
                "#303030",
                "peopleNumber",
                palette
            ),
        },

        peopleLabel: {
            textAlign: "center",
            marginTop: 4,
            fontSize: 13,
            color: glassColor(
                "color",
                "#888888",
                "peopleLabel",
                palette
            ),
        },

        perPerson: {
            marginTop: 12,
            textAlign: "center",
            fontSize: 13,
            color: glassColor(
                "color",
                "#888888",
                "perPerson",
                palette
            ),
        },
    });