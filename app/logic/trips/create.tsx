
import GlassBackdrop from "../../../components/GlassBackdrop";
import GlassFrost from "../../../components/GlassFrost";
import { glassColor, glassDecoration, type GlassPalette } from "../../../constants/glass";
import { useAxisTheme } from "../../../contexts/ThemeContext";

import React, { useEffect, useMemo, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tripDraft } from "../../../stores/tripDraft";

type Country = {
    name: string;
    alpha2Code: string;
    flag: string;
    currencies?: {
        code: string;
        name: string;
        symbol: string;
    }[];
};

const API_URL =
    "https://countries.dev/countries?fields=name,alpha2Code,flag,currencies&sort=name";

// API complementar que fornece os nomes traduzidos para português.
const TRANSLATIONS_API_URL =
    "https://restcountries.com/v3.1/all?fields=cca2,translations";

type CountryTranslation = {
    cca2: string;
    translations?: {
        por?: {
            common?: string;
        };
    };
};

async function loadCountryTranslations(): Promise<Record<string, string>> {
    const response = await fetch(TRANSLATIONS_API_URL);

    if (!response.ok) {
        throw new Error("Não foi possível carregar as traduções dos países.");
    }

    const data: CountryTranslation[] = await response.json();

    return Object.fromEntries(
        data
            .filter(item => item.cca2 && item.translations?.por?.common)
            .map(item => [item.cca2, item.translations!.por!.common!])
    );
}

// Países em destaque na tela inicial.
// A lista completa continua vindo da API.
const popularCountryCodes = [
    "BR", "US", "FR", "IT", "JP",
    "GB", "PT", "ES", "CA", "AU",
];

