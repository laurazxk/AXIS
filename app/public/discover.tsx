import React from "react";

import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { router } from "expo-router";

export default function Discover() {
    return (
        <ImageBackground
            source={require("../../assets/images/france.jpg")}
            style={styles.container}
            resizeMode="cover"
        >

            {/* Escurece um pouco a imagem para facilitar a leitura */}
            <View style={styles.overlay} />

            <View style={styles.bottomCard}>

                <Text style={styles.title}>
                    Descubra os melhores lugares
                    ao redor do mundo
                </Text>

                <Text style={styles.description}>
                    Planeje, organize e viva experiências
                    inesquecíveis em grupo.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push("/public/plan")}
                >
                    <Text style={styles.buttonText}>
                        Começar
                    </Text>
                </TouchableOpacity>

            </View>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "flex-end",
    },

    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.30)",
    },

    bottomCard: {
        paddingHorizontal: 28,
        paddingBottom: 50,
        paddingTop: 30,
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        lineHeight: 34,
        marginBottom: 14,
        color: "#FFFFFF",
    },

    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 28,
        color: "#FFFFFF",
    },

    button: {
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },

    buttonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "700",
    },

});
