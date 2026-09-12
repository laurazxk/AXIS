import React, { useState } from "react";

import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
    StatusBar,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";


const { height, width } = Dimensions.get("window");


/* =========================================================
   PAÍSES
========================================================= */

const countries: Record<string, any> = {

    franca: {
        title: "VISITE A",
        country: "FRANÇA",

        description:
            "Descubra a arte, a cultura e a história em um só lugar. Explore Paris, seus monumentos, museus e a famosa gastronomia francesa.",

        images: [
            require("../../../assets/images/france1.jpg"),
            require("../../../assets/images/france2.jpg"),
            require("../../../assets/images/france3.jpg"),
        ],
    },


    japao: {
        title: "VISITE O",
        country: "JAPÃO",

        description:
            "Descubra o futuro e a tradição em um só lugar. Conheça templos históricos, cidades modernas e paisagens incríveis.",

        images: [
            require("../../../assets/images/japan1.jpg"),
            require("../../../assets/images/japan2.jpg"),
            require("../../../assets/images/japan3.jpg"),
        ],
    },


    italia: {
        title: "VISITE A",
        country: "ITÁLIA",

        description:
            "Descubra história, cultura e sabores em um só lugar. Explore cidades históricas, monumentos e a famosa culinária italiana.",

        images: [
            require("../../../assets/images/italy1.jpg"),
            require("../../../assets/images/italy2.jpg"),
            require("../../../assets/images/italy3.jpg"),
        ],
    },


    espanha: {
        title: "VISITE A",
        country: "ESPANHA",

        description:
            "Descubra a cultura, a arquitetura e as belas paisagens da Espanha. Conheça cidades vibrantes, praias e monumentos históricos.",

        images: [
            require("../../../assets/images/spain1.jpg"),
            require("../../../assets/images/spain2.jpg"),
            require("../../../assets/images/spain3.jpg"),
        ],
    },


    portugal: {
        title: "VISITE",
        country: "PORTUGAL",

        description:
            "Descubra cidades históricas, belas paisagens e a cultura portuguesa. Explore lugares encantadores e conheça a gastronomia local.",

        images: [
            require("../../../assets/images/portugal1.jpg"),
            require("../../../assets/images/portugal2.jpg"),
            require("../../../assets/images/portugal3.jpg"),
        ],
    },


    eua: {
        title: "VISITE OS",
        country: "ESTADOS UNIDOS",

        description:
            "Descubra grandes cidades, paisagens incríveis e atrações famosas. Conheça lugares como Nova York, Los Angeles e Las Vegas.",

        images: [
            require("../../../assets/images/usa1.jpg"),
            require("../../../assets/images/usa2.jpg"),
            require("../../../assets/images/usa3.jpg"),
        ],
    },


    "reino-unido": {
        title: "VISITE O",
        country: "REINO UNIDO",

        description:
            "Descubra a história, a cultura e as paisagens do Reino Unido. Explore Londres e seus famosos monumentos.",

        images: [
            require("../../../assets/images/uk1.jpg"),
            require("../../../assets/images/uk2.jpg"),
            require("../../../assets/images/uk3.jpg"),
        ],
    },


    coreia: {
        title: "VISITE A",
        country: "COREIA DO SUL",

        description:
            "Descubra uma mistura de tradição e modernidade. Conheça a cultura, a gastronomia e as grandes cidades sul-coreanas.",

        images: [
            require("../../../assets/images/sk1.jpg"),
            require("../../../assets/images/sk2.jpg"),
            require("../../../assets/images/sk3.jpg"),
        ],
    },


    grecia: {
        title: "VISITE A",
        country: "GRÉCIA",

        description:
            "Descubra ilhas paradisíacas, construções históricas e paisagens incríveis. Explore lugares como Santorini e Atenas.",

        images: [
            require("../../../assets/images/greece1.jpg"),
            require("../../../assets/images/greece2.jpg"),
            require("../../../assets/images/greece3.jpg"),
        ],
    },


    suica: {
        title: "VISITE A",
        country: "SUÍÇA",

        description:
            "Descubra montanhas, lagos e cidades encantadoras. A Suíça combina paisagens naturais impressionantes com paisagens incríveis.",

        images: [
            require("../../../assets/images/switzerland1.jpg"),
            require("../../../assets/images/switzerland2.jpg"),
            require("../../../assets/images/switzerland3.jpg"),
        ],
    },

};


/* =========================================================
   TELA
========================================================= */

export default function CountryScreen() {

    const router = useRouter();

    const params = useLocalSearchParams();

    const id = String(params.id || "japao");

    const country = countries[id];


    // Controla a imagem atual
    const [activeImage, setActiveImage] = useState(0);


    if (!country) {

        return (

            <View style={styles.errorContainer}>

                <Text style={styles.errorText}>
                    País não encontrado.
                </Text>

                <Pressable
                    style={styles.backButton}
                    onPress={() =>
                        router.replace("/logic/home")
                    }
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


    /* =========================================================
       DETECTA QUAL IMAGEM ESTÁ APARECENDO
    ========================================================= */

    const handleScroll = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {

        const offsetX =
            event.nativeEvent.contentOffset.x;

        const index =
            Math.round(offsetX / width);

        setActiveImage(index);
    };


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
                    IMAGENS / CARROSSEL
                ================================================= */}

                <View style={styles.hero}>

                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        style={styles.imageSlider}
                    >

                        {country.images.map(
                            (image: any, index: number) => (

                                <Image
                                    key={index}
                                    source={image}
                                    style={styles.image}
                                    resizeMode="cover"
                                />

                            )
                        )}

                    </ScrollView>


                    {/* =================================================
                        GRADIENTE
                    ================================================= */}

                    <LinearGradient
                        pointerEvents="none"
                        colors={[
                            "rgba(0,0,0,0.05)",
                            "rgba(0,0,0,0.80)",
                        ]}
                        style={styles.overlay}
                    />


                    {/* =================================================
                        BOTÃO VOLTAR
                    ================================================= */}

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


                    {/* =================================================
                        TEXTO
                    ================================================= */}

                    <View
                        style={styles.countryText}
                    >

                        <Text
                            style={styles.visitText}
                        >
                            {country.title}
                        </Text>


                        <Text
                            style={styles.countryName}
                        >
                            {country.country}
                        </Text>


                        <Text
                            style={styles.description}
                        >
                            {country.description}
                        </Text>

                    </View>


                    {/* =================================================
                        PONTINHOS
                    ================================================= */}

                    <View style={styles.dots}>

                        {country.images.map(
                            (_: any, index: number) => (

                                <View
                                    key={index}
                                    style={[
                                        styles.dot,

                                        index === activeImage &&
                                            styles.activeDot,
                                    ]}
                                />

                            )
                        )}

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


    imageSlider: {
        width: "100%",
        height: "100%",
    },


    image: {
        width: width,
        height: "100%",
    },


    overlay: {
        position: "absolute",

        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },


    /* =================================================
       VOLTAR
    ================================================= */

    backButton: {
        position: "absolute",

        top: 50,

        left: 16,

        width: 42,

        height: 42,

        borderRadius: 21,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor:
            "rgba(0,0,0,0.16)",
    },


    /* =================================================
       TEXTO
    ================================================= */

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


    /* =================================================
       PONTINHOS
    ================================================= */

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


    /* =================================================
       ERRO
    ================================================= */

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

});