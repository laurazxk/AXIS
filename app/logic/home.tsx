import React, { useMemo, useState } from "react";

import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    StatusBar,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import GlassBottomNav from "../../components/GlassBottomNav";


/* =========================================================
   DESTINOS
========================================================= */

const destinations = [

    {
        id: "torre-eiffel",
        title: "Torre Eiffel",
        location: "Paris, França",
        category: "Cidade",
        image: require("../../assets/images/torreeiffel.jpg"),
    },

    {
        id: "coliseu",
        title: "Coliseu",
        location: "Coliseu, Itália",
        category: "Ponto Turístico",
        image: require("../../assets/images/coliseu.jpg"),
    },

    {
        id: "big-ben",
        title: "Big Ben",
        location: "Londres, Inglaterra",
        category: "Cidade",
        image: require("../../assets/images/bigben.jpg"),
    },

    {
        id: "estatua-liberdade",
        title: "Estátua da Liberdade",
        location: "Nova York, EUA",
        category: "Cidade",
        image: require("../../assets/images/libertystatue.jpg"),
    },

    {
        id: "cristo-redentor",
        title: "Cristo Redentor",
        location: "Rio de Janeiro, Brasil",
        category: "Cidade",
        image: require("../../assets/images/cristo.jpg"),
    },

    {
        id: "burj-khalifa",
        title: "Burj Khalifa",
        location: "Dubai, Emirados Árabes",
        category: "Cidade",
        image: require("../../assets/images/burjkhalifa.jpg"),
    },

    {
        id: "santorini",
        title: "Santorini",
        location: "Santorini, Grécia",
        category: "Ponto Turístico",
        image: require("../../assets/images/santorini.jpg"),
    },

    {
        id: "taj-mahal",
        title: "Taj Mahal",
        location: "Agra, Índia",
        category: "Ponto Turístico",
        image: require("../../assets/images/tajmahal.jpg"),
    },

    {
        id: "machu-picchu",
        title: "Machu Picchu",
        location: "Machu Picchu, Peru",
        category: "Ponto Turístico",
        image: require("../../assets/images/machupicchu.jpg"),
    },

    {
        id: "sydney",
        title: "Sydney",
        location: "Sydney, Austrália",
        category: "Cidade",
        image: require("../../assets/images/sydney.jpg"),
    },

];


/* =========================================================
   PAÍSES
========================================================= */

const countries = [

    {
        id: "franca",
        name: "França",
        continent: "Europa",
        image: require("../../assets/images/france.jpg"),
    },

    {
        id: "japao",
        name: "Japão",
        continent: "Ásia",
        image: require("../../assets/images/japan.jpg"),
    },

    {
        id: "italia",
        name: "Itália",
        continent: "Europa",
        image: require("../../assets/images/italy.jpg"),
    },

    {
        id: "espanha",
        name: "Espanha",
        continent: "Europa",
        image: require("../../assets/images/spain.jpg"),
    },

    {
        id: "portugal",
        name: "Portugal",
        continent: "Europa",
        image: require("../../assets/images/portugal.jpg"),
    },

    {
        id: "eua",
        name: "Estados Unidos",
        continent: "América do Norte",
        image: require("../../assets/images/usa.jpg"),
    },

    {
        id: "reino-unido",
        name: "Reino Unido",
        continent: "Europa",
        image: require("../../assets/images/uk.jpg"),
    },

    {
        id: "coreia",
        name: "Coreia do Sul",
        continent: "Ásia",
        image: require("../../assets/images/sk.jpg"),
    },

    {
        id: "grecia",
        name: "Grécia",
        continent: "Europa",
        image: require("../../assets/images/greece.jpg"),
    },

    {
        id: "suica",
        name: "Suíça",
        continent: "Europa",
        image: require("../../assets/images/switzerland.jpg"),
    },

];


/* =========================================================
   HOME
========================================================= */

