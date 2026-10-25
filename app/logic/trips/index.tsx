import { useAxisTheme } from "../../../contexts/ThemeContext";
import { glassColor, glassDecoration, type GlassPalette } from "../../../constants/glass";
import GlassBackdrop from "../../../components/GlassBackdrop";
import React from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import GlassBottomNav from "../../../components/GlassBottomNav";

import {
    deleteTrip,
    getSavedTrips,
    subscribeToTrips,
    type SavedTrip,
  } from "./tripStore";
  
  import TripInvitationModal from "../../../components/TripInvitationModal";
  import UserAvatar from "../../../components/UserAvatar";
  import { useAxisAuth } from "../../../contexts/AuthContext";

export default function TripsScreen() {
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);


    const router = useRouter();

    const insets = useSafeAreaInsets();

    const { user } = useAxisAuth();

const [trips, setTrips] =
  React.useState<SavedTrip[]>(getSavedTrips);

const [selectedTrip, setSelectedTrip] =
  React.useState<SavedTrip | null>(null);

React.useEffect(() => {
  return subscribeToTrips(() => {
    setTrips(getSavedTrips());
  });
}, []);

    const hasTrips = trips.length > 0;

    function confirmDeleteTrip(trip: SavedTrip) {
      Alert.alert(
        "Excluir viagem",
        `Deseja excluir a viagem para ${trip.destination || "este destino"}? Essa ação não pode ser desfeita.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => {
              deleteTrip(trip.id);
              if (selectedTrip?.id === trip.id) setSelectedTrip(null);
            },
          },
        ]
      );
    }

    return (

        <View style={styles.container}>
            <GlassBackdrop />

            <StatusBar
                barStyle={axisDarkMode ? "light-content" : "dark-content"}
                backgroundColor="#f7f7f7"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingTop: insets.top + 8,
                    },
                ]}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <View style={styles.header}>

                    <Text style={styles.headerTitle}>
                        Minhas Viagens
                    </Text>

                    <Pressable
                        style={styles.profileButton}
                        onPress={() =>
                            router.push("/logic/profile")
                        }
                    >
                        <UserAvatar user={user} size={35} />
                    </Pressable>

                </View>


                {/* =================================================
                    ESTADO VAZIO
                ================================================= */}

                {!hasTrips && (
                    <View style={styles.emptyContainer}>

                        <View style={styles.iconCircle}>

                            <MaterialIcons
                                name="luggage"
                                size={28}
                                color={axisPalette.accentText}
                            />

                        </View>


                        <Text style={styles.emptyTitle}>
                            Comece a planejar
                            {"\n"}
                            sua próxima viagem
                        </Text>


                        <Text style={styles.emptyDescription}>
                            Crie um roteiro personalizado,
                            {"\n"}
                            organize seus gastos e
                            {"\n"}
                            convide seus amigos.
                        </Text>

                    </View>
                )}

{hasTrips && (
  <View style={styles.tripsContainer}>
    {trips.map((trip) => (
      <Pressable
        key={trip.id}
        style={({ pressed }) => [
          styles.tripCard,
          pressed && { opacity: 0.85 },
        ]}
        onPress={() => router.push({
          pathname: "/logic/trips/itinerary",
          params: { tripId: trip.id },
        })}
        accessibilityRole="button"
      >
        <Text style={styles.tripDestination}>
          {trip.destination}
        </Text>

        <Text style={styles.tripCountry}>
          {trip.country}
        </Text>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            setSelectedTrip(trip);
          }}
          accessibilityRole="button"
          style={{
            marginTop: 16,
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderWidth: 1,
            borderColor: axisPalette.border,
            borderRadius: 12,
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
        >
          <MaterialIcons
            name="qr-code"
            size={20}
            color={axisPalette.text}
          />

          <Text
            style={{
              color: axisPalette.text,
              fontSize: 13,
              fontWeight: "700",
            }}
          >
            Código
          </Text>
        </Pressable>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            confirmDeleteTrip(trip);
          }}
          accessibilityRole="button"
          accessibilityLabel={`Excluir viagem para ${trip.destination}`}
          hitSlop={8}
          style={({ pressed }) => [
            styles.deleteTripButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <MaterialIcons name="delete-outline" size={22} color={axisPalette.muted} />
        </Pressable>
      </Pressable>
    ))}
  </View>
)}

                {/* =================================================
                    CRIAR VIAGEM
                ================================================= */}

                <Pressable
                    style={({ pressed }) => [
                        styles.createButton,
                        pressed && styles.buttonPressed,
                    ]}

                    onPress={() =>
                        router.push("/logic/trips/create")
                    }
                >

                    <Text style={styles.createButtonText}>
                        Criar nova viagem
                    </Text>


                    <MaterialIcons
                        name="arrow-forward"
                        size={21}
                        color={axisPalette.accentText}
                    />

                </Pressable>


                {/* =================================================
                    ENTRAR EM UMA VIAGEM
                ================================================= */}

                <Pressable
                    style={({ pressed }) => [
                        styles.joinCard,
                        pressed && styles.cardPressed,
                    ]}

                    onPress={() =>
                        router.push("/logic/trips/join")
                    }
                >

                    <View style={styles.joinIcon}>

                        <MaterialIcons
                            name="group"
                            size={24}
                            color={axisPalette.accentText}
                        />

                    </View>


                    <View style={styles.joinTextContainer}>

                        <Text style={styles.joinTitle}>
                            Entrar em uma viagem
                        </Text>


                        <Text style={styles.joinDescription}>
                            Digite o código recebido
                            {"\n"}
                            pelos seus amigos.
                        </Text>

                    </View>


                    <MaterialIcons
                        name="arrow-forward"
                        size={21}
                        color={axisPalette.text}
                    />

                </Pressable>


                <View style={styles.bottomSpace} />

            </ScrollView>


            {/* =================================================
                NAVEGAÇÃO
            ================================================= */}

            <GlassBottomNav />

            <TripInvitationModal
  visible={selectedTrip !== null}
  invitation={selectedTrip?.invitation ?? null}
  onClose={() => setSelectedTrip(null)}
/>

        </View>
    );
}


/* =========================================================
   ESTILOS
========================================================= */

const createStyles = (palette: GlassPalette) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
    },


    scrollContent: {
        paddingBottom: 30,
    },


    /* =================================================
       HEADER
    ================================================= */

    header: {
        height: 58,
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 17,
        fontWeight: "700",
        color: glassColor("color", "#8492a8", "headerTitle", palette),
    },

    profileButton: {
        ...glassDecoration("profileButton", palette),
        position: "absolute",
        right: 24,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 18,
    },


    /* =================================================
       ESTADO VAZIO
    ================================================= */

    emptyContainer: {
        alignItems: "center",

        marginTop: 65,

        paddingHorizontal: 30,
    },


    iconCircle: {
        width: 58,
        height: 58,

        borderRadius: 29,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: glassColor("backgroundColor", "#a7a7a7", "iconCircle", palette),

        marginBottom: 20,
    },


    emptyTitle: {
        textAlign: "center",

        fontSize: 21,

        lineHeight: 27,

        fontWeight: "800",

        color: glassColor("color", "#303030", "emptyTitle", palette),

        marginBottom: 12,
    },


    emptyDescription: {
        textAlign: "center",

        fontSize: 13,

        lineHeight: 20,

        color: glassColor("color", "#888888", "emptyDescription", palette),
    },


    /* =================================================
       BOTÃO CRIAR
    ================================================= */

    createButton: {
        height: 56,

        marginHorizontal: 30,

        marginTop: 48,

        borderRadius: 28,

        backgroundColor: glassColor("backgroundColor", "#000000", "createButton", palette),

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 10,
    },


    createButtonText: {
        color: glassColor("color", "#ffffff", "createButtonText", palette),

        fontSize: 14,

        fontWeight: "600",
    },


    buttonPressed: {
        transform: [
            {
                scale: 0.97,
            },
        ],
    },


    /* =================================================
       ENTRAR EM VIAGEM
    ================================================= */

    joinCard: {
        ...glassDecoration("joinCard", palette),
        marginHorizontal: 30,

        marginTop: 18,

        minHeight: 88,

        borderRadius: 20,

        backgroundColor: glassColor("backgroundColor", "#ffffff", "joinCard", palette),

        paddingHorizontal: 18,

        paddingVertical: 15,

        flexDirection: "row",

        alignItems: "center",

        shadowColor: glassColor("shadowColor", "#000000", "joinCard", palette),

        shadowOffset: {
            width: 0,
            height: 4,
        },

        shadowOpacity: 0.08,

        shadowRadius: 8,

        elevation: 3,
    },


    joinIcon: {
        width: 48,
        height: 48,

        borderRadius: 24,

        backgroundColor: glassColor("backgroundColor", "#a7a7a7", "joinIcon", palette),

        alignItems: "center",
        justifyContent: "center",

        marginRight: 14,
    },


    joinTextContainer: {
        flex: 1,
    },


    joinTitle: {
        fontSize: 14,

        fontWeight: "700",

        color: glassColor("color", "#303030", "joinTitle", palette),

        marginBottom: 4,
    },


    joinDescription: {
        fontSize: 11,

        lineHeight: 16,

        color: glassColor("color", "#999999", "joinDescription", palette),
    },


    cardPressed: {
        transform: [
            {
                scale: 0.97,
            },
        ],
    },


    bottomSpace: {
        height: 120,
    },

    tripsContainer: {
        marginTop: 30,
        paddingHorizontal: 30,
    },

    tripCard: {
        ...glassDecoration("tripCard", palette),
        backgroundColor: glassColor("backgroundColor", "#ffffff", "tripCard", palette),
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        shadowColor: glassColor("shadowColor", "#000000", "tripCard", palette),
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    deleteTripButton: {
        position: "absolute",
        right: 14,
        top: 14,
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
    },

    tripDestination: {
        fontSize: 18,
        fontWeight: "700",
        color: glassColor("color", "#303030", "tripDestination", palette),
        marginBottom: 5,
    },

    tripCountry: {
        fontSize: 13,
        color: glassColor("color", "#888888", "tripCountry", palette),
    },

});