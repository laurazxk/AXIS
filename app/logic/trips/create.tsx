import GlassFrost from "../../../components/GlassFrost";
import { useAxisTheme } from "../../../contexts/ThemeContext";
import { glassColor, glassDecoration, type GlassPalette } from "../../../constants/glass";
import GlassBackdrop from "../../../components/GlassBackdrop";

import React, { useMemo, useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    StatusBar,
    ScrollView,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { tripDraft } from "./tripDraft";

type Destination = {
    city: string;
    country: string;
    countryCode: string;
    currency: string;
    flag: string;
};

const destinations: Destination[] = [
    { city: "Paris", country: "França", countryCode: "FR", currency: "EUR", flag: "🇫🇷" },
    { city: "Nice", country: "França", countryCode: "FR", currency: "EUR", flag: "🇫🇷" },
    { city: "Lyon", country: "França", countryCode: "FR", currency: "EUR", flag: "🇫🇷" },
    { city: "Tóquio", country: "Japão", countryCode: "JP", currency: "JPY", flag: "🇯🇵" },
    { city: "Osaka", country: "Japão", countryCode: "JP", currency: "JPY", flag: "🇯🇵" },
    { city: "Roma", country: "Itália", countryCode: "IT", currency: "EUR", flag: "🇮🇹" },
    { city: "Veneza", country: "Itália", countryCode: "IT", currency: "EUR", flag: "🇮🇹" },
    { city: "Florença", country: "Itália", countryCode: "IT", currency: "EUR", flag: "🇮🇹" },
    { city: "Londres", country: "Reino Unido", countryCode: "GB", currency: "GBP", flag: "🇬🇧" },
    { city: "Manchester", country: "Reino Unido", countryCode: "GB", currency: "GBP", flag: "🇬🇧" },
    { city: "Lisboa", country: "Portugal", countryCode: "PT", currency: "EUR", flag: "🇵🇹" },
    { city: "Porto", country: "Portugal", countryCode: "PT", currency: "EUR", flag: "🇵🇹" },
    { city: "Madrid", country: "Espanha", countryCode: "ES", currency: "EUR", flag: "🇪🇸" },
    { city: "Barcelona", country: "Espanha", countryCode: "ES", currency: "EUR", flag: "🇪🇸" },
    { city: "Sevilha", country: "Espanha", countryCode: "ES", currency: "EUR", flag: "🇪🇸" },
    { city: "Nova York", country: "Estados Unidos", countryCode: "US", currency: "USD", flag: "🇺🇸" },
    { city: "Los Angeles", country: "Estados Unidos", countryCode: "US", currency: "USD", flag: "🇺🇸" },
    { city: "Orlando", country: "Estados Unidos", countryCode: "US", currency: "USD", flag: "🇺🇸" },
    { city: "Miami", country: "Estados Unidos", countryCode: "US", currency: "USD", flag: "🇺🇸" },
    { city: "Toronto", country: "Canadá", countryCode: "CA", currency: "CAD", flag: "🇨🇦" },
    { city: "Vancouver", country: "Canadá", countryCode: "CA", currency: "CAD", flag: "🇨🇦" },
    { city: "Cidade do México", country: "México", countryCode: "MX", currency: "MXN", flag: "🇲🇽" },
    { city: "Cancún", country: "México", countryCode: "MX", currency: "MXN", flag: "🇲🇽" },
    { city: "Rio de Janeiro", country: "Brasil", countryCode: "BR", currency: "BRL", flag: "🇧🇷" },
    { city: "São Paulo", country: "Brasil", countryCode: "BR", currency: "BRL", flag: "🇧🇷" },
    { city: "Salvador", country: "Brasil", countryCode: "BR", currency: "BRL", flag: "🇧🇷" },
    { city: "Florianópolis", country: "Brasil", countryCode: "BR", currency: "BRL", flag: "🇧🇷" },
    { city: "Atenas", country: "Grécia", countryCode: "GR", currency: "EUR", flag: "🇬🇷" },
    { city: "Santorini", country: "Grécia", countryCode: "GR", currency: "EUR", flag: "🇬🇷" },
    { city: "Zurique", country: "Suíça", countryCode: "CH", currency: "CHF", flag: "🇨🇭" },
    { city: "Genebra", country: "Suíça", countryCode: "CH", currency: "CHF", flag: "🇨🇭" },
    { city: "Seul", country: "Coreia do Sul", countryCode: "KR", currency: "KRW", flag: "🇰🇷" },
    { city: "Bangkok", country: "Tailândia", countryCode: "TH", currency: "THB", flag: "🇹🇭" },
    { city: "Phuket", country: "Tailândia", countryCode: "TH", currency: "THB", flag: "🇹🇭" },
    { city: "Dubai", country: "Emirados Árabes", countryCode: "AE", currency: "AED", flag: "🇦🇪" },
    { city: "Sydney", country: "Austrália", countryCode: "AU", currency: "AUD", flag: "🇦🇺" },
    { city: "Melbourne", country: "Austrália", countryCode: "AU", currency: "AUD", flag: "🇦🇺" },
    { city: "Berlim", country: "Alemanha", countryCode: "DE", currency: "EUR", flag: "🇩🇪" },
    { city: "Munique", country: "Alemanha", countryCode: "DE", currency: "EUR", flag: "🇩🇪" },
    { city: "Amsterdã", country: "Países Baixos", countryCode: "NL", currency: "EUR", flag: "🇳🇱" },
    { city: "Viena", country: "Áustria", countryCode: "AT", currency: "EUR", flag: "🇦🇹" },
    { city: "Praga", country: "Tchéquia", countryCode: "CZ", currency: "CZK", flag: "🇨🇿" },
    { city: "Istambul", country: "Turquia", countryCode: "TR", currency: "TRY", flag: "🇹🇷" },
    { city: "Cairo", country: "Egito", countryCode: "EG", currency: "EGP", flag: "🇪🇬" },
    { city: "Marrakech", country: "Marrocos", countryCode: "MA", currency: "MAD", flag: "🇲🇦" },
    { city: "Lima", country: "Peru", countryCode: "PE", currency: "PEN", flag: "🇵🇪" },
    { city: "Cusco", country: "Peru", countryCode: "PE", currency: "PEN", flag: "🇵🇪" },
    { city: "Buenos Aires", country: "Argentina", countryCode: "AR", currency: "ARS", flag: "🇦🇷" },
    { city: "Santiago", country: "Chile", countryCode: "CL", currency: "CLP", flag: "🇨🇱" },
    { city: "Punta Cana", country: "República Dominicana", countryCode: "DO", currency: "DOP", flag: "🇩🇴" },
];

const popularDestinations = [
    { city: "Paris", country: "França", flag: "🇫🇷", currency: "EUR", code: "FR" },
    { city: "Roma", country: "Itália", flag: "🇮🇹", currency: "EUR", code: "IT" },
    { city: "Londres", country: "Reino Unido", flag: "🇬🇧", currency: "GBP", code: "GB" },
    { city: "Nova York", country: "Estados Unidos", flag: "🇺🇸", currency: "USD", code: "US" },
    { city: "Rio de Janeiro", country: "Brasil", flag: "🇧🇷", currency: "BRL", code: "BR" },
    { city: "Dubai", country: "Emirados Árabes", flag: "🇦🇪", currency: "AED", code: "AE" },
    { city: "Santorini", country: "Grécia", flag: "🇬🇷", currency: "EUR", code: "GR" },
    { city: "Tóquio", country: "Japão", flag: "🇯🇵", currency: "JPY", code: "JP" },
    { city: "Cusco", country: "Peru", flag: "🇵🇪", currency: "PEN", code: "PE" },
    { city: "Sydney", country: "Austrália", flag: "🇦🇺", currency: "AUD", code: "AU" },
];

function normalize(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export default function CreateTripScreen() {
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);

    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [search, setSearch] = useState(
        tripDraft.destination
    );

    const [selected, setSelected] = useState<Destination | null>(
        destinations.find(
            item => item.city === tripDraft.destination
        ) ?? null
    );

    const results = useMemo(() => {
        const term = normalize(search);

        if (!term) return [];

        return destinations
            .filter(item =>
                normalize(`${item.city} ${item.country}`).includes(term)
            )
            .slice(0, 8);
    }, [search]);

    function selectDestination(item: Destination) {
        setSelected(item);
        setSearch(`${item.city}, ${item.country}`);

        tripDraft.destination = item.city;
        tripDraft.country = item.country;
        tripDraft.countryCode = item.countryCode;
        tripDraft.localCurrency = item.currency;
    }

    function selectPopular(item: typeof popularDestinations[number]) {
        const match = destinations.find(
            destination =>
                destination.city === item.city &&
                destination.country === item.country
        );

        if (match) {
            selectDestination(match);
        }
    }

    function continueToDuration() {
        if (!selected) return;

        router.push("/logic/trips/duration");
    }

    return (
        <View style={styles.container}>
            <GlassBackdrop />
            <StatusBar
                barStyle={axisDarkMode ? "light-content" : "dark-content"}
                backgroundColor="#f7f7f7"
            />

            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 8 },
                ]}
            >
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
                        Nova Viagem
                    </Text>

                    <View style={styles.headerSpace} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>
                        Para onde você{"\n"}quer viajar?
                    </Text>

                    <Text style={styles.description}>
                        Pesquise um país ou cidade para começar
                        a planejar sua viagem.
                    </Text>

                    <View style={styles.searchContainer}>
                        <MaterialIcons
                            name="search"
                            size={22}
                            color={axisPalette.muted}
                        />

                        <TextInput
                            value={search}
                            onChangeText={value => {
                                setSearch(value);

                                if (
                                    selected &&
                                    value !== `${selected.city}, ${selected.country}`
                                ) {
                                    setSelected(null);
                                }
                            }}
                            placeholder="Digite um destino"
                            placeholderTextColor={axisPalette.muted}
                            style={styles.input}
                            returnKeyType="search"
                            autoCorrect={false}
                        />

                        {search.length > 0 && (
                            <Pressable
                                onPress={() => {
                                    setSearch("");
                                    setSelected(null);
                                }}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={20}
                                    color={axisPalette.muted}
                                />
                            </Pressable>
                        )}
                    </View>

                    {search.trim().length > 0 && (
                        <View style={styles.resultsContainer}>
                            {results.length > 0 ? (
                                results.map(item => (
                                    <Pressable
                                        key={`${item.city}-${item.country}`}
                                        style={styles.resultRow}
                                        onPress={() =>
                                            selectDestination(item)
                                        }
                                    >
                                        <Text style={styles.flag}>
                                            {item.flag}
                                        </Text>

                                        <View style={styles.resultText}>
                                            <Text style={styles.resultCity}>
                                                {item.city}
                                            </Text>
                                            <Text style={styles.resultCountry}>
                                                {item.country}
                                            </Text>
                                        </View>

                                        <MaterialIcons
                                            name={
                                                selected?.city === item.city
                                                    ? "check-circle"
                                                    : "chevron-right"
                                            }
                                            size={22}
                                            color={axisPalette.muted}
                                        />
                                    </Pressable>
                                ))
                            ) : (
                                <Text style={styles.noResults}>
                                    Nenhum resultado no catálogo.
                                    Tente outra cidade ou país.
                                </Text>
                            )}
                        </View>
                    )}

                    {selected && (
                        <View style={styles.selectedCard}>
                <GlassFrost />
                            <MaterialIcons
                                name="check-circle"
                                size={21}
                                color={axisPalette.muted}
                            />
                            <View style={styles.selectedText}>
                                <Text style={styles.selectedTitle}>
                                    {selected.city}, {selected.country}
                                </Text>
                                <Text style={styles.selectedSubtitle}>
                                    Moeda local: {selected.currency}
                                </Text>
                            </View>
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>
                        Destinos populares
                    </Text>

                    <Text style={styles.sectionDescription}>
                        Arraste para ver mais destinos.
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.popularContainer}
                    >
                        {popularDestinations.map(item => {
                            const active =
                                selected?.city === item.city;

                            return (
                                <Pressable
                                    key={item.city}
                                    style={[
                                        styles.popularCard,
                                        active && styles.popularCardActive,
                                    ]}
                                    onPress={() => selectPopular(item)}
                                >
                                    <Text style={styles.popularFlag}>
                                        {item.flag}
                                    </Text>

                                    <Text
                                        style={[styles.popularCity, active && styles.popularCityActive]}
                                        numberOfLines={1}
                                    >
                                        {item.city}
                                    </Text>

                                    <Text
                                        style={[styles.popularCountry, active && styles.popularCountryActive]}
                                        numberOfLines={1}
                                    >
                                        {item.country}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>

                    <Pressable
                        style={[
                            styles.nextButton,
                            !selected && styles.nextButtonDisabled,
                        ]}
                        disabled={!selected}
                        onPress={continueToDuration}
                    >
                        <Text style={styles.nextButtonText}>
                            Continuar
                        </Text>

                        <MaterialIcons
                            name="arrow-forward"
                            size={21}
                            color={axisPalette.accentText}
                        />
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const createStyles = (palette: GlassPalette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
    },

    scrollContent: {
        paddingBottom: 45,
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
        paddingHorizontal: 28,
        marginTop: 30,
    },

    title: {
        fontSize: 29,
        lineHeight: 35,
        fontWeight: "800",
        color: glassColor("color", "#303030", "title", palette),
    },

    description: {
        fontSize: 13,
        lineHeight: 20,
        color: glassColor("color", "#888888", "description", palette),
        marginTop: 12,
        marginBottom: 25,
    },

    searchContainer: {
        minHeight: 54,
        borderRadius: 27,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "searchContainer", palette),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        gap: 10,
        shadowColor: glassColor("shadowColor", "#000000", "searchContainer", palette),
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 7,
        elevation: 3,
    },

    input: {
        flex: 1,
        minHeight: 52,
        fontSize: 14,
        color: glassColor("color", "#303030", "input", palette),
    },

    resultsContainer: {
        marginTop: 8,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "resultsContainer", palette),
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 4,
        elevation: 2,
    },

    resultRow: {
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: glassColor("borderBottomColor", "#eeeeee", "resultRow", palette),
        gap: 12,
    },

    flag: {
        fontSize: 23,
    },

    resultText: {
        flex: 1,
    },

    resultCity: {
        fontSize: 13,
        fontWeight: "700",
        color: glassColor("color", "#303030", "resultCity", palette),
    },

    resultCountry: {
        fontSize: 11,
        color: glassColor("color", "#999999", "resultCountry", palette),
        marginTop: 3,
    },

    noResults: {
        padding: 16,
        color: glassColor("color", "#888888", "noResults", palette),
        fontSize: 12,
        lineHeight: 18,
    },

    selectedCard: {
        ...glassDecoration("selectedCard", palette),
        marginTop: 15,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "selectedCard", palette),
        borderRadius: 17,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    selectedText: {
        flex: 1,
    },

    selectedTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: glassColor("color", "#303030", "selectedTitle", palette),
    },

    selectedSubtitle: {
        marginTop: 4,
        fontSize: 11,
        color: glassColor("color", "#888888", "selectedSubtitle", palette),
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: glassColor("color", "#8492a8", "sectionTitle", palette),
        marginTop: 32,
    },

    sectionDescription: {
        fontSize: 11,
        color: glassColor("color", "#999999", "sectionDescription", palette),
        marginTop: 5,
        marginBottom: 13,
    },

    popularContainer: {
        paddingVertical: 5,
        paddingRight: 8,
        gap: 12,
    },

    popularCard: {
        ...glassDecoration("popularCard", palette),
        width: 112,
        minHeight: 115,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "popularCard", palette),
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: "transparent",
        elevation: 2,
    },

    popularCardActive: {
        borderColor: glassColor("borderColor", "#8492a8", "popularCardActive", palette),
        backgroundColor: palette.accent,
    },

    popularCityActive: { color: palette.accentText },
    popularCountryActive: { color: palette.accentText, opacity: 0.85 },

    popularFlag: {
        fontSize: 27,
        marginBottom: 8,
    },

    popularCity: {
        fontSize: 12,
        fontWeight: "700",
        color: glassColor("color", "#303030", "popularCity", palette),
    },

    popularCountry: {
        fontSize: 10,
        color: glassColor("color", "#999999", "popularCountry", palette),
        marginTop: 4,
        textAlign: "center",
    },

    nextButton: {
        height: 56,
        borderRadius: 28,
        backgroundColor: palette.accent,
        marginTop: 35,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    nextButtonDisabled: {
        opacity: 0.4,
    },

    nextButtonText: {
        color: palette.accentText,
        fontSize: 14,
        fontWeight: "600",
    },
});