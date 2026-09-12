import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    StatusBar,
    ScrollView,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import GlassBottomNav from "../../../components/GlassBottomNav";


export default function CreateTripScreen() {

    const router = useRouter();

    const insets = useSafeAreaInsets();

    const [destination, setDestination] = useState("");

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
                        Nova Viagem
                    </Text>


                    <View style={styles.headerSpace} />

                </View>



                {/* =================================================
                    TÍTULO
                ================================================= */}

                <View style={styles.content}>

                    <Text style={styles.title}>
                        Para onde você
                        {"\n"}
                        quer viajar?
                    </Text>


                    <Text style={styles.description}>
                        Escolha o destino da sua próxima
                        viagem.
                    </Text>


                    {/* =================================================
                        BUSCA
                    ================================================= */}

                    <View style={styles.searchContainer}>

                        <TextInput
                            value={destination}
                            onChangeText={setDestination}
                            placeholder="Digite um destino"
                            placeholderTextColor="#999999"
                            style={styles.input}
                        />


                        <MaterialIcons
                            name="search"
                            size={22}
                            color="#555555"
                        />

                    </View>


                    {/* =================================================
                        SUGESTÕES
                    ================================================= */}

                    <Text style={styles.sectionTitle}>
                        Destinos populares
                    </Text>


                    <View style={styles.suggestionGrid}>

                        {[
                            "Paris",
                            "Tóquio",
                            "Roma",
                            "Londres",
                        ].map((item) => (

                            <Pressable
                                key={item}
                                style={[
                                    styles.suggestion,
                                    destination === item &&
                                    styles.suggestionActive,
                                ]}
                                onPress={() =>
                                    setDestination(item)
                                }
                            >

                                <Text
                                    style={[
                                        styles.suggestionText,
                                        destination === item &&
                                        styles.suggestionTextActive,
                                    ]}
                                >
                                    {item}
                                </Text>

                            </Pressable>

                        ))}

                    </View>


                    {/* =================================================
                        CONTINUAR
                    ================================================= */}

                    <Pressable
                        style={[
                            styles.nextButton,
                            !destination.trim() &&
                            styles.nextButtonDisabled,
                        ]}

                        onPress={() => {

                            if (!destination.trim()) {
                                return;
                            }

                            router.push(
                                "/logic/trips/preferences"
                            );

                        }}
                    >

                        <Text style={styles.nextButtonText}>
                            Continuar
                        </Text>


                        <MaterialIcons
                            name="arrow-forward"
                            size={21}
                            color="#ffffff"
                        />

                    </Pressable>

                </View>


                <View style={styles.bottomSpace} />

            </ScrollView>


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
        paddingBottom: 120,
    },


    /* HEADER */

    header: {
        height: 66,

        paddingHorizontal: 24,

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


    /* PROGRESSO */

    progressContainer: {
        flexDirection: "row",

        paddingHorizontal: 30,

        gap: 6,

        marginTop: 18,
    },


    progressStep: {
        flex: 1,

        height: 4,

        borderRadius: 2,

        backgroundColor: "#dddddd",
    },


    progressActive: {
        backgroundColor: "#303030",
    },


    stepText: {
        marginLeft: 30,

        marginTop: 8,

        fontSize: 10,

        color: "#999999",
    },


    /* CONTEÚDO */

    content: {
        paddingHorizontal: 30,

        marginTop: 42,
    },


    title: {
        fontSize: 29,

        lineHeight: 35,

        fontWeight: "800",

        color: "#303030",
    },


    description: {
        fontSize: 13,

        lineHeight: 20,

        color: "#888888",

        marginTop: 12,

        marginBottom: 27,
    },


    /* BUSCA */

    searchContainer: {
        height: 54,

        borderRadius: 27,

        backgroundColor: "#ffffff",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 20,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.08,

        shadowRadius: 7,

        elevation: 3,
    },


    input: {
        flex: 1,

        height: 54,

        fontSize: 14,

        color: "#303030",
    },


    /* SUGESTÕES */

    sectionTitle: {
        fontSize: 17,

        fontWeight: "700",

        color: "#8492a8",

        marginTop: 34,

        marginBottom: 14,
    },


    suggestionGrid: {
        flexDirection: "row",

        flexWrap: "wrap",

        gap: 10,
    },


    suggestion: {
        paddingHorizontal: 18,

        height: 38,

        borderRadius: 20,

        backgroundColor: "#e7e7e7",

        alignItems: "center",

        justifyContent: "center",
    },


    suggestionActive: {
        backgroundColor: "#303030",
    },


    suggestionText: {
        fontSize: 12,

        color: "#555555",

        fontWeight: "500",
    },


    suggestionTextActive: {
        color: "#ffffff",
    },


    /* BOTÃO */

    nextButton: {
        height: 56,

        borderRadius: 28,

        backgroundColor: "#000000",

        marginTop: 45,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 10,
    },


    nextButtonDisabled: {
        opacity: 0.4,
    },


    nextButtonText: {
        color: "#ffffff",

        fontSize: 14,

        fontWeight: "600",
    },


    bottomSpace: {
        height: 100,
    },

});