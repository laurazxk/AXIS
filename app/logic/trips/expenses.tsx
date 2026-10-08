import GlassFrost from "../../../components/GlassFrost";
import { useAxisTheme } from "../../../contexts/ThemeContext";
import { glassColor, glassDecoration, type GlassPalette } from "../../../constants/glass";
import GlassBackdrop from "../../../components/GlassBackdrop";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

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

import GlassBottomNav from "../../../components/GlassBottomNav";

import { savedTrips } from "./tripStore";

export default function ExpensesScreen() {
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);


    const insets = useSafeAreaInsets();

    const hasTrips = savedTrips.length > 0;

    const router = useRouter();

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
                        paddingTop: insets.top,
                    },
                ]}
            >

                {/* CABEÇALHO */}

                <View style={styles.header}>

                    <Text style={styles.headerTitle}>
                        Despesas
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
                                                color={axisPalette.muted}
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
                <GlassFrost />

                            <View style={styles.emptyIcon}>

                                <MaterialIcons
                                    name="account-balance-wallet"
                                    size={28}
                                    color={axisPalette.muted}
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


const createStyles = (palette: GlassPalette) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
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


    content: {
        paddingHorizontal: 28,
        marginTop: 28,
    },


    title: {
        fontSize: 29,
        lineHeight: 35,
        fontWeight: "800",
        color: glassColor("color", "#303030", "title", palette),
        textAlign: "center",
    },


    subtitle: {
        marginTop: 10,
        fontSize: 14,
        lineHeight: 21,
        color: glassColor("color", "#888888", "subtitle", palette),
        maxWidth: 320,
        textAlign: "center",
        alignSelf: "center",
    },


    sectionTitle: {
        marginTop: 32,
        fontSize: 17,
        fontWeight: "700",
        color: glassColor("color", "#8492a8", "sectionTitle", palette),
        textAlign: "center",
    },


    sectionDescription: {
        marginTop: 5,
        marginBottom: 13,
        fontSize: 11,
        color: glassColor("color", "#999999", "sectionDescription", palette),
        textAlign: "center",
    },


    tripsContainer: {
        gap: 12,
    },


    tripCard: {
        ...glassDecoration("tripCard", palette),
        minHeight: 78,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 18,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "tripCard", palette),
        flexDirection: "row",
        alignItems: "center",
        shadowColor: glassColor("shadowColor", "#000000", "tripCard", palette),
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
        backgroundColor: glassColor("backgroundColor", "#f1f3f6", "tripIconContainer", palette),
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
        color: glassColor("color", "#303030", "tripDestination", palette),
    },


    tripCountry: {
        marginTop: 4,
        fontSize: 11,
        color: glassColor("color", "#888888", "tripCountry", palette),
    },


    emptyCard: {
        ...glassDecoration("emptyCard", palette),
        marginTop: 30,
        padding: 24,
        borderRadius: 20,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "emptyCard", palette),
        alignItems: "center",
    },


    emptyIcon: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: glassColor("backgroundColor", "#f1f3f6", "emptyIcon", palette),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },


    emptyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: glassColor("color", "#303030", "emptyTitle", palette),
    },


    emptyText: {
        marginTop: 7,
        fontSize: 12,
        lineHeight: 18,
        color: glassColor("color", "#888888", "emptyText", palette),
        textAlign: "center",
        maxWidth: 260,
    },

});