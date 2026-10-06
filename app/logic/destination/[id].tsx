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
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { tripDraft } from "../trips/tripDraft";


const { width, height } = Dimensions.get("window");


/* =========================================================
   DADOS
========================================================= */

const destinations: Record<string, any> = {

    "torre-eiffel": {
        title: "Torre Eiffel",

        city: "Paris",

        country: "França",

        countryCode: "FR",

        currency: "EUR",

        images: [
            require("../../../assets/images/torreeiffel1.jpg"),
            require("../../../assets/images/torreeiffel2.jpg"),
            require("../../../assets/images/torreeiffel3.jpg"),
        ],

        description:
            "Explore Paris, uma cidade repleta de história, cultura e charme, conhecida por seus cafés, ruas encantadoras e pela icônica Torre Eiffel.",

        rating: "★★★★☆",

        ratingText: "4.8 Avaliação",
    },


    "coliseu": {
        title: "Coliseu",

        city: "Roma",

        country: "Itália",

        countryCode: "IT",

        currency: "EUR",

        images: [
            require("../../../assets/images/coliseu1.jpg"),
            require("../../../assets/images/coliseu2.jpg"),
            require("../../../assets/images/coliseu3.jpg"),
        ],

        description:
            "Conheça Roma, uma cidade marcada pela história, arquitetura e cultura, com lugares incríveis como o Coliseu e o Fórum Romano.",


        rating: "★★★★★",

        ratingText: "4.9 Avaliação",
    },


    "big-ben": {
        title: "Big Ben",

        city: "Londres",

        country: "Reino Unido",

        countryCode: "GB",

        currency: "GBP",

        images: [
            require("../../../assets/images/bigben1.jpg"),
            require("../../../assets/images/bigben2.jpg"),
            require("../../../assets/images/bigben3.jpg"),
        ],

        description:
            "Descubra Londres, uma cidade vibrante que combina história, cultura e modernidade, com atrações como o Big Ben e o Palácio de Westminster.",


        rating: "★★★★☆",

        ratingText: "4.7 Avaliação",
    },


    "estatua-liberdade": {
        title: "Estátua da Liberdade",

        city: "Nova York",

        country: "Estados Unidos",

        countryCode: "US",

        currency: "USD",

        images: [
            require("../../../assets/images/libertystatue1.jpg"),
            require("../../../assets/images/libertystatue2.jpg"),
            require("../../../assets/images/libertystatue3.jpg"),
        ],

        description:
            "Explore Nova York, uma cidade cheia de energia, cultura e atrações famosas, como a Estátua da Liberdade, a Times Square e o Central Park.",


        rating: "★★★★★",

        ratingText: "4.8 Avaliação",
    },


    "cristo-redentor": {
        title: "Cristo Redentor",

        city: "Rio de Janeiro",

        country: "Brasil",

        countryCode: "BR",

        currency: "BRL",

        images: [
            require("../../../assets/images/cristo1.jpg"),
            require("../../../assets/images/cristo2.jpg"),
            require("../../../assets/images/cristo3.jpg"),
        ],

        description:
            "Conheça o Rio de Janeiro, famoso por suas praias, paisagens e cultura, com destaque para o Cristo Redentor e o Pão de Açúcar.",


        rating: "★★★★★",

        ratingText: "4.9 Avaliação",
    },


    "burj-khalifa": {
        title: "Burj Khalifa",

        city: "Dubai",

        country: "Emirados Árabes",

        countryCode: "AE",

        currency: "AED",

        images: [
            require("../../../assets/images/burjkhalifa1.jpg"),
            require("../../../assets/images/burjkhalifa2.jpg"),
            require("../../../assets/images/burjkhalifa3.jpg"),
        ],

        description:
            "Descubra Dubai, uma cidade moderna e impressionante, conhecida por sua arquitetura, praias, compras e pelo enorme Burj Khalifa.",


        rating: "★★★★★",

        ratingText: "4.9 Avaliação",
    },


    santorini: {
        title: "Santorini",

        city: "Santorini",

        country: "Grécia",

        countryCode: "GR",

        currency: "EUR",

        images: [
            require("../../../assets/images/santorini1.jpg"),
            require("../../../assets/images/santorini2.jpg"),
            require("../../../assets/images/santorini3.jpg"),
        ],

        description:
            "Explore Santorini, uma ilha grega conhecida por suas casas brancas, paisagens sobre o mar e pôr do sol inesquecível.",


        rating: "★★★★★",

        ratingText: "4.9 Avaliação",
    },


    "taj-mahal": {
        title: "Taj Mahal",

        city: "Agra",

        country: "Índia",

        countryCode: "IN",

        currency: "INR",

        images: [
            require("../../../assets/images/tajmahal1.jpg"),
            require("../../../assets/images/tajmahal2.jpg"),
            require("../../../assets/images/tajmahal3.jpg"),
        ],

        description:
            "Conheça Agra, uma cidade histórica da Índia que guarda importantes monumentos, com destaque para o grandioso Taj Mahal.",


        rating: "★★★★★",

        ratingText: "4.8 Avaliação",
    },


    "machu-picchu": {
        title: "Machu Picchu",

        city: "Machu Picchu",

        country: "Peru",

        countryCode: "PE",

        currency: "PEN",

        images: [
            require("../../../assets/images/machupicchu1.jpg"),
            require("../../../assets/images/machupicchu2.jpg"),
            require("../../../assets/images/machupicchu3.jpg"),
        ],

        description:
            "Explore Machu Picchu, um dos destinos mais impressionantes do Peru, cercado pelas montanhas dos Andes e pela história dos povos incas.",

        rating: "★★★★★",

        ratingText: "4.9 Avaliação",
    },


    sydney: {
        title: "Sydney",

        city: "Sydney",

        country: "Austrália",

        countryCode: "AU",

        currency: "AUD",

        images: [
            require("../../../assets/images/sydney1.jpg"),
            require("../../../assets/images/sydney2.jpg"),
            require("../../../assets/images/sydney3.jpg"),
        ],

        description:
            "Descubra Sydney, uma das cidades mais famosas da Austrália, com praias, cultura, arquitetura e atrações como a Ópera de Sydney.",


        rating: "★★★★☆",

        ratingText: "4.7 Avaliação",
    },

};


