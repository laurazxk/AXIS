
import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    StatusBar,
    TextInput,
    Alert,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { tripDraft } from "./tripDraft";

export default function ItineraryScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [selectedDay, setSelectedDay] = useState(1);
    const [activity, setActivity] = useState("");

    const [activities, setActivities] = useState<
        { id: number; day: number; title: string }[]
    >([]);

    const totalDays = Math.max(1, tripDraft.duration || 1);

    function addActivity() {
        if (!activity.trim()) {
            Alert.alert(
                "Adicione uma atividade",
                "Digite o nome da atividade antes de continuar."
            );
            return;
        }

        setActivities(current => [
            ...current,
            {
                id: Date.now(),
                day: selectedDay,
                title: activity.trim(),
            },
        ]);

        setActivity("");
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
                        Meu roteiro
                    </Text>

                    <View style={styles.headerSpace} />
                </View>

                <Text style={styles.title}>
                    {tripDraft.destination || "Sua viagem"}
                </Text>

                <Text style={styles.subtitle}>
                    {tripDraft.country}
                    {" · "}
                    {totalDays} {totalDays === 1 ? "dia" : "dias"}
                </Text>

                <Text style={styles.sectionTitle}>
                    Organize seus dias
                </Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysContainer}
                >
                    {Array.from({ length: totalDays }, (_, index) => {
                        const day = index + 1;
                        const active = day === selectedDay;

                        return (
                            <Pressable
                                key={day}
                                style={[
                                    styles.dayButton,
                                    active && styles.dayButtonActive,
                                ]}
                                onPress={() => setSelectedDay(day)}
                            >
                                <Text
                                    style={[
                                        styles.dayButtonText,
                                        active && styles.dayButtonTextActive,
                                    ]}
                                >
                                    Dia {day}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Atividades do dia {selectedDay}
                    </Text>

                    {activities.filter(
                        item => item.day === selectedDay
                    ).length === 0 ? (
                        <View style={styles.emptyState}>
                            <MaterialIcons
                                name="event-note"
                                size={32}
                                color="#a7a7a7"
                            />

                            <Text style={styles.emptyTitle}>
                                Nenhuma atividade ainda
                            </Text>

                            <Text style={styles.emptyDescription}>
                                Adicione os lugares e passeios que
                                deseja visitar neste dia.
                            </Text>
                        </View>
                    ) : (
                        activities
                            .filter(item => item.day === selectedDay)
                            .map(item => (
                                <View
                                    key={item.id}
                                    style={styles.activityRow}
                                >
                                    <MaterialIcons
                                        name="place"
                                        size={21}
                                        color="#8492a8"
                                    />

                                    <Text style={styles.activityTitle}>
                                        {item.title}
                                    </Text>
                                </View>
                            ))
                    )}

                    <TextInput
                        value={activity}
                        onChangeText={setActivity}
                        placeholder="Ex.: visitar a Torre Eiffel"
                        placeholderTextColor="#999999"
                        style={styles.input}
                        returnKeyType="done"
                        onSubmitEditing={addActivity}
                    />

                    <Pressable
                        style={styles.addButton}
                        onPress={addActivity}
                    >
                        <MaterialIcons
                            name="add"
                            size={20}
                            color="#ffffff"
                        />

                        <Text style={styles.addButtonText}>
                            Adicionar atividade
                        </Text>
                    </Pressable>
                </View>

                <Text style={styles.note}>
                    As atividades são temporárias e serão perdidas
                    ao reiniciar o aplicativo. A opção de salvar a
                    viagem será integrada posteriormente.
                </Text>
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

    title: {
        marginTop: 28,
        fontSize: 29,
        lineHeight: 35,
        fontWeight: "800",
        color: "#303030",
    },

    subtitle: {
        marginTop: 8,
        fontSize: 13,
        color: "#888888",
    },

    sectionTitle: {
        marginTop: 32,
        fontSize: 17,
        fontWeight: "700",
        color: "#8492a8",
    },

    daysContainer: {
        gap: 9,
        paddingVertical: 15,
    },

    dayButton: {
        paddingHorizontal: 18,
        height: 40,
        borderRadius: 22,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },

    dayButtonActive: {
        backgroundColor: "#303030",
    },

    dayButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666666",
    },

    dayButtonTextActive: {
        color: "#ffffff",
    },

    card: {
        marginTop: 12,
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        elevation: 3,
    },

    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#303030",
    },

    emptyState: {
        alignItems: "center",
        paddingVertical: 30,
    },

    emptyTitle: {
        marginTop: 12,
        fontSize: 13,
        fontWeight: "700",
        color: "#555555",
    },

    emptyDescription: {
        marginTop: 7,
        fontSize: 12,
        lineHeight: 18,
        textAlign: "center",
        color: "#999999",
    },

    activityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#eeeeee",
    },

    activityTitle: {
        flex: 1,
        fontSize: 13,
        color: "#444444",
    },

    input: {
        height: 52,
        borderRadius: 26,
        backgroundColor: "#f7f7f7",
        paddingHorizontal: 18,
        marginTop: 22,
        fontSize: 13,
        color: "#303030",
    },

    addButton: {
        height: 50,
        marginTop: 12,
        borderRadius: 25,
        backgroundColor: "#303030",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    addButtonText: {
        color: "#ffffff",
        fontSize: 13,
        fontWeight: "700",
    },

    note: {
        marginTop: 22,
        fontSize: 11,
        lineHeight: 17,
        color: "#999999",
        textAlign: "center",
    },
});