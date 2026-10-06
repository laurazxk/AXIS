import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import {
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import GlassBottomNav from "../../../components/GlassBottomNav";
import { savedTrips } from "./tripStore";

export default function ExpensesScreen() {
    const insets = useSafeAreaInsets();
    const hasTrips = savedTrips.length > 0;
    const router = useRouter();

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
                        paddingTop: insets.top,
                    },
                ]}
            >
                {/* CABEÇALHO */}

                <View style={styles.header}>

                    <Text style={styles.headerTitle}>
                        Despesas
                    </Text>

                </View>

                {/* TÍTULO E MENSAGEM */}

                <View style={styles.content}>
                    <Text style={styles.title}>
                        Organize seus gastos
                    </Text>

                    <Text style={styles.subtitle}>
                        Acompanhe as despesas das suas viagens
                        de forma simples e organizada.
                    </Text>

                    {hasTrips ? (
                        <>
                            <Text style={styles.sectionTitle}>
                                Minhas viagens
                            </Text>

                            <Text style={styles.sectionDescription}>
                                Selecione uma viagem para visualizar
                                seus gastos.
                            </Text>

                            <View style={styles.tripsContainer}>
                                {savedTrips.map((trip) => (
                                    <Pressable
                                        key={trip.id}
                                        style={styles.tripCard}
                                        onPress={() =>
                                            router.push({
                                                pathname:
                                                    "/logic/expenses/[id]",
                                                params: {
                                                    id: trip.id,
                                                },
                                            })
                                        }
                                    >
                                        <View
                                            style={
                                                styles.tripIconContainer
                                            }
                                        >
                                            <MaterialIcons
                                                name="flight-takeoff"
                                                size={22}
                                                color="#8492a8"
                                            />
                                        </View>

                                        <View style={styles.tripText}>
                                            <Text
                                                style={
                                                    styles.tripDestination
                                                }
                                            >
                                                {trip.destination}
                                            </Text>

                                            <Text
                                                style={styles.tripCountry}
                                            >
                                                {trip.country}
                                            </Text>
                                        </View>

                                        <MaterialIcons
                                            name="chevron-right"
                                            size={24}
                                            color="#aaaaaa"
                                        />
                                    </Pressable>
                                ))}
                            </View>
                        </>
                    ) : (
                        <View style={styles.emptyCard}>
                            <View style={styles.emptyIcon}>
                                <MaterialIcons
                                    name="account-balance-wallet"
                                    size={28}
                                    color="#8492a8"
                                />
                            </View>

                            <Text style={styles.emptyTitle}>
                                Nenhuma viagem ainda
                            </Text>

                            <Text style={styles.emptyText}>
                                Crie uma viagem para começar a
                                organizar suas despesas.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <GlassBottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },

    scrollContent: {
        paddingBottom: 120,
    },

    header: {
        height: 66,
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

    content: {
        paddingHorizontal: 28,
        marginTop: 28,
    },

    title: {
        fontSize: 29,
        lineHeight: 35,
        fontWeight: "800",
        color: "#303030",
        textAlign: "center",
    },

    subtitle: {
        marginTop: 10,
        fontSize: 14,
        lineHeight: 21,
        color: "#888888",
        maxWidth: 320,
        textAlign: "center",
        alignSelf: "center",
    },

    sectionTitle: {
        marginTop: 32,
        fontSize: 17,
        fontWeight: "700",
        color: "#8492a8",
        textAlign: "center",
    },

    sectionDescription: {
        marginTop: 5,
        marginBottom: 13,
        fontSize: 11,
        color: "#999999",
        textAlign: "center",
    },

    tripsContainer: {
        gap: 12,
    },

    tripCard: {
        minHeight: 78,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 18,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.06,
        shadowRadius: 7,
        elevation: 2,
    },

    tripIconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#f1f3f6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 13,
    },

    tripText: {
        flex: 1,
    },

    tripDestination: {
        fontSize: 15,
        fontWeight: "700",
        color: "#303030",
    },

    tripCountry: {
        marginTop: 4,
        fontSize: 11,
        color: "#888888",
    },

    emptyCard: {
        marginTop: 30,
        padding: 24,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        alignItems: "center",
    },

    emptyIcon: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: "#f1f3f6",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#303030",
    },

    emptyText: {
        marginTop: 7,
        fontSize: 12,
        lineHeight: 18,
        color: "#888888",
        textAlign: "center",
        maxWidth: 260,
    },
});