/* =========================================================
   TELA
========================================================= */

export default function DestinationScreen() {

    const router = useRouter();

    const params =
        useLocalSearchParams();

    const id =
        String(params.id || "torre-eiffel");

    const destination =
        destinations[id];


    const [currentImage, setCurrentImage] =
        useState(0);


    if (!destination) {

        return (

            <View style={styles.errorContainer}>

                <Text style={styles.errorText}>
                    Destino não encontrado.
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


    return (

        <View style={styles.container}>

            <StatusBar
                barStyle="light-content"
                backgroundColor="#111111"
            />


            <ScrollView
                showsVerticalScrollIndicator={false}

                contentContainerStyle={
                    styles.scrollContent
                }
            >


                {/* =================================================
                    CARROSSEL
                ================================================= */}

                <View style={styles.hero}>


                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        nestedScrollEnabled

                        onMomentumScrollEnd={(event) => {

                            const index =
                                Math.round(
                                    event.nativeEvent
                                        .contentOffset.x /
                                    width
                                );

                            setCurrentImage(index);
                        }}

                        style={styles.heroCarousel}
                    >

                        {destination.images.map(
                            (image: any, index: number) => (

                                <Image
                                    key={index}

                                    source={image}

                                    style={
                                        styles.heroImage
                                    }

                                    resizeMode="cover"
                                />

                            )
                        )}

                    </ScrollView>


                    {/* GRADIENTE */}

                    <LinearGradient
                        colors={[
                            "rgba(0,0,0,0.20)",
                            "rgba(0,0,0,0.00)",
                        ]}

                        style={
                            styles.heroGradient
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


                    {/* PONTOS */}

                    <View style={styles.dots}>

                        {destination.images.map(
                            (_: any, index: number) => (

                                <View
                                    key={index}

                                    style={[
                                        styles.dot,

                                        index === currentImage &&
                                            styles.dotActive,
                                    ]}
                                />

                            )
                        )}

                    </View>

                </View>


                {/* =================================================
                    INFORMAÇÕES
                ================================================= */}

                <View
                    style={
                        styles.details
                    }
                >

                    <Text
                        style={styles.title}
                    >
                        {destination.title}
                    </Text>


                    <Text
                        style={
                            styles.location
                        }
                    >
                        {destination.city},{" "}
                        {destination.country}
                    </Text>


                    <Text
                        style={
                            styles.description
                        }
                    >
                        {destination.description}
                    </Text>


                    {/* AVALIAÇÃO */}

                    <View
                        style={
                            styles.rating
                        }
                    >

                        <Text
                            style={
                                styles.stars
                            }
                        >
                            {destination.rating}
                        </Text>


                        <Text
                            style={
                                styles.ratingText
                            }
                        >
                            {destination.ratingText}
                        </Text>

                    </View>


                    {/* PREÇO / BOTÃO */}

                    <View
                        style={
                            styles.bottom
                        }
                    >

                        <View>

                            


                            <Text
                                style={
                                    styles.perPerson
                                }
                            >
                                Por Pessoa
                            </Text>

                        </View>


                        {/* =================================================
                            ADICIONAR AO ROTEIRO
                        ================================================= */}

                        <Pressable
                            style={
                                styles.routeButton
                            }

                            onPress={() => {

                                /*
                                 * IMPORTANTE:
                                 *
                                 * Aqui não salvamos o nome
                                 * do ponto turístico.
                                 *
                                 * Exemplo:
                                 * Torre Eiffel -> Paris
                                 *
                                 * Assim, a tela "Nova Viagem"
                                 * recebe uma cidade válida
                                 * do catálogo.
                                 */

                                tripDraft.destination =
                                    destination.city;

                                tripDraft.country =
                                    destination.country;

                                tripDraft.countryCode =
                                    destination.countryCode;

                                tripDraft.localCurrency =
                                    destination.currency;

                                router.push(
                                    "/logic/trips/create"
                                );

                            }}
                        >

                            <Text
                                style={
                                    styles.routeButtonText
                                }
                            >
                                Adicionar ao roteiro
                            </Text>

                        </Pressable>

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

        backgroundColor: "#111111",
    },

    scrollContent: {
        paddingBottom: 0,
    },


    /* HERO */

    hero: {
        width: "100%",

        height: height * 0.54,

        position: "relative",
    },

    heroCarousel: {
        width: "100%",

        height: "100%",
    },

    heroImage: {
        width: width,

        height: "110%",
    },

    heroGradient: {
        position: "absolute",

        left: 0,
        right: 0,
        top: 0,

        height: 180,
    },


    /* VOLTAR */

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
            "rgba(0,0,0,0.18)",
    },


    /* DOTS */

    dots: {
        position: "absolute",

        bottom: 18,

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
            "rgba(255,255,255,0.55)",
    },

    dotActive: {
        backgroundColor: "#ffffff",
    },


    /* DETALHES */

    details: {
        backgroundColor: "#f7f7f7",

        marginTop: -2,

        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,

        paddingHorizontal: 42,
        paddingTop: 45,
        paddingBottom: 45,
    },

    title: {
        fontSize: 29,

        fontWeight: "800",

        color: "#303030",
    },

    location: {
        marginTop: 8,

        fontSize: 14,

        color: "#777777",
    },

    description: {
        marginTop: 28,

        fontSize: 16,

        lineHeight: 24,

        color: "#777777",
    },


    /* RATING */

    rating: {
        flexDirection: "row",

        alignItems: "center",

        marginTop: 28,
    },

    stars: {
        fontSize: 20,

        color: "#333333",

        letterSpacing: 1,
    },

    ratingText: {
        marginLeft: 14,

        fontSize: 15,

        color: "#555555",
    },


    /* BOTTOM */

    bottom: {
        marginTop: 60,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",
    },

   

    perPerson: {
        marginTop: 4,

        fontSize: 14,

        color: "#999999",
    },

    routeButton: {
        minWidth: 150,

        height: 58,

        paddingHorizontal: 15,

        borderRadius: 30,

        backgroundColor: "#000000",

        alignItems: "center",

        justifyContent: "center",
    },

    routeButtonText: {
        color: "#ffffff",

        fontSize: 15,

        fontWeight: "600",
    },


    /* ERROR */

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



