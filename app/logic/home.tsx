import React, { useMemo, useState } from "react";
import GlassBackdrop from "../../components/GlassBackdrop";
import UserAvatar from "../../components/UserAvatar";
import { glassColor, glassDecoration, type GlassPalette } from "../../constants/glass";
import { useAxisAuth } from "../../contexts/AuthContext";
import { useAxisTheme } from "../../contexts/ThemeContext";

import {
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import GlassBottomNav from "../../components/GlassBottomNav";


/* =========================================================
   DESTINOS
========================================================= */

const destinations = [

    {
        id: "torre-eiffel",
        title: "Paris",
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
        title: "Londres",
        location: "Londres, Inglaterra",
        category: "Cidade",
        image: require("../../assets/images/bigben.jpg"),
    },

    {
        id: "estatua-liberdade",
        title: "Nova York",
        location: "Nova York, EUA",
        category: "Cidade",
        image: require("../../assets/images/libertystatue.jpg"),
    },

    {
        id: "cristo-redentor",
        title: "Rio de Janeiro",
        location: "Rio de Janeiro, Brasil",
        category: "Cidade",
        image: require("../../assets/images/cristo.jpg"),
    },

    {
        id: "burj-khalifa",
        title: "Dubai",
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

    {
        id: "lisboa",
        title: "Lisboa",
        location: "Lisboa, Portugal",
        category: "Cidade",
        image: require("../../assets/images/lisboa.jpg"),
    },

    {
        id: "istambul",
        title: "Istambul",
        location: "Istambul, Turquia",
        category: "Cidade",
        image: require("../../assets/images/istambul.jpg"),
    },

    {
        id: "los-angeles",
        title: "Los Angeles",
        location: "Los Angeles, Estados Unidos",
        category: "Cidade",
        image: require("../../assets/images/los-angeles.jpg"),
    },

    {
        id: "miami",
        title: "Miami",
        location: "Miami, Estados Unidos",
        category: "Cidade",
        image: require("../../assets/images/miami.jpg"),
    },

    {
        id: "hong-kong",
        title: "Hong Kong",
        location: "Hong Kong, China",
        category: "Cidade",
        image: require("../../assets/images/hong-kong.jpg"),
    },

    {
        id: "florenca",
        title: "Florença",
        location: "Florença, Itália",
        category: "Cidade",
        image: require("../../assets/images/florenca.jpg"),
    },

    {
        id: "cancun",
        title: "Cancún",
        location: "Cancún, México",
        category: "Cidade",
        image: require("../../assets/images/cancun.jpg"),
    },

    {
        id: "edimburgo",
        title: "Edimburgo",
        location: "Edimburgo, Reino Unido",
        category: "Cidade",
        image: require("../../assets/images/edimburgo.jpg"),
    },

    {
        id: "berlim",
        title: "Berlim",
        location: "Berlim, Alemanha",
        category: "Cidade",
        image: require("../../assets/images/berlim.jpg"),
    },

    {
        id: "hanoi",
        title: "Hanói",
        location: "Hanói, Vietnã",
        category: "Cidade",
        image: require("../../assets/images/hanoi.jpg"),
    },

    {
        id: "monte-fuji",
        title: "Monte Fuji",
        location: "Monte Fuji, Japão",
        category: "Ponto Turístico",
        image: require("../../assets/images/monte-fuji.jpg"),
    },

    {
        id: "angkor-wat",
        title: "Angkor Wat",
        location: "Angkor Wat, Camboja",
        category: "Ponto Turístico",
        image: require("../../assets/images/angkor-wat.jpg"),
    },

    {
        id: "grand-canyon",
        title: "Grand Canyon",
        location: "Grand Canyon, Estados Unidos",
        category: "Ponto Turístico",
        image: require("../../assets/images/grand-canyon.jpg"),
    },

    {
        id: "niagara",
        title: "Cataratas do Niágara",
        location: "Cataratas do Niágara, Canadá",
        category: "Ponto Turístico",
        image: require("../../assets/images/niagara.jpg"),
    },

    {
        id: "blue-lagoon",
        title: "Blue Lagoon",
        location: "Blue Lagoon, Islândia",
        category: "Ponto Turístico",
        image: require("../../assets/images/blue-lagoon.jpg"),
    },

    {
        id: "everest",
        title: "Monte Everest",
        location: "Monte Everest, Nepal",
        category: "Ponto Turístico",
        image: require("../../assets/images/everest.jpg"),
    },

    {
        id: "salar-de-uyuni",
        title: "Salar de Uyuni",
        location: "Salar de Uyuni, Bolívia",
        category: "Ponto Turístico",
        image: require("../../assets/images/salar-de-uyuni.jpg"),
    },

    {
        id: "victoria-falls",
        title: "Victoria Falls",
        location: "Victoria Falls, Zâmbia",
        category: "Ponto Turístico",
        image: require("../../assets/images/victoria-falls.jpg"),
    },

    {
        id: "kilimanjaro",
        title: "Kilimanjaro",
        location: "Kilimanjaro, Tanzânia",
        category: "Ponto Turístico",
        image: require("../../assets/images/kilimanjaro.jpg"),
    },

    {
        id: "uluru",
        title: "Uluru",
        location: "Uluru, Austrália",
        category: "Ponto Turístico",
        image: require("../../assets/images/uluru.jpg"),
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
    const { user } = useAxisAuth();
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette, axisDarkMode), [axisPalette, axisDarkMode]);


    const router = useRouter();

    const insets = useSafeAreaInsets();

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
                filter === "Tudo" ||
                (
                    filter === "Cidades" &&
                    destination.category === "Cidade"
                ) ||
                (
                    filter === "Pontos turísticos" &&
                    destination.category === "Ponto Turístico"
                );

            return matchesSearch && matchesFilter;

        });

    }, [search, filter]);


    const filteredCountries = useMemo(() => {

        const term = search.trim().toLowerCase();

        return countries.filter((country) => {

            const matchesSearch =
                !term ||
                country.name
                    .toLowerCase()
                    .includes(term) ||
                country.continent
                    .toLowerCase()
                    .includes(term);

            return matchesSearch;

        });

    }, [search]);


    return (

        <View style={styles.container}>
            <GlassBackdrop />

            <StatusBar
                barStyle={axisDarkMode ? "light-content" : "dark-content"}
            
            />


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingTop:
                            insets.top + 8,
                    },
                ]}
            >


                {/* =================================================
                    HEADER
                ================================================= */}

                <View style={styles.header}>

                    <Text style={styles.headerTitle}>
                        Home
                    </Text>


                    <Pressable
                        style={styles.profileButton}
                        onPress={() =>
                            router.push("/logic/profile")
                        }
                    >
                        <UserAvatar user={user} size={35} />
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

                        placeholderTextColor={axisPalette.muted}

                        style={styles.searchInput}

                        returnKeyType="search"
                    />


                    <MaterialIcons
                        name="search"
                        size={22}
                        color={axisPalette.text}
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
                        contentContainerStyle={
                            styles.filterContainer
                        }
                    >

                        {[
                            "Tudo",
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


                    {/* =================================================
                        CARDS DOS DESTINOS
                    ================================================= */}

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={
                            styles.cardsContainer
                        }
                    >

                        {filteredDestinations.map(
                            (destination) => (

                                <View
                                    key={
                                        destination.id
                                    }

                                    style={
                                        styles.destinationCard
                                    }
                                >

                                    {/* IMAGEM */}

                                    <Pressable
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

                                        <View
                                            style={
                                                styles.imageWrapper
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

                                        </View>

                                    </Pressable>


                                    {/* INFORMAÇÕES */}

                                    <Pressable
                                        style={
                                            styles.cardInfo
                                        }

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

                                    </Pressable>

                                </View>

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
                        contentContainerStyle={
                            styles.cardsContainer
                        }
                    >

                        {filteredCountries.map((country) => (

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

                                <View style={styles.imageWrapper}>
                                    <Image
                                        source={country.image}
                                        style={styles.destinationImage}
                                        resizeMode="cover"
                                    />
                                </View>


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

const createStyles = (palette: GlassPalette, darkMode: boolean) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
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
        justifyContent: "center",
    },


    headerTitle: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 17,
        fontWeight: "700",
        color: glassColor("color", "#8492a8", "headerTitle", palette),
    },


    profileButton: {
        ...glassDecoration("profileButton", palette),
        position: "absolute",
        right: 24,
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
        color: glassColor("color", "#303030", "greeting", palette),
    },


    searchContainer: {
        marginHorizontal: 20,
        marginTop: 27,
        height: 50,
        borderRadius: 26,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "searchContainer", palette),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        shadowColor: glassColor("shadowColor", "#000000", "searchContainer", palette),
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
        color: glassColor("color", "#333333", "searchInput", palette),
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
        color: glassColor("color", "#8492a8", "sectionTitle", palette),
    },


    filterContainer: {
        paddingLeft: 32,
        paddingRight: 20,
        gap: 8,
        marginBottom: 17,
    },


    filterButton: {
        ...glassDecoration("filterButton", palette),
        height: 29,
        paddingHorizontal: 15,
        borderRadius: 16,
        backgroundColor: darkMode ? "#292929" : "#E8E8E8",
        alignItems: "center",
        justifyContent: "center",
    },


    filterButtonActive: {
        ...glassDecoration("filterButtonActive", palette),
        backgroundColor: darkMode ? "#F5F5F5" : "#171717",
    },


    filterText: {
        fontSize: 10,
        color: darkMode ? "#F2F2F2" : "#333333",
        fontWeight: "500",
    },


    filterTextActive: {
        color: darkMode ? "#171717" : "#FFFFFF",
    },


    cardsContainer: {
        paddingLeft: 23,
        paddingRight: 10,
        gap: 10,
    },


    destinationCard: {
        ...glassDecoration("destinationCard", palette),
        width: 160,
        height: 205,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "destinationCard", palette),
        borderRadius: 14,
        overflow: "hidden",
        shadowColor: glassColor("shadowColor", "#000000", "destinationCard", palette),
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


    imageWrapper: {
        width: 150,
        height: 145,
        margin: 5,
        borderRadius: 10,
        overflow: "hidden",
    },


    destinationImage: {
        width: "100%",
        height: "100%",
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
        color: glassColor("color", "#333333", "cardTitle", palette),
        marginBottom: 3,
    },


    cardSubtitle: {
        fontSize: 10,
        color: glassColor("color", "#999999", "cardSubtitle", palette),
    },

});