import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import GlassBackdrop from "../../../components/GlassBackdrop";
import TripInvitationModal from "../../../components/TripInvitationModal";
import { glassColor, glassDecoration, type GlassPalette } from "../../../constants/glass";
import { useAxisTheme } from "../../../contexts/ThemeContext";
import { useAxisAuth } from "../../../contexts/AuthContext";
import type { TripInvitation } from "../../../utils/tripInvitation";

import {
    FlatList,
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  tripDraft,
  resetTripDraft,
} from "../../../stores/tripDraft";
import {
  createTripInFirestore,
  addActivitiesToExistingTrip,
  getTripActivities,
    getTripDuration,
  deleteActivityFromFirestore,
} from "../../../stores/tripFirestore";

type Activity = {
    id: string | number;
    day: number;
    time: string;
    title: string;
    completed: boolean;
};

const HOURS = Array.from(
    { length: 24 },
    (_, index) => index
);

const MINUTES = Array.from(
    { length: 60 },
    (_, index) => index
);

const ITEM_HEIGHT = 44;

export default function ItineraryScreen() {
    
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette, axisDarkMode), [axisPalette, axisDarkMode]);

    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ tripId?: string | string[] }>();

const tripId = Array.isArray(params.tripId)
    ? params.tripId[0]
    : params.tripId;

    const { user } = useAxisAuth();

    const [savingTrip, setSavingTrip] = useState(false);

    const [selectedDay, setSelectedDay] = useState(1);

    const [activities, setActivities] = useState<Activity[]>([]);
    const [savedTripDuration, setSavedTripDuration] =
    useState<number | null>(null);

    const [timeModalVisible, setTimeModalVisible] =
        useState(false);

    const [selectedActivityId, setSelectedActivityId] =
    useState<string | number | null>(null);

    const [pickerHour, setPickerHour] = useState(9);
    const [pickerMinute, setPickerMinute] = useState(0);

    const [invitationVisible, setInvitationVisible] = useState(false);
    const [createdInvitation, setCreatedInvitation] =
        useState<TripInvitation | null>(null);
    const [tripFinished, setTripFinished] = useState(false);

   useEffect(() => {
     

    if (!tripId) {
       
        return;
    }

    const currentTripId: string = tripId;
    let active = true;

    async function loadTripData() {
        try {
            const [savedActivities, savedDuration] =
                await Promise.all([
                    getTripActivities(currentTripId),
                    getTripDuration(currentTripId),
                ]);
                

            if (active) {
                setActivities(savedActivities);
                setSavedTripDuration(savedDuration);
            }
        } catch (error) {
            console.error("Erro ao carregar dados da viagem:", error);

            Alert.alert(
                "Erro",
                "Não foi possível carregar os dados da viagem."
            );
        }
    }

    loadTripData();

    return () => {
        active = false;
    };
}, [tripId]);
    async function finishTrip() {
  if (tripFinished || savingTrip) return;

  if (!user) {
    Alert.alert(
      "Atenção",
      "Você precisa estar conectado para salvar a viagem."
    );
    return;
  }

  try {
    setSavingTrip(true);

    // Se estiver em uma viagem existente, salva nela.
    if (tripId) {
      await addActivitiesToExistingTrip(tripId, activities);

      setTripFinished(true);

      Alert.alert(
        "Atividades salvas!",
        "As atividades foram adicionadas à viagem existente.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/logic/trips"),
          },
        ]
      );

      return;
    }

    // Se não houver tripId, cria uma viagem nova.
    const result = await createTripInFirestore(user.id, activities);

    resetTripDraft();
    setCreatedInvitation(result.invitation);
    setTripFinished(true);
    setInvitationVisible(true);

  } catch (error) {
    console.error("Erro ao concluir viagem:", error);

    Alert.alert(
      "Erro",
      error instanceof Error
        ? error.message
        : "Não foi possível salvar a viagem."
    );

  } finally {
    setSavingTrip(false);
  }
}

    function closeInvitation() {
        setInvitationVisible(false);
        router.replace("/logic/trips");
    }

    const totalDays = Math.max(
    1,
    Math.floor(
        Number(
            tripId
                ? savedTripDuration
                : tripDraft.duration
        ) || 1
    )
);

    const dayActivities = activities.filter(
        item => item.day === selectedDay
    );

    function updateActivity(
       id: string | number,
        field: "time" | "title",
        value: string
    ) {
        setActivities(current =>
            current.map(item =>
                item.id === id
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    }

    function addActivity() {
        const newActivity: Activity = {
            id: Date.now(),
            day: selectedDay,
            time: "09:00",
            title: "",
            completed: false,
        };

        setActivities(current => [
            ...current,
            newActivity,
        ]);
    }
async function deleteActivity(id: string | number) {
    try {
        // Se for uma viagem existente, exclui também do Firebase.
        if (tripId) {
            await deleteActivityFromFirestore(
                tripId,
                String(id)
            );
        }

        // Atualiza a tela após a exclusão.
        setActivities(current =>
            current.filter(item => item.id !== id)
        );

    } catch (error) {
        console.error("Erro ao excluir atividade:", error);

        Alert.alert(
            "Erro",
            "Não foi possível excluir esta atividade."
        );
    }
}

    async function toggleActivity(id: string | number) {
        const currentActivity = activities.find(item => item.id === id);
        if (!currentActivity) return;

        const nextCompleted = !currentActivity.completed;

        // Atualização otimista: o checkbox responde imediatamente.
        setActivities(current => current.map(item =>
            item.id === id ? { ...item, completed: nextCompleted } : item
        ));

        // Durante a criação, as atividades só são gravadas ao concluir a viagem.
        // Atividades novas (id numérico) ainda não existem no Firestore.
        if (!tripId || typeof id === "number") return;

        try {
            await updateDoc(
                doc(db, "trips", tripId, "activities", String(id)),
                { completed: nextCompleted }
            );
        } catch (error) {
            console.error("Erro ao salvar checkbox no Firebase:", error);
            // Reverte a alteração se o Firestore rejeitar a gravação.
            setActivities(current => current.map(item =>
                item.id === id ? { ...item, completed: currentActivity.completed } : item
            ));
            Alert.alert("Erro", "Não foi possível salvar a atividade. Tente novamente.");
        }
    }

    function openTimePicker(activity: Activity) {
        const [hour, minute] = activity.time
            .split(":")
            .map(Number);

        setPickerHour(
            Number.isNaN(hour) ? 9 : hour
        );

        setPickerMinute(
            Number.isNaN(minute) ? 0 : minute
        );

        setSelectedActivityId(activity.id);
        setTimeModalVisible(true);
    }

    function confirmTime() {
        if (selectedActivityId === null) {
            return;
        }

        const formattedHour = String(
            pickerHour
        ).padStart(2, "0");

        const formattedMinute = String(
            pickerMinute
        ).padStart(2, "0");

        updateActivity(
            selectedActivityId,
            "time",
            `${formattedHour}:${formattedMinute}`
        );

        setTimeModalVisible(false);
        setSelectedActivityId(null);
    }

    function renderPickerItem({
        item,
        selected,
    }: {
        item: number;
        selected: number;
    }) {
        const isSelected = item === selected;

        return (
            <View
                style={[
                    styles.pickerItem,
                    isSelected &&
                        styles.pickerItemSelected,
                ]}
            >
                <Text
                    style={[
                        styles.pickerItemText,
                        isSelected &&
                            styles.pickerItemTextSelected,
                    ]}
                >
                    {String(item).padStart(2, "0")}
                </Text>
            </View>
        );
    }

    function handleHourScroll(event: any) {
        const offsetY =
            event.nativeEvent.contentOffset.y;

        const index = Math.round(
            offsetY / ITEM_HEIGHT
        );

        const validIndex = Math.max(
            0,
            Math.min(
                index,
                HOURS.length - 1
            )
        );

        setPickerHour(HOURS[validIndex]);
    }

    function handleMinuteScroll(event: any) {
        const offsetY =
            event.nativeEvent.contentOffset.y;

        const index = Math.round(
            offsetY / ITEM_HEIGHT
        );

        const validIndex = Math.max(
            0,
            Math.min(
                index,
                MINUTES.length - 1
            )
        );

        setPickerMinute(
            MINUTES[validIndex]
        );
    }

    return (
        <View style={styles.container}>
            <GlassBackdrop />
            <StatusBar
                barStyle={axisDarkMode ? "light-content" : "dark-content"}
             
            />

            {/* CABEÇALHO */}

            <View
                style={[
                    styles.header,
                    {
                        paddingTop:
                            insets.top,
                    },
                ]}
            >
                <Pressable
                    style={styles.backButton}
                    onPress={() =>
                        router.back()
                    }
                >
                    <MaterialIcons
                        name="arrow-back"
                        size={23}
                        color={axisPalette.text}
                    />
                </Pressable>

                <Text
                    style={styles.headerTitle}
                >
                    Roteiro da Viagem
                </Text>

                <View
                    style={styles.headerSpace}
                />
            </View>

            {/* DESTINO */}

            {tripDraft.destination ? (
                <View style={styles.destinationInfo}>
                    <Text
                        style={styles.destinationName}
                        numberOfLines={1}
                    >
                        {tripDraft.destination}
                    </Text>

                    {tripDraft.country ? (
                        <Text
                            style={
                                styles.destinationLocation
                            }
                            numberOfLines={1}
                        >
                            {tripDraft.country}
                        </Text>
                    ) : null}
                </View>
            ) : null}

            {/* ABAS DOS DIAS */}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                    false
                }
                style={styles.daysScroll}
                contentContainerStyle={
                    styles.daysContainer
                }
            >
                {Array.from(
                    {
                        length: totalDays,
                    },
                    (_, index) => {
                        const day =
                            index + 1;

                        const active =
                            day ===
                            selectedDay;

                        return (
                            <Pressable
                                key={day}
                                style={
                                    styles.dayButton
                                }
                                onPress={() =>
                                    setSelectedDay(
                                        day
                                    )
                                }
                            >
                                <Text
                                    style={[
                                        styles.dayTitle,
                                        active &&
                                            styles.dayTitleActive,
                                    ]}
                                >
                                    Dia {day}
                                </Text>

                                <Text
                                    style={[
                                        styles.dayDate,
                                        active &&
                                            styles.dayDateActive,
                                    ]}
                                >
                                    {day === 1
                                        ? "1º dia"
                                        : `${day}º dia`}
                                </Text>

                                {active && (
                                    <View
                                        style={
                                            styles.activeIndicator
                                        }
                                    />
                                )}
                            </Pressable>
                        );
                    }
                )}
            </ScrollView>

            {/* LISTA DAS ATIVIDADES */}

            <ScrollView
                style={
                    styles.activitiesScroll
                }
                contentContainerStyle={
                    styles.activitiesContent
                }
                showsVerticalScrollIndicator={
                    false
                }
                keyboardShouldPersistTaps="handled"
            >
                {dayActivities.map(
                    item => (
                        <View
                            key={item.id}
                            style={
                                styles.activityRow
                            }
                        >
                            {/* HORÁRIO */}

                            <Pressable
                                style={
                                    styles.timeContainer
                                }
                                onPress={() =>
                                    openTimePicker(
                                        item
                                    )
                                }
                            >
                                <MaterialIcons
                                    name="schedule"
                                    size={14}
                                    color={axisPalette.muted}
                                />

                                <Text
                                    style={
                                        styles.timeText
                                    }
                                >
                                    {item.time}
                                </Text>
                            </Pressable>

                            {/* ATIVIDADE */}

                            <View
                                style={
                                    styles.titleContainer
                                }
                            >
                                <TextInput
                                    value={
                                        item.title
                                    }
                                    onChangeText={value =>
                                        updateActivity(
                                            item.id,
                                            "title",
                                            value
                                        )
                                    }
                                    placeholder="Nome da atividade"
                                    placeholderTextColor={axisPalette.muted}
                                    style={[
                                        styles.activityInput,
                                        item.completed &&
                                            styles.activityCompletedText,
                                    ]}
                                    multiline
                                />
                            </View>

                            {/* CHECKLIST */}

                            <Pressable
                                style={
                                    styles.checkButton
                                }
                                onPress={() =>
                                    toggleActivity(
                                        item.id
                                    )
                                }
                                hitSlop={6}
                                accessibilityLabel={
                                    item.completed
                                        ? "Desmarcar atividade"
                                        : "Marcar atividade como realizada"
                                }
                            >
                                <View
                                    style={[
                                        styles.checkBox,
                                        item.completed &&
                                            styles.checkBoxCompleted,
                                    ]}
                                >
                                    {item.completed && (
                                        <MaterialIcons
                                            name="check"
                                            size={16}
                                            color={axisDarkMode ? "#171717" : "#FFFFFF"}
                                        />
                                    )}
                                </View>
                            </Pressable>

                            {/* EXCLUIR */}

                            <Pressable
                                style={
                                    styles.deleteButton
                                }
                                onPress={() =>
                                    deleteActivity(
                                        item.id
                                    )
                                }
                                hitSlop={8}
                                accessibilityLabel="Excluir atividade"
                            >
                                <MaterialIcons
                                    name="close"
                                    size={17}
                                    color={axisPalette.muted}
                                />
                            </Pressable>
                        </View>
                    )
                )}

                {/* ADICIONAR ATIVIDADE */}

                <Pressable
                    style={
                        styles.addButton
                    }
                    onPress={addActivity}
                >
                    <MaterialIcons
                        name="add"
                        size={19}
                        color={axisPalette.muted}
                    />

                    <Text
                        style={
                            styles.addButtonText
                        }
                    >
                        Adicionar atividade
                    </Text>
                </Pressable>

                {dayActivities.length ===
                    0 && (
                    <Text
                        style={
                            styles.emptyHint
                        }
                    >
                        Adicione atividades ou
                        passeios para este dia.
                    </Text>
                )}
            </ScrollView>

           <Pressable
    style={[
        styles.finishButton,
        savingTrip && { opacity: 0.6 },
    ]}
    disabled={tripFinished || savingTrip}
    onPress={finishTrip}
>
    <Text style={styles.finishButtonText}>
        {savingTrip ? "Salvando viagem..." : "Concluir viagem"}
    </Text>
</Pressable>

            {/* MODAL DO HORÁRIO */}

            <Modal
                visible={
                    timeModalVisible
                }
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() =>
                    setTimeModalVisible(
                        false
                    )
                }
            >
                <View
                    style={
                        styles.modalOverlay
                    }
                >
                    <Pressable
                        style={
                            styles.modalBackground
                        }
                        onPress={() =>
                            setTimeModalVisible(
                                false
                            )
                        }
                    />

                    <View
                        style={[
                            styles.timeModal,
                            { paddingBottom: Math.max(insets.bottom, 16) + 16 },
                        ]}
                    >
                        <View
                            style={
                                styles.modalHeader
                            }
                        >
                            <Pressable
                                onPress={() =>
                                    setTimeModalVisible(
                                        false
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.cancelText
                                    }
                                >
                                    Cancelar
                                </Text>
                            </Pressable>

                            <Text
                                style={
                                    styles.modalTitle
                                }
                            >
                                Escolher horário
                            </Text>

                            <Pressable
                                onPress={
                                    confirmTime
                                }
                            >
                                <Text
                                    style={
                                        styles.confirmText
                                    }
                                >
                                    OK
                                </Text>
                            </Pressable>
                        </View>

                        <View
                            style={
                                styles.selectedTimeDisplay
                            }
                        >
                            <Text
                                style={
                                    styles.selectedTimeText
                                }
                            >
                                {String(
                                    pickerHour
                                ).padStart(
                                    2,
                                    "0"
                                )}
                                :
                                {String(
                                    pickerMinute
                                ).padStart(
                                    2,
                                    "0"
                                )}
                            </Text>
                        </View>

                        <View
                            style={
                                styles.pickerWrapper
                            }
                        >
                            <View
                                style={
                                    styles.pickerColumn
                                }
                            >
                                <FlatList
                                    data={
                                        HOURS
                                    }
                                    keyExtractor={item =>
                                        `hour-${item}`
                                    }
                                    showsVerticalScrollIndicator={
                                        false
                                    }
                                    snapToInterval={
                                        ITEM_HEIGHT
                                    }
                                    decelerationRate="fast"
                                    contentContainerStyle={{
                                        paddingVertical:
                                            ITEM_HEIGHT *
                                            2,
                                    }}
                                    getItemLayout={(
                                        _data,
                                        index
                                    ) => ({
                                        length:
                                            ITEM_HEIGHT,
                                        offset:
                                            ITEM_HEIGHT *
                                            index,
                                        index,
                                    })}
                                    initialScrollIndex={
                                        pickerHour
                                    }
                                    onMomentumScrollEnd={
                                        handleHourScroll
                                    }
                                    renderItem={({
                                        item,
                                    }) =>
                                        renderPickerItem(
                                            {
                                                item,
                                                selected:
                                                    pickerHour,
                                            }
                                        )
                                    }
                                />

                                <View
                                    pointerEvents="none"
                                    style={
                                        styles.selectionBox
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.colonContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.colonText
                                    }
                                >
                                    :
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.pickerColumn
                                }
                            >
                                <FlatList
                                    data={
                                        MINUTES
                                    }
                                    keyExtractor={item =>
                                        `minute-${item}`
                                    }
                                    showsVerticalScrollIndicator={
                                        false
                                    }
                                    snapToInterval={
                                        ITEM_HEIGHT
                                    }
                                    decelerationRate="fast"
                                    contentContainerStyle={{
                                        paddingVertical:
                                            ITEM_HEIGHT *
                                            2,
                                    }}
                                    getItemLayout={(
                                        _data,
                                        index
                                    ) => ({
                                        length:
                                            ITEM_HEIGHT,
                                        offset:
                                            ITEM_HEIGHT *
                                            index,
                                        index,
                                    })}
                                    initialScrollIndex={
                                        pickerMinute
                                    }
                                    onMomentumScrollEnd={
                                        handleMinuteScroll
                                    }
                                    renderItem={({
                                        item,
                                    }) =>
                                        renderPickerItem(
                                            {
                                                item,
                                                selected:
                                                    pickerMinute,
                                            }
                                        )
                                    }
                                />

                                <View
                                    pointerEvents="none"
                                    style={
                                        styles.selectionBox
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
<TripInvitationModal
  visible={invitationVisible}
  invitation={createdInvitation}
  onClose={closeInvitation}
/>
        </View>
    );
}

