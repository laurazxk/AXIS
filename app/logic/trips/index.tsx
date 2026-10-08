import {
    Image,
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

import { savedTrips } from "./tripStore";

export default function TripsScreen() {

    const router = useRouter();

    const insets = useSafeAreaInsets();

    const hasTrips = savedTrips.length > 0;

    return (

        <View style={styles.container}>

            <StatusBar
                barStyle="dark-content"
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
                        <Image
                            source={require("../../../assets/images/perfil.jpg")}
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
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
                                color="#ffffff"
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
                        {savedTrips.map((trip) => (
                            <View key={trip.id} style={styles.tripCard}>
                                <Text style={styles.tripDestination}>
                                    {trip.destination}
                                </Text>

                                <Text style={styles.tripCountry}>
                                    {trip.country}
                                </Text>
                            </View>
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
                        color="#ffffff"
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
                            color="#ffffff"
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
                        color="#303030"
                    />

                </Pressable>


                <View style={styles.bottomSpace} />

            </ScrollView>


            {/* =================================================
                NAVEGAÇÃO
            ================================================= */}

            <GlassBottomNav />

        </View>
    );
}


/* =========================================================
   ESTILOS
========================================================= */

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
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
        color: "#8492a8",
    },

    profileButton: {
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

        backgroundColor: "#a7a7a7",

        marginBottom: 20,
    },


    emptyTitle: {
        textAlign: "center",

        fontSize: 21,

        lineHeight: 27,

        fontWeight: "800",

        color: "#303030",

        marginBottom: 12,
    },


    emptyDescription: {
        textAlign: "center",

        fontSize: 13,

        lineHeight: 20,

        color: "#888888",
    },


    /* =================================================
       BOTÃO CRIAR
    ================================================= */

    createButton: {
        height: 56,

        marginHorizontal: 30,

        marginTop: 48,

        borderRadius: 28,

        backgroundColor: "#000000",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 10,
    },


    createButtonText: {
        color: "#ffffff",

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
        marginHorizontal: 30,

        marginTop: 18,

        minHeight: 88,

        borderRadius: 20,

        backgroundColor: "#ffffff",

        paddingHorizontal: 18,

        paddingVertical: 15,

        flexDirection: "row",

        alignItems: "center",

        shadowColor: "#000000",

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

        backgroundColor: "#a7a7a7",

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

        color: "#303030",

        marginBottom: 4,
    },


    joinDescription: {
        fontSize: 11,

        lineHeight: 16,

        color: "#999999",
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
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    tripDestination: {
        fontSize: 18,
        fontWeight: "700",
        color: "#303030",
        marginBottom: 5,
    },

    tripCountry: {
        fontSize: 13,
        color: "#888888",
    },

});