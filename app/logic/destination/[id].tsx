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
    Alert,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";


const { height } = Dimensions.get("window");


/* =========================================================
   DADOS
========================================================= */

const destinations: Record<string, any> = {

    "torre-eiffel": {
        title: "Torre Eiffel",
        location: "Paris, França",

        image: require(
            "../../../assets/images/torreeiffel.jpg"
        ),

        description:
            "Conheça um dos monumentos mais famosos do mundo e aproveite a atmosfera encantadora de Paris.",

        price: "R$300,00",

        rating: "★★★★☆",

        ratingText: "4.8 Avaliação",
    },


    "coliseu": {
        title: "Coliseu",
        location: "Roma, Itália",

        image: require(
            "../../../assets/images/coliseu.jpg"
        ),

        description:
            "Explore um dos maiores símbolos da Roma Antiga e conheça de perto sua história milenar.",

        price: "R$280,00",

        rating: "★★★★★",

        ratingText: "4.9 Avaliação",
    },


    "big-ben": {
        title: "Big Ben",
        location: "Londres, Inglaterra",

        image: require(
            "../../../assets/images/bigben.jpg"
        ),

        description:
            "Visite um dos principais símbolos de Londres e descubra a história e a cultura britânica.",

        price: "R$350,00",

        rating: "★★★★☆",

        ratingText: "4.7 Avaliação",
    },


    "estatua-liberdade": {
        title: "Estátua da Liberdade",
        location: "Nova York, EUA",

        image: require(
            "../../../assets/images/libertystatue.jpg"
        ),

        description:
            "Conheça um dos maiores símbolos dos Estados Unidos e admire a vista de Nova York.",

        price: "R$420,00",

        rating: "★★★★★",

        ratingText: "4.8 Avaliação",
    },


    "cristo-redentor": {
        title: "Cristo Redentor",
        location: "Rio de Janeiro, Brasil",

        image: require(
            "../../../assets/images/cristo.jpg"
        ),

        description:
            "Visite um dos cartões-postais mais famosos do Brasil e aproveite uma vista incrível do Rio de Janeiro.",

        price: "R$180,00",

        rating: "★★★★★",

        ratingText: "4.9 Avaliação",
    },


    "burj-khalifa": {
        title: "Burj Khalifa",
        location: "Dubai, Emirados Árabes",

        image: require(
            "../../../assets/images/burjkhalifa.jpg"
        ),

        description:
            "Conheça o edifício mais alto do mundo e tenha uma experiência inesquecível em Dubai.",

        price: "R$500,00",

        rating: "★★★★★",

        ratingText: "4.9 Avaliação",
    },


    santorini: {
        title: "Santorini",
        location: "Santorini, Grécia",

        image: require(
            "../../../assets/images/santorini.jpg"
        ),

        description:
            "Descubra as paisagens paradisíacas, casas brancas e o famoso pôr do sol de Santorini.",

        price: "R$450,00",

        rating: "★★★★★",

        ratingText: "4.9 Avaliação",
    },


    "taj-mahal": {
        title: "Taj Mahal",
        location: "Agra, Índia",

        image: require(
            "../../../assets/images/tajmahal.jpg"
        ),

        description:
            "Conheça uma das construções mais impressionantes da Índia e um dos monumentos mais famosos do mundo.",

        price: "R$380,00",

        rating: "★★★★★",

        ratingText: "4.8 Avaliação",
    },


    "machu-picchu": {
        title: "Machu Picchu",
        location: "Machu Picchu, Peru",

        image: require(
            "../../../assets/images/machupicchu.jpg"
        ),

        description:
            "Explore as antigas ruínas incas cercadas pelas impressionantes montanhas dos Andes.",

        price: "R$550,00",

        rating: "★★★★★",

        ratingText: "4.9 Avaliação",
    },


    sydney: {
        title: "Sydney",
        location: "Sydney, Austrália",

        image: require(
            "../../../assets/images/sydney.jpg"
        ),

        description:
            "Conheça uma das cidades mais famosas da Austrália, com belas praias, arquitetura e paisagens.",

        price: "R$600,00",

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


    if (!destination) {

        return (

            <View style={styles.errorContainer}>

                <Text style={styles.errorText}>
                    Destino não encontrado.
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
                backgroundColor="#111111"
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
                        source={
                            destination.image
                        }

                        style={styles.heroImage}

                        resizeMode="cover"
                    />


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

                        <View
                            style={[
                                styles.dot,
                                styles.dotActive,
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
                        {destination.location}
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
                                    styles.price
                                }
                            >
                                {destination.price}
                            </Text>


                            <Text
                                style={
                                    styles.perPerson
                                }
                            >
                                Por Pessoa
                            </Text>

                        </View>


                        <Pressable
                            style={
                                styles.routeButton
                            }

                            onPress={() =>
                                Alert.alert(
                                    "Axis",
                                    `${destination.title} foi adicionado ao roteiro!`
                                )
                            }
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

        height:
            Math.min(
                height * 0.54,
                470
            ),

        position: "relative",
    },

    heroImage: {
        width: "100%",

        height: "100%",
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

        top: 18,

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

        paddingHorizontal: 22,

        paddingTop: 24,

        paddingBottom: 28,
    },

    title: {
        fontSize: 23,

        fontWeight: "800",

        color: "#303030",
    },

    location: {
        marginTop: 5,

        fontSize: 11,

        color: "#777777",
    },

    description: {
        marginTop: 17,

        fontSize: 12,

        lineHeight: 18,

        color: "#777777",
    },


    /* RATING */

    rating: {
        flexDirection: "row",

        alignItems: "center",

        marginTop: 19,
    },

    stars: {
        fontSize: 15,

        color: "#333333",

        letterSpacing: 1,
    },

    ratingText: {
        marginLeft: 10,

        fontSize: 10,

        color: "#555555",
    },


    /* BOTTOM */

    bottom: {
        marginTop: 58,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",
    },

    price: {
        fontSize: 17,

        fontWeight: "800",

        color: "#303030",
    },

    perPerson: {
        marginTop: 3,

        fontSize: 9,

        color: "#999999",
    },

    routeButton: {
        minWidth: 150,

        height: 43,

        paddingHorizontal: 16,

        borderRadius: 23,

        backgroundColor: "#000000",

        alignItems: "center",

        justifyContent: "center",
    },

    routeButtonText: {
        color: "#ffffff",

        fontSize: 10,

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

    backText: {
        marginTop: 20,

        color: "#555555",

        fontWeight: "700",
    },

});