const createStyles = (palette: GlassPalette, darkMode: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
    },

    header: {
        minHeight: 82,
        paddingHorizontal: 16,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "header", palette),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    backButton: {
        width: 34,
        height: 40,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: glassColor("color", "#151515", "headerTitle", palette),
    },

    headerSpace: {
        width: 34,
    },

    destinationInfo: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 10,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "destinationInfo", palette),
    },

    destinationName: {
        fontSize: 18,
        fontWeight: "700",
        color: glassColor("color", "#303030", "destinationName", palette),
    },

    destinationLocation: {
        marginTop: 3,
        fontSize: 12,
        color: glassColor("color", "#8492a8", "destinationLocation", palette),
    },

    daysScroll: {
        flexGrow: 0,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "daysScroll", palette),
    },

    daysContainer: {
        flexDirection: "row",
        paddingHorizontal: 8,
    },

    dayButton: {
        width: 76,
        height: 57,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    dayTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: glassColor("color", "#303030", "dayTitle", palette),
    },

    dayTitleActive: {
        fontWeight: "800",
    },

    dayDate: {
        marginTop: 3,
        fontSize: 11,
        color: glassColor("color", "#aaaaaa", "dayDate", palette),
    },

    dayDateActive: {
        color: glassColor("color", "#888888", "dayDateActive", palette),
    },

    activeIndicator: {
        position: "absolute",
        bottom: 0,
        left: 10,
        right: 10,
        height: 2,
        backgroundColor: glassColor("backgroundColor", "#303030", "activeIndicator", palette),
    },

    activitiesScroll: {
        flex: 1,
    },

    activitiesContent: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 30,
    },

    activityRow: {
        minHeight: 44,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 9,
        gap: 7,
    },

    timeContainer: {
        width: 68,
        minHeight: 35,
        paddingHorizontal: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: glassColor("borderColor", "#eaeaea", "timeContainer", palette),
        backgroundColor: glassColor("backgroundColor", "#fafafa", "timeContainer", palette),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },

    timeText: {
        fontSize: 11,
        color: glassColor("color", "#303030", "timeText", palette),
        textAlign: "center",
        fontWeight: "500",
    },

    titleContainer: {
        flex: 1,
        minHeight: 35,
        justifyContent: "center",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: glassColor("borderColor", "#eaeaea", "titleContainer", palette),
        backgroundColor: glassColor("backgroundColor", "#fafafa", "titleContainer", palette),
        paddingHorizontal: 13,
    },

    activityInput: {
        minHeight: 33,
        paddingVertical: 6,
        fontSize: 12,
        color: glassColor("color", "#202020", "activityInput", palette),
    },

    activityCompletedText: {
        color: glassColor("color", "#999999", "activityCompletedText", palette),
        textDecorationLine: "line-through",
    },

    checkButton: {
        width: 30,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
    },

    checkBox: {
        width: 25,
        height: 25,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: darkMode ? "#E5E5E5" : "#555555",
        backgroundColor: darkMode ? "#292929" : "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    checkBoxCompleted: {
        backgroundColor: darkMode ? "#F5F5F5" : "#171717",
        borderColor: darkMode ? "#F5F5F5" : "#171717",
    },

    deleteButton: {
        width: 22,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
    },

    addButton: {
        height: 42,
        marginTop: 5,
        borderRadius: 22,
        backgroundColor: glassColor("backgroundColor", "#e3e3e3", "addButton", palette),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },

    addButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: glassColor("color", "#666666", "addButtonText", palette),
    },

    emptyHint: {
        marginTop: 14,
        fontSize: 12,
        lineHeight: 18,
        color: glassColor("color", "#999999", "emptyHint", palette),
        textAlign: "center",
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: darkMode ? "rgba(0,0,0,0.78)" : "rgba(0,0,0,0.40)",
    },

    modalBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
    },

    timeModal: {
        backgroundColor: darkMode ? "#242424" : "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 35,
        overflow: "hidden",
    },

    modalHeader: {
        height: 58,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: darkMode ? "#444444" : "#E5E5E5",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    modalTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: darkMode ? "#FFFFFF" : "#171717",
    },

    cancelText: {
        fontSize: 14,
        color: darkMode ? "#D6D6D6" : "#555555",
    },

    confirmText: {
        fontSize: 14,
        fontWeight: "700",
        color: darkMode ? "#FFFFFF" : "#171717",
    },

    selectedTimeDisplay: {
        height: 65,
        alignItems: "center",
        justifyContent: "center",
    },

    selectedTimeText: {
        fontSize: 28,
        fontWeight: "700",
        color: darkMode ? "#FFFFFF" : "#171717",
    },

    pickerWrapper: {
        height: ITEM_HEIGHT * 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 55,
    },

    pickerColumn: {
        width: 75,
        height: ITEM_HEIGHT * 5,
        position: "relative",
        overflow: "hidden",
    },

    pickerItem: {
        height: ITEM_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
    },

    pickerItemSelected: {
        backgroundColor: darkMode ? "#EAEAEA" : "#171717",
        borderRadius: 12,
    },

    pickerItemText: {
        fontSize: 18,
        color: darkMode ? "#C8C8C8" : "#555555",
        fontWeight: "400",
    },

    pickerItemTextSelected: {
        fontSize: 21,
        color: darkMode ? "#171717" : "#FFFFFF",
        fontWeight: "700",
    },

    selectionBox: {
        position: "absolute",
        left: 0,
        right: 0,
        top: ITEM_HEIGHT * 2,
        height: ITEM_HEIGHT,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: darkMode ? "#F0F0F0" : "#171717",
    },

    colonContainer: {
        width: 25,
        height: ITEM_HEIGHT * 5,
        alignItems: "center",
        justifyContent: "center",
    },

    colonText: {
        fontSize: 22,
        fontWeight: "700",
        color: darkMode ? "#FFFFFF" : "#171717",
    },
    finishButton: {
        marginTop: 12,
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 15,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: glassColor(
            "backgroundColor",
            "#171717",
            "finishButton",
            palette
        ),
    },

    finishButtonText: {
        color: glassColor(
            "color",
            "#FFFFFF",
            "finishButtonText",
            palette
        ),
        fontSize: 17,
        fontWeight: "700",
    },
});