import { useAxisTheme } from "../../../contexts/ThemeContext";
import { glassColor, glassDecoration, type GlassPalette } from "../../../constants/glass";
import GlassBackdrop from "../../../components/GlassBackdrop";
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
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);


    const router = useRouter();
    
    const insets = useSafeAreaInsets();

    const [code, setCode] = useState("");

    return (

        <View style={styles.container}>
            <GlassBackdrop />

    <StatusBar
        barStyle={axisDarkMode ? "light-content" : "dark-content"}
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
                            color={axisPalette.text}
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
                            color={axisPalette.accentText}
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
                        placeholderTextColor={axisPalette.muted}
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
                            color={axisPalette.accentText}
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

const createStyles = (palette: GlassPalette) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
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

        color: glassColor("color", "#8492a8", "headerTitle", palette),
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

        backgroundColor: glassColor("backgroundColor", "#a7a7a7", "iconCircle", palette),

        alignItems: "center",
        justifyContent: "center",

        marginBottom: 24,
    },


    title: {
        textAlign: "center",

        fontSize: 24,

        lineHeight: 30,

        fontWeight: "800",

        color: glassColor("color", "#303030", "title", palette),

        marginBottom: 12,
    },


    description: {
        textAlign: "center",

        fontSize: 13,

        lineHeight: 20,

        color: glassColor("color", "#888888", "description", palette),

        marginBottom: 30,
    },


    input: {
        width: "100%",

        height: 54,

        backgroundColor: glassColor("backgroundColor", "#ffffff", "input", palette),

        borderRadius: 27,

        paddingHorizontal: 22,

        fontSize: 15,

        color: glassColor("color", "#303030", "input", palette),

        textAlign: "center",

        letterSpacing: 2,

        shadowColor: glassColor("shadowColor", "#000000", "input", palette),

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

        backgroundColor: glassColor("backgroundColor", "#000000", "button", palette),

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
        color: glassColor("color", "#ffffff", "buttonText", palette),

        fontSize: 14,

        fontWeight: "600",
    },

});