function normalize(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export default function CreateTripScreen() {
    const {
        palette: axisPalette,
        darkMode: axisDarkMode,
    } = useAxisTheme();

    const styles = React.useMemo(
        () => createStyles(axisPalette),
        [axisPalette]
    );

    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [countries, setCountries] = useState<Country[]>([]);
    const [countryNames, setCountryNames] = useState<Record<string, string>>({});
    const [search, setSearch] = useState(tripDraft.country || "");
    const [selected, setSelected] = useState<Country | null>(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    // Busca os países na API.
    useEffect(() => {
        let active = true;

        async function loadCountries() {
            try {
                setLoading(true);
                setApiError(false);

                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Não foi possível carregar os países.");
                }

                const data: Country[] = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Resposta inválida da API.");
                }

                let translations: Record<string, string> = {};
                try {
                    translations = await loadCountryTranslations();
                } catch (translationError) {
                    console.warn("Não foi possível carregar nomes em português:", translationError);
                }

                if (active) {
                    setCountries(data);
                    setCountryNames(translations);

                    // Recupera o país caso o usuário volte para esta tela.
                    const previousCountry = data.find(
                        item =>
                            item.alpha2Code === tripDraft.countryCode
                    );

                    if (previousCountry) {
                        setSelected(previousCountry);
                        setSearch(
                            translations[previousCountry.alpha2Code] || previousCountry.name
                        );
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar países:", error);

                if (active) {
                    setApiError(true);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadCountries();

        return () => {
            active = false;
        };
    }, []);

    // Pesquisa entre todos os países recebidos da API.
    const results = useMemo(() => {
        const term = normalize(search);

        if (!term) return [];

        return countries
            .filter(item =>
                normalize(countryNames[item.alpha2Code] || item.name).includes(term) ||
                normalize(item.name).includes(term) ||
                normalize(item.alpha2Code).includes(term)
            )
            .slice(0, 10);
    }, [search, countries, countryNames]);

    // Países populares encontrados na própria resposta da API.
    const popularCountries = useMemo(() => {
        return popularCountryCodes
            .map(code =>
                countries.find(item => item.alpha2Code === code)
            )
            .filter((item): item is Country => Boolean(item));
    }, [countries]);

    function selectCountry(item: Country) {
        const currency = item.currencies?.[0]?.code || "";

        setSelected(item);
        const translatedName = countryNames[item.alpha2Code] || item.name;

        setSearch(translatedName);

        // Guarda os dados para as próximas etapas da viagem.
        tripDraft.destination = translatedName;
        tripDraft.country = translatedName;
        tripDraft.countryCode = item.alpha2Code;
        tripDraft.localCurrency = currency;
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
                        Escolha o país de destino para começar
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
                                    value !== selected.name
                                ) {
                                    setSelected(null);
                                }
                            }}
                            placeholder="Pesquise um país"
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

                    {loading && (
                        <View style={styles.messageContainer}>
                            <ActivityIndicator
                                size="small"
                                color={axisPalette.muted}
                            />
                            <Text style={styles.messageText}>
                                Carregando países...
                            </Text>
                        </View>
                    )}

                    {apiError && !loading && (
                        <View style={styles.errorContainer}>
                            <MaterialIcons
                                name="cloud-off"
                                size={22}
                                color={axisPalette.muted}
                            />
                            <Text style={styles.noResults}>
                                Não foi possível carregar os países.
                                Verifique sua conexão e tente novamente.
                            </Text>

                            <Pressable
                                onPress={() => {
                                    setApiError(false);
                                    setLoading(true);

                                    fetch(API_URL)
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error("Erro na API");
                                            }
                                            return response.json();
                                        })
                                        .then(async data => {
                                            setCountries(data);
                                            try {
                                                const translations = await loadCountryTranslations();
                                                setCountryNames(translations);
                                            } catch (translationError) {
                                                console.warn(
                                                    "Não foi possível carregar nomes em português:",
                                                    translationError
                                                );
                                            }
                                        })
                                        .catch(error => {
                                            console.error(error);
                                            setApiError(true);
                                        })
                                        .finally(() => {
                                            setLoading(false);
                                        });
                                }}
                            >
                                <Text style={styles.retryText}>
                                    Tentar novamente
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    {search.trim().length > 0 &&
                        !loading &&
                        !apiError && (
                            <View style={styles.resultsContainer}>
                                {results.length > 0 ? (
                                    results.map(item => (
                                        <Pressable
                                            key={item.alpha2Code}
                                            style={styles.resultRow}
                                            onPress={() =>
                                                selectCountry(item)
                                            }
                                        >
                                            <Text style={styles.flag}>
                                                {item.flag}
                                            </Text>

                                            <View style={styles.resultText}>
                                                <Text style={styles.resultCity}>
                                                    {countryNames[item.alpha2Code] || item.name}
                                                </Text>

                                                <Text style={styles.resultCountry}>
                                                    {item.currencies?.[0]?.code ||
                                                        "Moeda não informada"}
                                                </Text>
                                            </View>

                                            <MaterialIcons
                                                name={
                                                    selected?.alpha2Code ===
                                                    item.alpha2Code
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
                                        Nenhum país encontrado.
                                        Tente outro nome.
                                    </Text>
                                )}
                            </View>
                        )}

                    {selected && (
                        <View style={styles.selectedCard}>
                            <GlassFrost />

                            <Text style={styles.selectedFlag}>
                                {selected.flag}
                            </Text>

                            <MaterialIcons
                                name="check-circle"
                                size={21}
                                color={axisPalette.muted}
                            />

                            <View style={styles.selectedText}>
                                <Text style={styles.selectedTitle}>
                                    {countryNames[selected.alpha2Code] || selected.name}
                                </Text>

                                <Text style={styles.selectedSubtitle}>
                                    Moeda local:{" "}
                                    {selected.currencies?.[0]?.code ||
                                        "Não informada"}
                                </Text>
                            </View>
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>
                        Países populares
                    </Text>

                    <Text style={styles.sectionDescription}>
                        Escolha um dos destinos em destaque.
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.popularContainer}
                    >
                        {popularCountries.map(item => {
                            const active =
                                selected?.alpha2Code === item.alpha2Code;

                            return (
                                <Pressable
                                    key={item.alpha2Code}
                                    style={[
                                        styles.popularCard,
                                        active && styles.popularCardActive,
                                    ]}
                                    onPress={() => selectCountry(item)}
                                >
                                    <Text style={styles.popularFlag}>
                                        {item.flag}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.popularCity,
                                            active && styles.popularCityActive,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {countryNames[item.alpha2Code] || item.name}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.popularCountry,
                                            active && styles.popularCountryActive,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {item.currencies?.[0]?.code || "—"}
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

const createStyles = (palette: GlassPalette) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: glassColor(
                "backgroundColor",
                "#f7f7f7",
                "container",
                palette
            ),
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
            color: glassColor(
                "color",
                "#8492a8",
                "headerTitle",
                palette
            ),
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
            color: glassColor(
                "color",
                "#303030",
                "title",
                palette
            ),
        },

        description: {
            fontSize: 13,
            lineHeight: 20,
            color: glassColor(
                "color",
                "#888888",
                "description",
                palette
            ),
            marginTop: 12,
            marginBottom: 25,
        },

        searchContainer: {
            minHeight: 54,
            borderRadius: 27,
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "searchContainer",
                palette
            ),
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 18,
            gap: 10,
            shadowColor: glassColor(
                "shadowColor",
                "#000000",
                "searchContainer",
                palette
            ),
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 7,
            elevation: 3,
        },

        input: {
            flex: 1,
            minHeight: 52,
            fontSize: 14,
            color: glassColor(
                "color",
                "#303030",
                "input",
                palette
            ),
        },

        resultsContainer: {
            marginTop: 8,
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "resultsContainer",
                palette
            ),
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
            borderBottomColor: glassColor(
                "borderBottomColor",
                "#eeeeee",
                "resultRow",
                palette
            ),
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
            color: glassColor(
                "color",
                "#303030",
                "resultCity",
                palette
            ),
        },

        resultCountry: {
            fontSize: 11,
            color: glassColor(
                "color",
                "#999999",
                "resultCountry",
                palette
            ),
            marginTop: 3,
        },

        noResults: {
            padding: 16,
            color: glassColor(
                "color",
                "#888888",
                "noResults",
                palette
            ),
            fontSize: 12,
            lineHeight: 18,
        },

        messageContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: 20,
        },

        messageText: {
            fontSize: 12,
            color: glassColor(
                "color",
                "#888888",
                "messageText",
                palette
            ),
        },

        errorContainer: {
            marginTop: 12,
            alignItems: "center",
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "errorContainer",
                palette
            ),
            borderRadius: 18,
            padding: 12,
        },

        retryText: {
            color: palette.accent,
            fontWeight: "700",
            fontSize: 13,
            padding: 8,
        },

        selectedCard: {
            ...glassDecoration("selectedCard", palette),
            marginTop: 15,
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "selectedCard",
                palette
            ),
            borderRadius: 17,
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },

        selectedFlag: {
            fontSize: 25,
        },

        selectedText: {
            flex: 1,
        },

        selectedTitle: {
            fontSize: 13,
            fontWeight: "700",
            color: glassColor(
                "color",
                "#303030",
                "selectedTitle",
                palette
            ),
        },

        selectedSubtitle: {
            marginTop: 4,
            fontSize: 11,
            color: glassColor(
                "color",
                "#888888",
                "selectedSubtitle",
                palette
            ),
        },

        sectionTitle: {
            fontSize: 17,
            fontWeight: "700",
            color: glassColor(
                "color",
                "#8492a8",
                "sectionTitle",
                palette
            ),
            marginTop: 32,
        },

        sectionDescription: {
            fontSize: 11,
            color: glassColor(
                "color",
                "#999999",
                "sectionDescription",
                palette
            ),
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
            backgroundColor: glassColor(
                "backgroundColor",
                "#ffffff",
                "popularCard",
                palette
            ),
            borderRadius: 17,
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            borderWidth: 1,
            borderColor: "transparent",
            elevation: 2,
        },

        popularCardActive: {
            borderColor: glassColor(
                "borderColor",
                "#8492a8",
                "popularCardActive",
                palette
            ),
            backgroundColor: palette.accent,
        },

        popularCityActive: {
            color: palette.accentText,
        },

        popularCountryActive: {
            color: palette.accentText,
            opacity: 0.85,
        },

        popularFlag: {
            fontSize: 27,
            marginBottom: 8,
        },

        popularCity: {
            fontSize: 12,
            fontWeight: "700",
            color: glassColor(
                "color",
                "#303030",
                "popularCity",
                palette
            ),
        },

        popularCountry: {
            fontSize: 10,
            color: glassColor(
                "color",
                "#999999",
                "popularCountry",
                palette
            ),
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
