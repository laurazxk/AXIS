import React from "react";

import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
    StatusBar,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";


const { height } = Dimensions.get("window");


/* =========================================================
   PAÍSES
========================================================= */

const countries: Record<string, any> = {

    franca: {
        title: "VISITE A",
        country: "FRANÇA",

        description:
            "Descubra a arte, a cultura e a história em um só lugar. Explore Paris, seus monumentos, museus e a famosa gastronomia francesa.",

        image: require(
            "../../../assets/images/france.jpg"
        ),
    },


    japao: {
        title: "VISITE O",
        country: "JAPÃO",

        description:
            "Descubra o futuro e a tradição em um só lugar. Conheça templos históricos, cidades modernas e paisagens incríveis.",

        image: require(
            "../../../assets/images/japan.jpg"
        ),
    },


    italia: {
        title: "VISITE A",
        country: "ITÁLIA",

        description:
            "Descubra história, cultura e sabores em um só lugar. Explore cidades históricas, monumentos e a famosa culinária italiana.",

        image: require(
            "../../../assets/images/italy.jpg"
        ),
    },


    espanha: {
        title: "VISITE A",
        country: "ESPANHA",

        description:
            "Descubra a cultura, a arquitetura e as belas paisagens da Espanha. Conheça cidades vibrantes, praias e monumentos históricos.",

        image: require(
            "../../../assets/images/spain.jpg"
        ),
    },


    portugal: {
        title: "VISITE",
        country: "PORTUGAL",

        description:
            "Descubra cidades históricas, belas paisagens e a cultura portuguesa. Explore lugares encantadores e conheça a gastronomia local.",

        image: require(
            "../../../assets/images/portugal.jpg"
        ),
    },


    eua: {
        title: "VISITE OS",
        country: "ESTADOS UNIDOS",

        description:
            "Descubra grandes cidades, paisagens incríveis e atrações famosas. Conheça lugares como Nova York, Los Angeles e Las Vegas.",

        image: require(
            "../../../assets/images/usa.jpg"
        ),
    },


    "reino-unido": {
        title: "VISITE O",
        country: "REINO UNIDO",

        description:
            "Descubra a história, a cultura e as paisagens do Reino Unido. Explore Londres e seus famosos monumentos.",

        image: require(
            "../../../assets/images/uk.jpg"
        ),
    },


    coreia: {
        title: "VISITE A",
        country: "COREIA DO SUL",

        description:
            "Descubra uma mistura de tradição e modernidade. Conheça a cultura, a gastronomia e as grandes cidades sul-coreanas.",

        image: require(
            "../../../assets/images/sk.jpg"
        ),
    },


    grecia: {
        title: "VISITE A",
        country: "GRÉCIA",

        description:
            "Descubra ilhas paradisíacas, construções históricas e paisagens incríveis. Explore lugares como Santorini e Atenas.",

        image: require(
            "../../../assets/images/greece.jpg"
        ),
    },


    suica: {
        title: "VISITE A",
        country: "SUÍÇA",

        description:
            "Descubra montanhas, lagos e cidades encantadoras. A Suíça combina paisagens naturais impressionantes com paisagens incríveis.",

        image: require(
            "../../../assets/images/switzerland.jpg"
        ),
    },

};


/* =========================================================
   TELA
========================================================= */

export default function CountryScreen() {

    const router = useRouter();

    const params =
        useLocalSearchParams();

    const id =
        String(params.id || "japao");

    const country =
        countries[id];


    if (!country) {

        return (

            <View style={styles.errorContainer}>

                <Text style={styles.errorText}>
                    País não encontrado.
                </Text>
<Pressable
    style={styles.backButton}
    onPress={() => router.replace("/logic/home")}
>
    <MaterialIcons
        name="arrow-back"
        size={25}
        color="#ffffff"
    />
</Pressable>

            </View>
        );
    }


    return (

        <View style={styles.container}>

            <StatusBar
                barStyle="light-content"
                backgroundColor="#000000"
            />


            <ScrollView
                showsVerticalScrollIndicator={false}

                contentContainerStyle={
                    styles.scrollContent
                }
            >

                {/* =================================================
                    IMAGEM
                ================================================= */}

                <View style={styles.hero}>

                    <Image
                        source={country.image}

                        style={styles.image}

                        resizeMode="cover"
                    />


                    {/* ESCURECIMENTO */}

                    <LinearGradient
                        colors={[
                            "rgba(0,0,0,0.05)",
                            "rgba(0,0,0,0.80)",
                        ]}

                        style={
                            styles.overlay
                        }
                    />


                    {/* VOLTAR */}

                    <Pressable
                        style={styles.backButton}

                        onPress={() =>
                            router.back()
                        }
                    >

                        <MaterialIcons
                            name="arrow-back"
                            size={25}
                            color="#ffffff"
                        />

                    </Pressable>


                    {/* TEXTO */}

                    <View
                        style={
                            styles.countryText
                        }
                    >

                        <Text
                            style={
                                styles.visitText
                            }
                        >
                            {country.title}
                        </Text>


                        <Text
                            style={
                                styles.countryName
                            }
                        >
                            {country.country}
                        </Text>


                        <Text
                            style={
                                styles.description
                            }
                        >
                            {country.description}
                        </Text>

                    </View>


                    {/* DOTS */}

                    <View
                        style={styles.dots}
                    >

                        <View
                            style={[
                                styles.dot,
                                styles.activeDot,
                            ]}
                        />

                        <View
                            style={styles.dot}
                        />

                        <View
                            style={styles.dot}
                        />

                        <View
                            style={styles.dot}
                        />

                        <View
                            style={styles.dot}
                        />

                    </View>

                </View>

            </ScrollView>

        </View>
    );
}


/* =========================================================
   ESTILOS
========================================================= */

const styles = StyleSheet.create({

    container: {
        flex: 1,

        backgroundColor: "#000000",
    },

    scrollContent: {
        flexGrow: 1,
    },


    hero: {
        width: "100%",

        height:
            Math.max(
                height,
                650
            ),

        position: "relative",
    },

    image: {
        width: "100%",

        height: "100%",
    },

    overlay: {
        position: "absolute",

        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },


    /* VOLTAR */

    backButton: {
        position: "absolute",

        top: 18,

        left: 16,

        width: 42,

        height: 42,

        borderRadius: 21,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor:
            "rgba(0,0,0,0.16)",
    },


    /* TEXTO */

    countryText: {
        position: "absolute",

        left: 30,

        right: 30,

        bottom: 82,
    },

    visitText: {
        color: "#ffffff",

        fontSize: 30,

        fontWeight: "800",

        lineHeight: 32,
    },

    countryName: {
        color: "#ffffff",

        fontSize: 39,

        fontWeight: "800",

        lineHeight: 42,

        marginTop: 2,
    },

    description: {
        color:
            "rgba(255,255,255,0.90)",

        fontSize: 13,

        lineHeight: 20,

        marginTop: 17,

        maxWidth: 290,
    },


    /* DOTS */

    dots: {
        position: "absolute",

        bottom: 35,

        left: 0,

        right: 0,

        flexDirection: "row",

        justifyContent: "center",

        gap: 6,
    },

    dot: {
        width: 6,

        height: 6,

        borderRadius: 3,

        backgroundColor:
            "rgba(255,255,255,0.45)",
    },

    activeDot: {
        backgroundColor: "#ffffff",
    },


    /* ERRO */

    errorContainer: {
        flex: 1,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: "#f7f7f7",
    },

    errorText: {
        fontSize: 18,

        color: "#333333",
    },

    backText: {
        marginTop: 20,

        color: "#555555",

        fontWeight: "700",
    },

});