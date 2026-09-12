import React from "react";

import {
    View,
    Text,
    StyleSheet,
    Pressable,
    StatusBar,
    ScrollView,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import GlassBottomNav from "../../../components/GlassBottomNav";


export default function TripsScreen() {

    const router = useRouter();

    const insets = useSafeAreaInsets();

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

                    <Pressable style={styles.menuButton}>

                        <MaterialIcons
                            name="menu"
                            size={27}
                            color="#8492a8"
                        />

                    </Pressable>


                    <Text style={styles.headerTitle}>
                        Minhas Viagens
                    </Text>


                    <View style={styles.headerSpace} />

                </View>


                {/* =================================================
                    ESTADO VAZIO
                ================================================= */}

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
    
        justifyContent: "space-between",
    },


    menuButton: {
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

});