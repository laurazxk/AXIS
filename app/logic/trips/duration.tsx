import React, { useEffect, useMemo, useRef, useState } from "react";

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

const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function dateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function displayDate(value: string) {
    if (!value) return "";

    const [year, month, day] = value.split("-");

    return `${day}/${month}/${year}`;
}

export default function DurationScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const wheelRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (mode === "duration") {
            wheelRef.current?.scrollTo({
                y: (days - 1) * 56,
                animated: false,
            });
        }
    }, []);

    const [mode, setMode] = useState<"duration" | "dates">(
        tripDraft.dateMode
    );

    const [days, setDays] = useState(tripDraft.duration || 3);

    const [monthDate, setMonthDate] = useState(() => {
        if (tripDraft.startDate) {
            const [year, month] = tripDraft.startDate
                .split("-")
                .map(Number);

            return new Date(year, month - 1, 1);
        }

        return new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );
    });

    const [startDate, setStartDate] = useState(tripDraft.startDate);
    const [endDate, setEndDate] = useState(tripDraft.endDate);

    const monthTitle = monthDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    });

    const calendarDays = useMemo(() => {
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();

        const firstWeekday =
            (new Date(year, month, 1).getDay() + 6) % 7;

        const daysInMonth = new Date(
            year,
            month + 1,
            0
        ).getDate();

        return [
            ...Array(firstWeekday).fill(null),
            ...Array.from(
                { length: daysInMonth },
                (_, index) => index + 1
            ),
        ];
    }, [monthDate]);

    function chooseDate(day: number) {
        const date = new Date(
            monthDate.getFullYear(),
            monthDate.getMonth(),
            day
        );

        const value = dateKey(date);

        if (!startDate || endDate || value < startDate) {
            setStartDate(value);
            setEndDate("");
            return;
        }

        setEndDate(value);
    }

    function changeMonth(amount: number) {
        setMonthDate(current =>
            new Date(
                current.getFullYear(),
                current.getMonth() + amount,
                1
            )
        );
    }

    function continueToPreferences() {
        if (mode === "dates" && (!startDate || !endDate)) {
            return;
        }

        tripDraft.dateMode = mode;

        if (mode === "duration") {
            tripDraft.duration = days;
            tripDraft.startDate = "";
            tripDraft.endDate = "";
        } else {
            tripDraft.startDate = startDate;
            tripDraft.endDate = endDate;

            const start = new Date(`${startDate}T12:00:00`);
            const end = new Date(`${endDate}T12:00:00`);

            tripDraft.duration =
                Math.round(
                    (end.getTime() - start.getTime()) / 86400000
                ) + 1;
        }

        router.push("/logic/trips/preferences");
    }

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
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
                            color="#303030"
                        />
                    </Pressable>

                    <Text style={styles.headerTitle}>
                        Duração da viagem
                    </Text>

                    <View style={styles.headerSpace} />
                </View>

                <Text style={styles.step}>ETAPA 2 DE 4</Text>

                <Text style={styles.title}>
                    Quando você{"\n"}pretende viajar?
                </Text>

                <Text style={styles.subtitle}>
                    Escolha por quantos dias ou defina as datas da sua viagem.
                </Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Quando?</Text>

                    <View style={styles.modeSwitch}>
                        <Pressable
                            style={[
                                styles.modeButton,
                                mode === "duration" &&
                                    styles.modeActive,
                            ]}
                            onPress={() => setMode("duration")}
                        >
                            <Text
                                style={[
                                    styles.modeText,
                                    mode === "duration" &&
                                        styles.modeTextActive,
                                ]}
                            >
                                Indefinido
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.modeButton,
                                mode === "dates" &&
                                    styles.modeActive,
                            ]}
                            onPress={() => setMode("dates")}
                        >
                            <Text
                                style={[
                                    styles.modeText,
                                    mode === "dates" &&
                                        styles.modeTextActive,
                                ]}
                            >
                                Data específica
                            </Text>
                        </Pressable>
                    </View>

                    {mode === "duration" ? (
                        <View style={styles.durationSection}>
                            <View style={styles.sectionLabel}>
                                <MaterialIcons
                                    name="calendar-today"
                                    size={14}
                                    color="#999999"
                                />

                                <Text
                                    style={styles.sectionLabelText}
                                >
                                    Quantidade de dias
                                </Text>
                            </View>

                            <View style={styles.wheel}>
                                <ScrollView
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator={false}
                                    snapToInterval={56}
                                    decelerationRate="fast"
                                    contentContainerStyle={
                                        styles.wheelContent
                                    }
                                    onMomentumScrollEnd={event => {
                                        const index =
                                            Math.round(
                                                event.nativeEvent
                                                    .contentOffset.y / 56
                                            );

                                        setDays(
                                            Math.max(
                                                1,
                                                Math.min(
                                                    60,
                                                    index + 1
                                                )
                                            )
                                        );
                                    }}
                                    onScrollEndDrag={event => {
                                        const index =
                                            Math.round(
                                                event.nativeEvent
                                                    .contentOffset.y / 56
                                            );

                                        setDays(
                                            Math.max(
                                                1,
                                                Math.min(
                                                    60,
                                                    index + 1
                                                )
                                            )
                                        );
                                    }}
                                    ref={ref => {
                                        if (ref && days > 1) {
                                            ref.scrollTo({
                                                y:
                                                    (days - 1) *
                                                    56,
                                                animated: false,
                                            });
                                        }
                                    }}
                                >
                                    {Array.from(
                                        { length: 60 },
                                        (_, index) => {
                                            const day = index + 1;

                                            return (
                                                <Pressable
                                                    key={day}
                                                    style={
                                                        styles.wheelItem
                                                    }
                                                    onPress={() => {
                                                        setDays(day);

                                                        wheelRef.current?.scrollTo(
                                                            {
                                                                y:
                                                                    (day -
                                                                        1) *
                                                                    56,
                                                                animated: true,
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.wheelNumber,
                                                            day ===
                                                                days &&
                                                                styles.wheelNumberActive,
                                                        ]}
                                                    >
                                                        {day}
                                                    </Text>
                                                </Pressable>
                                            );
                                        }
                                    )}
                                </ScrollView>

                                <View
                                    pointerEvents="none"
                                    style={
                                        styles.wheelHighlight
                                    }
                                />
                            </View>

                            <Text
                                style={styles.durationHint}
                            >
                                {days}{" "}
                                {days === 1
                                    ? "dia"
                                    : "dias"}{" "}
                                de viagem
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.calendarSection}>
                            <Text
                                style={
                                    styles.calendarInstruction
                                }
                            >
                                Selecione a ida e a volta
                            </Text>

                            <View style={styles.monthHeader}>
                                <Pressable
                                    onPress={() =>
                                        changeMonth(-1)
                                    }
                                >
                                    <MaterialIcons
                                        name="chevron-left"
                                        size={24}
                                        color="#8492a8"
                                    />
                                </Pressable>

                                <Text
                                    style={styles.monthTitle}
                                >
                                    {monthTitle
                                        .charAt(0)
                                        .toUpperCase() +
                                        monthTitle.slice(1)}
                                </Text>

                                <Pressable
                                    onPress={() =>
                                        changeMonth(1)
                                    }
                                >
                                    <MaterialIcons
                                        name="chevron-right"
                                        size={24}
                                        color="#8492a8"
                                    />
                                </Pressable>
                            </View>

                            <View style={styles.calendarGrid}>
                                {weekdays.map(day => (
                                    <Text
                                        key={day}
                                        style={styles.weekday}
                                    >
                                        {day}
                                    </Text>
                                ))}

                                {calendarDays.map(
                                    (day, index) => {
                                        if (!day) {
                                            return (
                                                <View
                                                    key={`empty-${index}`}
                                                    style={
                                                        styles.dayCell
                                                    }
                                                />
                                            );
                                        }

                                        const value =
                                            dateKey(
                                                new Date(
                                                    monthDate.getFullYear(),
                                                    monthDate.getMonth(),
                                                    day
                                                )
                                            );

                                        const isStart =
                                            value === startDate;

                                        const isEnd =
                                            value === endDate;

                                        const isInRange =
                                            !!startDate &&
                                            !!endDate &&
                                            value >= startDate &&
                                            value <= endDate;

                                        const today =
                                            dateKey(
                                                new Date()
                                            );

                                        const isPast =
                                            value < today;

                                        const previousDay =
                                            new Date(
                                                monthDate.getFullYear(),
                                                monthDate.getMonth(),
                                                day - 1
                                            );

                                        const nextDay =
                                            new Date(
                                                monthDate.getFullYear(),
                                                monthDate.getMonth(),
                                                day + 1
                                            );

                                        const previousValue =
                                            dateKey(
                                                previousDay
                                            );

                                        const nextValue =
                                            dateKey(nextDay);

                                        const previousInRange =
                                            !!startDate &&
                                            !!endDate &&
                                            previousValue >=
                                                startDate &&
                                            previousValue <=
                                                endDate;

                                        const nextInRange =
                                            !!startDate &&
                                            !!endDate &&
                                            nextValue >=
                                                startDate &&
                                            nextValue <=
                                                endDate;

                                        const showRange =
                                            isInRange;

                                        return (
                                            <Pressable
                                                key={value}
                                                disabled={isPast}
                                                style={
                                                    styles.dayCell
                                                }
                                                onPress={() =>
                                                    chooseDate(
                                                        day
                                                    )
                                                }
                                            >
                                                {showRange && (
                                                    <View
                                                        pointerEvents="none"
                                                        style={[
                                                            styles.rangeBackground,

                                                            isStart && {
                                                                left:
                                                                    "50%",
                                                                right: 0,
                                                                borderTopLeftRadius: 0,
                                                                borderBottomLeftRadius: 0,
                                                            },

                                                            isEnd && {
                                                                left: 0,
                                                                right:
                                                                    "50%",
                                                                borderTopRightRadius: 0,
                                                                borderBottomRightRadius: 0,
                                                            },

                                                            !isStart &&
                                                                !isEnd && {
                                                                    left: 0,
                                                                    right: 0,
                                                                    borderRadius: 0,
                                                                },

                                                            isStart &&
                                                                !previousInRange && {
                                                                    borderTopLeftRadius: 20,
                                                                    borderBottomLeftRadius: 20,
                                                                },

                                                            isEnd &&
                                                                !nextInRange && {
                                                                    borderTopRightRadius: 20,
                                                                    borderBottomRightRadius: 20,
                                                                },
                                                        ]}
                                                    />
                                                )}

                                                {(isStart ||
                                                    isEnd) && (
                                                    <View
                                                        pointerEvents="none"
                                                        style={
                                                            styles.selectedDayCircle
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.dayTextSelected
                                                            }
                                                        >
                                                            {day}
                                                        </Text>
                                                    </View>
                                                )}

                                                {!isStart &&
                                                    !isEnd && (
                                                        <Text
                                                            style={[
                                                                styles.dayText,
                                                                isPast &&
                                                                    styles.dayPast,
                                                            ]}
                                                        >
                                                            {day}
                                                        </Text>
                                                    )}
                                            </Pressable>
                                        );
                                    }
                                )}
                            </View>

                            <View
                                style={styles.dateSummary}
                            >
                                <Text
                                    style={
                                        styles.dateSummaryText
                                    }
                                >
                                    Ida:{" "}
                                    {displayDate(
                                        startDate
                                    ) || "—"}
                                </Text>

                                <Text
                                    style={
                                        styles.dateSummaryText
                                    }
                                >
                                    Volta:{" "}
                                    {displayDate(
                                        endDate
                                    ) || "—"}
                                </Text>
                            </View>

                            {startDate && !endDate && (
                                <Text
                                    style={
                                        styles.calendarHint
                                    }
                                >
                                    Agora selecione a data de volta.
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                <Pressable
                    style={[
                        styles.button,
                        mode === "dates" &&
                            (!startDate || !endDate) &&
                            styles.buttonDisabled,
                    ]}
                    disabled={
                        mode === "dates" &&
                        (!startDate || !endDate)
                    }
                    onPress={continueToPreferences}
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

    card: {
        marginTop: 28,
        padding: 18,
        borderRadius: 22,
        backgroundColor: "#ffffff",
        elevation: 3,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 7,
    },

    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#444444",
    },

    modeSwitch: {
        marginTop: 14,
        height: 42,
        borderRadius: 13,
        padding: 4,
        backgroundColor: "#f0f0f0",
        flexDirection: "row",
    },

    modeButton: {
        flex: 1,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    modeActive: {
        backgroundColor: "#ffffff",
        elevation: 2,
    },

    modeText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#999999",
    },

    modeTextActive: {
        color: "#303030",
    },

    durationSection: {
        alignItems: "center",
        marginTop: 24,
    },

    sectionLabel: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    sectionLabelText: {
        fontSize: 11,
        color: "#999999",
    },

    wheel: {
        height: 224,
        width: "100%",
        marginTop: 12,
    },

    wheelContent: {
        alignItems: "center",
        paddingVertical: 84,
    },

    wheelItem: {
        height: 56,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    wheelNumber: {
        fontSize: 30,
        color: "#444444",
    },

    wheelNumberActive: {
        fontSize: 43,
        fontWeight: "500",
        color: "#303030",
    },

    wheelHighlight: {
        position: "absolute",
        top: 84,
        left: 0,
        right: 0,
        height: 56,
        borderRadius: 9,
        backgroundColor: "#eeeeee",
        zIndex: -1,
    },

    durationHint: {
        marginTop: 6,
        fontSize: 12,
        color: "#8492a8",
        fontWeight: "600",
    },

    calendarSection: {
        marginTop: 20,
    },

    calendarInstruction: {
        fontSize: 11,
        color: "#888888",
        marginBottom: 12,
    },

    monthHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    monthTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: "#303030",
    },

    calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    weekday: {
        width: `${100 / 7}%`,
        textAlign: "center",
        color: "#999999",
        fontSize: 10,
        paddingVertical: 8,
    },

    dayCell: {
        width: `${100 / 7}%`,
        height: 38,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    dayText: {
        fontSize: 11,
        color: "#303030",
    },

    dayPast: {
        color: "#cccccc",
    },

    rangeBackground: {
        position: "absolute",
        top: 9,
        bottom: 9,
        backgroundColor: "#e9e9e9",
    },

    selectedDayCircle: {
        width: 27,
        height: 27,
        borderRadius: 14,
        backgroundColor: "#4a4a4a",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
    },

    dayTextSelected: {
        color: "#ffffff",
        fontSize: 11,
        fontWeight: "700",
    },

    dateSummary: {
        marginTop: 15,
        gap: 7,
    },

    dateSummaryText: {
        fontSize: 12,
        color: "#666666",
    },

    calendarHint: {
        fontSize: 11,
        color: "#8492a8",
        marginTop: 10,
    },

    button: {
        height: 56,
        marginTop: 32,
        borderRadius: 28,
        backgroundColor: "#303030",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    buttonDisabled: {
        opacity: 0.4,
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },
});