export default function HomeScreen() {

    const router = useRouter();

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("Tudo");


    const filteredDestinations = useMemo(() => {

        const term = search.trim().toLowerCase();

        return destinations.filter((destination) => {

            const matchesSearch =
                !term ||
                destination.title
                    .toLowerCase()
                    .includes(term) ||
                destination.location
                    .toLowerCase()
                    .includes(term);


            const matchesFilter =
                filter === "Tudo"

                ||

                (
                    filter === "Pontos turísticos" &&
                    (
                        destination.category === "Ponto turístico"
                    )
                )

                ||

                (
                    filter === "Cidades" &&
                    destination.category === "Cidade"
                );


            return matchesSearch && matchesFilter;

        });

    }, [search, filter]);


    return (

        <View style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#f7f7f7"
            />


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >


                {/* =================================================
                    HEADER
                ================================================= */}

                <View style={styles.header}>

                    <Pressable
                        style={styles.menuButton}
                    >

                        <MaterialIcons
                            name="menu"
                            size={27}
                            color="#8492a8"
                        />

                    </Pressable>


                    <Text style={styles.headerTitle}>
                        Home
                    </Text>


                    <Pressable
                        style={styles.profileButton}

                        onPress={() =>
                            router.push("/logic/profile")
                        }
                    >

                        <Image
                            source={require(
                                "../../assets/images/perfil.jpg"
                            )}

                            style={styles.profileImage}

                            resizeMode="cover"
                        />

                    </Pressable>

                </View>


                {/* =================================================
                    SAUDAÇÃO
                ================================================= */}

                <Text style={styles.greeting}>
                    Olá!
                </Text>


                {/* =================================================
                    BUSCA
                ================================================= */}

                <View style={styles.searchContainer}>

                    <TextInput
                        value={search}

                        onChangeText={setSearch}

                        placeholder="Qual seu destino?"

                        placeholderTextColor="#999999"

                        style={styles.searchInput}

                        returnKeyType="search"
                    />


                    <MaterialIcons
                        name="search"
                        size={22}
                        color="#333333"
                    />

                </View>


                {/* =================================================
                    DESTINOS POPULARES
                ================================================= */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Destinos populares
                    </Text>


                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterContainer}
                    >

                        {[
                            "Tudo",
                            "Países",
                            "Cidades",
                            "Pontos turísticos",
                        ].map((item) => (

                            <Pressable
                                key={item}

                                onPress={() =>
                                    setFilter(item)
                                }

                                style={[
                                    styles.filterButton,

                                    filter === item &&
                                    styles.filterButtonActive,
                                ]}
                            >

                                <Text
                                    style={[
                                        styles.filterText,

                                        filter === item &&
                                        styles.filterTextActive,
                                    ]}
                                >
                                    {item}
                                </Text>

                            </Pressable>

                        ))}

                    </ScrollView>


                    {/* CARDS DOS DESTINOS */}

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardsContainer}
                    >

                        {filteredDestinations.map(
                            (destination) => (

                                <Pressable
                                    key={destination.id}

                                    style={({ pressed }) => [
                                        styles.destinationCard,

                                        pressed &&
                                        styles.cardPressed,
                                    ]}

                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                "/logic/destination/[id]",

                                            params: {
                                                id:
                                                    destination.id,
                                            },
                                        })
                                    }
                                >

                                    <Image
                                        source={
                                            destination.image
                                        }

                                        style={
                                            styles.destinationImage
                                        }

                                        resizeMode="cover"
                                    />


                                    <View
                                        style={
                                            styles.cardInfo
                                        }
                                    >

                                        <Text
                                            style={
                                                styles.cardTitle
                                            }

                                            numberOfLines={1}
                                        >
                                            {
                                                destination.location
                                            }
                                        </Text>


                                        <Text
                                            style={
                                                styles.cardSubtitle
                                            }

                                            numberOfLines={1}
                                        >
                                            {
                                                destination.category
                                            }
                                        </Text>

                                    </View>

                                </Pressable>

                            )
                        )}

                    </ScrollView>

                </View>


                {/* =================================================
                    PAÍSES POPULARES
                ================================================= */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Países populares
                    </Text>


                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.cardsContainer}
                    >

                        {countries.map((country) => (

                            <Pressable
                                key={country.id}

                                style={({ pressed }) => [
                                    styles.destinationCard,

                                    pressed &&
                                    styles.cardPressed,
                                ]}

                                onPress={() =>
                                    router.push({
                                        pathname:
                                            "/logic/country/[id]",

                                        params: {
                                            id:
                                                country.id,
                                        },
                                    })
                                }
                            >

                                <Image
                                    source={country.image}

                                    style={
                                        styles.destinationImage
                                    }

                                    resizeMode="cover"
                                />


                                <View
                                    style={
                                        styles.cardInfo
                                    }
                                >

                                    <Text
                                        style={
                                            styles.cardTitle
                                        }

                                        numberOfLines={1}
                                    >
                                        {country.name}
                                    </Text>


                                    <Text
                                        style={
                                            styles.cardSubtitle
                                        }

                                        numberOfLines={1}
                                    >
                                        {country.continent}
                                    </Text>

                                </View>

                            </Pressable>

                        ))}

                    </ScrollView>

                </View>


                <View style={{ height: 100 }} />

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

        paddingTop: 8,

        paddingBottom: 30,

    },


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


    profileButton: {

        width: 40,

        height: 40,

        alignItems: "center",

        justifyContent: "center",

    },


    profileImage: {

        width: 35,

        height: 35,

        borderRadius: 18,

    },


    greeting: {

        marginTop: 9,

        marginLeft: 30,

        fontSize: 29,

        fontWeight: "800",

        color: "#303030",

    },


    searchContainer: {

        marginHorizontal: 20,

        marginTop: 27,

        height: 50,

        borderRadius: 26,

        backgroundColor: "#ffffff",

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 16,

        shadowColor: "#000000",

        shadowOffset: {

            width: 0,

            height: 4,

        },

        shadowOpacity: 0.15,

        shadowRadius: 7,

        elevation: 5,

    },


    searchInput: {

        flex: 1,

        height: 50,

        fontSize: 12,

        color: "#333333",

        paddingHorizontal: 0,

    },


    section: {

        marginTop: 39,

    },


    sectionTitle: {

        marginLeft: 32,

        marginBottom: 12,

        fontSize: 19,

        fontWeight: "700",

        color: "#8492a8",

    },


    filterContainer: {

        paddingLeft: 32,

        paddingRight: 20,

        gap: 8,

        marginBottom: 17,

    },


    filterButton: {

        height: 29,

        paddingHorizontal: 15,

        borderRadius: 16,

        backgroundColor: "#e7e7e7",

        alignItems: "center",

        justifyContent: "center",

    },


    filterButtonActive: {

        backgroundColor: "#303030",

    },


    filterText: {

        fontSize: 10,

        color: "#666666",

        fontWeight: "500",

    },


    filterTextActive: {

        color: "#ffffff",

    },


    cardsContainer: {

        paddingLeft: 23,

        paddingRight: 10,

        gap: 20,

    },


    destinationCard: {

        width: 145,

        height: 190,

        backgroundColor: "#ffffff",

        borderRadius: 14,

        overflow: "hidden",

        shadowColor: "#000000",

        shadowOffset: {

            width: 0,

            height: 5,

        },

        shadowOpacity: 0.16,

        shadowRadius: 8,

        elevation: 5,

    },


    cardPressed: {

        transform: [

            {

                scale: 0.96,

            },

        ],

    },


    destinationImage: {

        width: 135,

        height: 137,

        margin: 5,

        borderRadius: 10,

    },


    cardInfo: {

        paddingHorizontal: 10,

        paddingTop: 3,

        paddingBottom: 8,

    },


    cardTitle: {

        fontSize: 11,

        fontWeight: "700",

        color: "#333333",

        marginBottom: 3,

    },


    cardSubtitle: {

        fontSize: 10,

        color: "#999999",

    },

});