import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";


const interests = [
    "Cultura",
    "Gastronomia",
    "Praia",
    "Natureza",
    "História",
    "Compras",
    "Vida noturna",
    "Fotografia",
];


export default function Preferences() {

    const router = useRouter();

    const insets = useSafeAreaInsets();

    const [selected, setSelected] = useState<string[]>([]);


    function toggleInterest(item: string) {

        if (selected.includes(item)) {

            setSelected(
                selected.filter(
                    interest => interest !== item
                )
            );

        } else {

            setSelected([
                ...selected,
                item,
            ]);

        }

    }


    return (

        <View style={styles.container}>

<ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={[
        styles.content,
        {
            paddingTop: insets.top + 8,
        },
    ]}
>

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

                


                <Text style={styles.step}>
                    2 DE 4
                </Text>


                <Text style={styles.title}>
                    O que você pretende fazer?
                </Text>


                <Text style={styles.subtitle}>
                    Selecione seus interesses para
                    personalizarmos sua viagem.
                </Text>


                <View style={styles.interests}>

                    {interests.map((item) => {

                        const active =
                            selected.includes(item);

                        return (

                            <Pressable
                                key={item}
                                onPress={() =>
                                    toggleInterest(item)
                                }
                                style={[
                                    styles.interest,
                                    active &&
                                    styles.interestActive,
                                ]}
                            >

                                <Text
                                    style={[
                                        styles.interestText,
                                        active &&
                                        styles.interestTextActive,
                                    ]}
                                >
                                    {item}
                                </Text>

                            </Pressable>

                        );

                    })}

                </View>


                <Pressable
    style={styles.button}
    onPress={() => {
        console.log("CLICOU NO CONTINUAR");
        router.push("/logic/trips/budget");
    }}
>
    <Text style={styles.buttonText}>
        Continuar
    </Text>

    <MaterialIcons
        name="arrow-forward"
        size={20}
        color="#ffffff"
    />
</Pressable>

            </ScrollView>

        </View>

    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },

    content: {
        paddingHorizontal: 28,
        paddingBottom: 50,
    },

    backButton: {
        width: 42,
        height: 42,
        marginTop: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    step: {
        marginTop: 28,
        fontSize: 11,
        fontWeight: "700",
        color: "#8492a8",
        letterSpacing: 1,
    },

    title: {
        marginTop: 10,
        fontSize: 29,
        lineHeight: 35,
        fontWeight: "800",
        color: "#303030",
    },

    subtitle: {
        marginTop: 10,
        fontSize: 14,
        lineHeight: 21,
        color: "#888888",
    },

    interests: {
        marginTop: 32,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },

    interest: {
        paddingHorizontal: 18,
        height: 42,
        borderRadius: 22,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
    },

    interestActive: {
        backgroundColor: "#303030",
    },

    interestText: {
        fontSize: 13,
        color: "#555555",
        fontWeight: "600",
    },

    interestTextActive: {
        color: "#ffffff",
    },

    button: {
        height: 56,
        marginTop: 50,
        borderRadius: 28,
        backgroundColor: "#303030",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },

});