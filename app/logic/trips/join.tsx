import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import GlassBottomNav from "../../../components/GlassBottomNav";


export default function JoinTripScreen() {

    const router = useRouter();
    
    const insets = useSafeAreaInsets();

    const [code, setCode] = useState("");

    return (

        <View style={styles.container}>

    <StatusBar
        barStyle="dark-content"
        backgroundColor="#f7f7f7"
    />

    <KeyboardAvoidingView
        style={[
            styles.keyboard,
            {
                paddingTop: insets.top,
            },
        ]}
        behavior={
            Platform.OS === "ios"
                ? "padding"
                : undefined
        }
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
                        Entrar em uma viagem
                    </Text>


                    <View style={styles.headerSpace} />

                </View>


                {/* =================================================
                    CONTEÚDO
                ================================================= */}

                <View style={styles.content}>

                    <View style={styles.iconCircle}>

                        <MaterialIcons
                            name="group"
                            size={30}
                            color="#ffffff"
                        />

                    </View>


                    <Text style={styles.title}>
                        Entre na viagem
                        {"\n"}
                        dos seus amigos
                    </Text>


                    <Text style={styles.description}>
                        Digite o código personalizado
                        {"\n"}
                        que você recebeu.
                    </Text>


                    <TextInput
                        value={code}
                        onChangeText={setCode}
                        placeholder="Código da viagem"
                        placeholderTextColor="#999999"
                        autoCapitalize="characters"
                        style={styles.input}
                        maxLength={10}
                    />


                    <Pressable
                        style={[
                            styles.button,
                            !code.trim() &&
                            styles.buttonDisabled,
                        ]}
                    >

                        <Text style={styles.buttonText}>
                            Entrar na viagem
                        </Text>


                        <MaterialIcons
                            name="arrow-forward"
                            size={21}
                            color="#ffffff"
                        />

                    </Pressable>

                </View>

            </KeyboardAvoidingView>


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


    keyboard: {
        flex: 1,
    },


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


    content: {
        alignItems: "center",

        paddingHorizontal: 30,

        marginTop: 70,
    },


    iconCircle: {
        width: 64,
        height: 64,

        borderRadius: 32,

        backgroundColor: "#a7a7a7",

        alignItems: "center",
        justifyContent: "center",

        marginBottom: 24,
    },


    title: {
        textAlign: "center",

        fontSize: 24,

        lineHeight: 30,

        fontWeight: "800",

        color: "#303030",

        marginBottom: 12,
    },


    description: {
        textAlign: "center",

        fontSize: 13,

        lineHeight: 20,

        color: "#888888",

        marginBottom: 30,
    },


    input: {
        width: "100%",

        height: 54,

        backgroundColor: "#ffffff",

        borderRadius: 27,

        paddingHorizontal: 22,

        fontSize: 15,

        color: "#303030",

        textAlign: "center",

        letterSpacing: 2,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.08,

        shadowRadius: 7,

        elevation: 3,
    },


    button: {
        width: "100%",

        height: 54,

        borderRadius: 27,

        backgroundColor: "#000000",

        marginTop: 18,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "center",

        gap: 10,
    },


    buttonDisabled: {
        opacity: 0.45,
    },


    buttonText: {
        color: "#ffffff",

        fontSize: 14,

        fontWeight: "600",
    },

});