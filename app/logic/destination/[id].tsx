import React, { useState } from "react";
import GlassBackdrop from "../../../components/GlassBackdrop";
import { glassColor, type GlassPalette } from "../../../constants/glass";
import { useAxisTheme } from "../../../contexts/ThemeContext";

import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";

import { tripDraft } from "../../../stores/tripDraft";


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

        description: "Paris reúne avenidas elegantes, cafés históricos, museus e bairros cheios de personalidade. A Torre Eiffel é seu símbolo mais conhecido e oferece uma vista marcante da cidade. Aproveite também para caminhar às margens do Sena, conhecer Montmartre e descobrir a gastronomia francesa.",
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

        description: "O Coliseu é um dos maiores símbolos da Roma Antiga e revela a grandiosidade dos espetáculos realizados há quase dois mil anos. Nos arredores, o Fórum Romano e o Monte Palatino ajudam a contar a história da cidade. Complete a visita explorando praças, fontes e a culinária italiana.",
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

        description: "Londres combina monumentos históricos, parques, museus e bairros de estilos muito diferentes. O Big Ben e o Palácio de Westminster formam uma das paisagens mais reconhecidas da cidade. Vale explorar as margens do Tâmisa, os mercados locais e a intensa programação cultural.",
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

        description: "Nova York é conhecida por seus arranha-céus, bairros vibrantes e atrações que aparecem em filmes do mundo inteiro. A Estátua da Liberdade representa um capítulo importante da história da imigração nos Estados Unidos. Explore também o Central Park, a Times Square e os museus da cidade.",
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

        description: "O Rio de Janeiro mistura praias, montanhas e uma vida cultural cheia de energia. Do alto do Corcovado, o Cristo Redentor oferece uma vista panorâmica da Baía de Guanabara e da cidade. Reserve tempo para conhecer Copacabana, Ipanema, o Pão de Açúcar e a culinária carioca.",
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

        description: "Dubai impressiona pela arquitetura contemporânea, pelos grandes centros comerciais e pelo contraste entre cidade e deserto. O Burj Khalifa se destaca no horizonte e oferece vistas panorâmicas da região. Além dos edifícios modernos, vale conhecer os souks tradicionais e a orla da cidade.",
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

        description: "Santorini é uma ilha grega famosa pelas casas brancas, igrejas de cúpulas azuis e vistas para o mar Egeu. As vilas de Oia e Fira são ótimas para passeios a pé e para apreciar o pôr do sol. A ilha também reúne praias vulcânicas, gastronomia mediterrânea e paisagens únicas.",
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

        description: "O Taj Mahal, em Agra, é um mausoléu de mármore branco conhecido pela simetria e pelos detalhes de sua arquitetura. Construído no século XVII, tornou-se um dos monumentos mais admirados da Índia. Os jardins, os reflexos na água e as mudanças de luz ao longo do dia tornam a visita especial.",
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

        description: "Machu Picchu preserva construções incas entre montanhas e vales dos Andes peruanos. O sítio arqueológico impressiona pela engenharia em pedra e pela integração com a paisagem natural. A região também oferece trilhas, mirantes e experiências culturais ligadas à história andina.",
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

        description: "Sydney combina praias, parques, bairros animados e uma das baías mais famosas do mundo. A Ópera de Sydney e a Harbour Bridge são marcos da paisagem urbana. Aproveite para caminhar pela orla, conhecer Bondi Beach e explorar os restaurantes e espaços culturais da cidade.",
    },

    "lisboa": {
        title: "Lisboa",
        city: "Lisboa",
        country: "Portugal",
        countryCode: "PT",
        currency: "EUR",
        images: [
            require("../../../assets/images/lisboa1.jpg"),
            require("../../../assets/images/lisboa2.jpg"),
            require("../../../assets/images/lisboa3.jpg"),
        ],
        description: "Lisboa encanta pelas ruas de pedra, fachadas de azulejos e mirantes sobre o rio Tejo. Os bairros de Alfama e Bairro Alto revelam diferentes lados da cidade, enquanto os bondinhos atravessam suas ladeiras. Não deixe de conhecer Belém e experimentar a gastronomia portuguesa.",
    },

    "istambul": {
        title: "Istambul",
        city: "Istambul",
        country: "Turquia",
        countryCode: "TR",
        currency: "TRY",
        images: [
            require("../../../assets/images/istambul1.jpg"),
            require("../../../assets/images/istambul2.jpg"),
            require("../../../assets/images/istambul3.jpg"),
        ],
        description: "Istambul une influências europeias e asiáticas em uma cidade marcada por séculos de história. Mesquitas monumentais, mercados movimentados e palácios dividem espaço com cafés e bairros modernos. Um passeio pelo Bósforo revela paisagens únicas e a importância do estreito para a cidade.",
    },

    "los-angeles": {
        title: "Los Angeles",
        city: "Los Angeles",
        country: "Estados Unidos",
        countryCode: "US",
        currency: "USD",
        images: [
            require("../../../assets/images/los-angeles1.jpg"),
            require("../../../assets/images/los-angeles2.jpg"),
            require("../../../assets/images/los-angeles3.jpg"),
        ],
        description: "Los Angeles é um dos principais centros mundiais de cinema, música e entretenimento. A cidade reúne bairros conhecidos como Hollywood e Beverly Hills, além de praias e mirantes. Explore Santa Monica, os museus de arte e as diferentes culturas que fazem parte da região.",
    },

    "miami": {
        title: "Miami",
        city: "Miami",
        country: "Estados Unidos",
        countryCode: "US",
        currency: "USD",
        images: [
            require("../../../assets/images/miami1.jpg"),
            require("../../../assets/images/miami2.jpg"),
            require("../../../assets/images/miami3.jpg"),
        ],
        description: "Miami é conhecida pelas praias de águas claras, pelo clima tropical e pela mistura de culturas. South Beach reúne edifícios art déco, restaurantes e uma orla movimentada. Vale conhecer também Wynwood, famoso pela arte urbana, e Little Havana, com forte influência cubana.",
    },

    "hong-kong": {
        title: "Hong Kong",
        city: "Hong Kong",
        country: "China",
        countryCode: "HK",
        currency: "HKD",
        images: [
            require("../../../assets/images/hong-kong1.jpg"),
            require("../../../assets/images/hong-kong2.jpg"),
            require("../../../assets/images/hong-kong3.jpg"),
        ],
        description: "Hong Kong mistura arranha-céus impressionantes, mercados tradicionais e paisagens montanhosas. A vista de Victoria Harbour é um dos cartões-postais da cidade, especialmente à noite. Entre os passeios, descubra templos, trilhas, bairros comerciais e uma gastronomia muito diversa.",
    },

    "florenca": {
        title: "Florença",
        city: "Florença",
        country: "Itália",
        countryCode: "IT",
        currency: "EUR",
        images: [
            require("../../../assets/images/florenca1.jpg"),
            require("../../../assets/images/florenca2.jpg"),
            require("../../../assets/images/florenca3.jpg"),
        ],
        description: "Florença é um dos grandes centros do Renascimento italiano e reúne arte e arquitetura em cada esquina. A Catedral de Santa Maria del Fiore domina a paisagem, enquanto museus e galerias guardam obras históricas. Caminhe pela Ponte Vecchio e aproveite os cafés e mercados da Toscana.",
    },

    "cancun": {
        title: "Cancún",
        city: "Cancún",
        country: "México",
        countryCode: "MX",
        currency: "MXN",
        images: [
            require("../../../assets/images/cancun1.jpg"),
            require("../../../assets/images/cancun2.jpg"),
            require("../../../assets/images/cancun3.jpg"),
        ],
        description: "Cancún atrai visitantes pelas praias de areia clara e pelo mar azul-turquesa do Caribe mexicano. Além dos resorts, a região oferece passeios de barco, cenotes e atividades aquáticas. Também é um ótimo ponto de partida para conhecer sítios arqueológicos maias e outras praias da península de Yucatán.",
    },

    "edimburgo": {
        title: "Edimburgo",
        city: "Edimburgo",
        country: "Reino Unido",
        countryCode: "GB",
        currency: "GBP",
        images: [
            require("../../../assets/images/edimburgo1.jpg"),
            require("../../../assets/images/edimburgo2.jpg"),
            require("../../../assets/images/edimburgo3.jpg"),
        ],
        description: "Edimburgo combina ruas medievais, construções de pedra e colinas com vistas panorâmicas. O castelo domina o centro histórico, enquanto a Royal Mile reúne lojas, museus e histórias da cidade. Explore também os parques e a cena cultural da capital escocesa.",
    },

    "berlim": {
        title: "Berlim",
        city: "Berlim",
        country: "Alemanha",
        countryCode: "DE",
        currency: "EUR",
        images: [
            require("../../../assets/images/berlim1.jpg"),
            require("../../../assets/images/berlim2.jpg"),
            require("../../../assets/images/berlim3.jpg"),
        ],
        description: "Berlim é marcada por uma história intensa e por uma vida cultural contemporânea muito ativa. Monumentos como o Portão de Brandemburgo e os vestígios do Muro ajudam a compreender o passado da cidade. Museus, galerias, parques e bairros criativos completam o roteiro.",
    },

    "hanoi": {
        title: "Hanói",
        city: "Hanói",
        country: "Vietnã",
        countryCode: "VN",
        currency: "VND",
        images: [
            require("../../../assets/images/hanoi1.jpg"),
            require("../../../assets/images/hanoi2.jpg"),
            require("../../../assets/images/hanoi3.jpg"),
        ],
        description: "Hanói reúne lagos tranquilos, templos antigos e ruas movimentadas no coração do Vietnã. O Bairro Antigo é conhecido pelas pequenas lojas, cafés e pela comida de rua. Caminhar ao redor do lago Hoan Kiem é uma ótima forma de sentir o ritmo da cidade.",
    },

    "monte-fuji": {
        title: "Monte Fuji",
        city: "Fujikawaguchiko",
        country: "Japão",
        countryCode: "JP",
        currency: "JPY",
        images: [
            require("../../../assets/images/monte-fuji1.jpg"),
            require("../../../assets/images/monte-fuji2.jpg"),
            require("../../../assets/images/monte-fuji3.jpg"),
        ],
        description: "O Monte Fuji é uma das paisagens mais reconhecidas do Japão e possui grande importância cultural e espiritual. A montanha pode ser admirada de diferentes pontos da região dos Cinco Lagos. Na primavera, flores de cerejeira emolduram a paisagem; em dias claros, o reflexo no lago é inesquecível.",
    },

    "angkor-wat": {
        title: "Angkor Wat",
        city: "Siem Reap",
        country: "Camboja",
        countryCode: "KH",
        currency: "KHR",
        images: [
            require("../../../assets/images/angkor-wat1.jpg"),
            require("../../../assets/images/angkor-wat2.jpg"),
            require("../../../assets/images/angkor-wat3.jpg"),
        ],
        description: "Angkor Wat faz parte de um vasto conjunto arqueológico que preserva a história do antigo Império Khmer. Seus templos apresentam torres, corredores e esculturas detalhadas, cercados por vegetação tropical. O nascer do sol é um dos momentos mais procurados para contemplar a paisagem.",
    },

    "grand-canyon": {
        title: "Grand Canyon",
        city: "Grand Canyon Village",
        country: "Estados Unidos",
        countryCode: "US",
        currency: "USD",
        images: [
            require("../../../assets/images/grand-canyon1.jpg"),
            require("../../../assets/images/grand-canyon2.jpg"),
            require("../../../assets/images/grand-canyon3.jpg"),
        ],
        description: "O Grand Canyon impressiona pela extensão, pelas camadas de rocha e pelas cores que mudam com a luz do dia. Seus mirantes oferecem perspectivas diferentes do cânion esculpido pelo rio Colorado. A região também conta com trilhas e oportunidades para conhecer melhor a geologia local.",
    },

    "niagara": {
        title: "Cataratas do Niágara",
        city: "Niagara Falls",
        country: "Canadá",
        countryCode: "CA",
        currency: "CAD",
        images: [
            require("../../../assets/images/niagara1.jpg"),
            require("../../../assets/images/niagara2.jpg"),
            require("../../../assets/images/niagara3.jpg"),
        ],
        description: "As Cataratas do Niágara formam um conjunto de quedas-d’água na fronteira entre Canadá e Estados Unidos. A força da água e a névoa criam um espetáculo natural visto de diferentes mirantes. Passeios de barco e trilhas próximas permitem observar a paisagem de outros ângulos.",
    },

    "blue-lagoon": {
        title: "Blue Lagoon",
        city: "Grindavík",
        country: "Islândia",
        countryCode: "IS",
        currency: "ISK",
        images: [
            require("../../../assets/images/blue-lagoon1.jpg"),
            require("../../../assets/images/blue-lagoon2.jpg"),
            require("../../../assets/images/blue-lagoon3.jpg"),
        ],
        description: "A Blue Lagoon é conhecida pelas águas geotérmicas de tom azul-leitoso em meio a campos de lava na Islândia. O contraste entre a água quente e a paisagem vulcânica torna o lugar especialmente fotogênico. É uma experiência de relaxamento muito procurada por quem visita a região.",
    },

    "everest": {
        title: "Monte Everest",
        city: "Catmandu",
        country: "Nepal",
        countryCode: "NP",
        currency: "NPR",
        images: [
            require("../../../assets/images/everest1.jpg"),
            require("../../../assets/images/everest2.jpg"),
            require("../../../assets/images/everest3.jpg"),
        ],
        description: "O Monte Everest, no Himalaia, é a montanha mais alta do planeta acima do nível do mar. A região atrai viajantes interessados em paisagens de altitude, cultura sherpa e trilhas de longa distância. Os percursos exigem planejamento e preparo, mas oferecem vistas extraordinárias das montanhas.",
    },

    "salar-de-uyuni": {
        title: "Salar de Uyuni",
        city: "Uyuni",
        country: "Bolívia",
        countryCode: "BO",
        currency: "BOB",
        images: [
            require("../../../assets/images/salar-de-uyuni1.jpg"),
            require("../../../assets/images/salar-de-uyuni2.jpg"),
            require("../../../assets/images/salar-de-uyuni3.jpg"),
        ],
        description: "O Salar de Uyuni, na Bolívia, é uma imensa extensão branca de sal cercada por paisagens andinas. Durante parte da estação chuvosa, uma fina camada de água pode transformar a superfície em um grande espelho natural. Os passeios também revelam ilhas de cactos e cenários surpreendentes.",
    },

    "victoria-falls": {
        title: "Victoria Falls",
        city: "Livingstone",
        country: "Zâmbia",
        countryCode: "ZM",
        currency: "ZMW",
        images: [
            require("../../../assets/images/victoria-falls1.jpg"),
            require("../../../assets/images/victoria-falls2.jpg"),
            require("../../../assets/images/victoria-falls3.jpg"),
        ],
        description: "Victoria Falls é uma impressionante queda-d’água do rio Zambeze, na fronteira entre Zâmbia e Zimbábue. O volume de água cria uma névoa visível à distância e uma paisagem de grande força natural. Mirantes e trilhas permitem conhecer diferentes trechos das cataratas.",
    },

    "kilimanjaro": {
        title: "Kilimanjaro",
        city: "Moshi",
        country: "Tanzânia",
        countryCode: "TZ",
        currency: "TZS",
        images: [
            require("../../../assets/images/kilimanjaro1.jpg"),
            require("../../../assets/images/kilimanjaro2.jpg"),
            require("../../../assets/images/kilimanjaro3.jpg"),
        ],
        description: "O Kilimanjaro é a montanha mais alta da África e se destaca sobre as planícies da Tanzânia. Suas rotas atravessam diferentes zonas de vegetação até chegar às paisagens de alta altitude. Mesmo para quem não pretende subir ao cume, a região oferece vistas e experiências ligadas à natureza.",
    },

    "uluru": {
        title: "Uluru",
        city: "Yulara",
        country: "Austrália",
        countryCode: "AU",
        currency: "AUD",
        images: [
            require("../../../assets/images/uluru1.jpg"),
            require("../../../assets/images/uluru2.jpg"),
            require("../../../assets/images/uluru3.jpg"),
        ],
        description: "Uluru é uma enorme formação rochosa no interior da Austrália, conhecida pelas cores que variam conforme a luz do dia. O local tem profundo significado cultural e espiritual para o povo Anangu, guardião tradicional da região. Caminhadas e visitas guiadas ajudam a conhecer sua paisagem e história.",
    },
};


/* =========================================================
   TELA
========================================================= */

export default function DestinationScreen() {
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);


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
                        color={axisPalette.accentText}
                    />
                </Pressable>

            </View>
        );
    }


    return (

        <View style={styles.container}>
            <GlassBackdrop />

            <StatusBar
                barStyle="light-content"
                
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
                            color={axisPalette.accentText}
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


                    {/* PREÇO / BOTÃO */}

                    <View
                        style={
                            styles.bottom
                        }
                    >

                        <View>

                            


                            

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

const createStyles = (palette: GlassPalette) => StyleSheet.create({

    container: {
        flex: 1,

        backgroundColor: glassColor("backgroundColor", "#111111", "container", palette),
    },

    scrollContent: {
        minHeight: height,
        paddingBottom: 0,
        backgroundColor: palette.background,
    },


    /* HERO */

    hero: {
        width: "100%",

        height: height * 0.51,

        position: "relative",
    },

    heroCarousel: {
        width: "100%",

        height: "100%",
    },

    heroImage: {
        width: width,

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

        bottom: 40,

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
        backgroundColor: glassColor("backgroundColor", "#ffffff", "dotActive", palette),
    },


    /* DETALHES */

    details: {
        width: "100%",
        alignSelf: "stretch",
        flexGrow: 1,
        minHeight: height * 0.49 + 24,
        backgroundColor: palette.background,

        marginTop: -24,

        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,

        paddingHorizontal: 28,
        paddingTop: 45,
        paddingBottom: 65,
    },

    title: {
        fontSize: 29,

        fontWeight: "800",

        color: glassColor("color", "#303030", "title", palette),
    },

    location: {
        marginTop: 8,

        fontSize: 14,

        color: glassColor("color", "#777777", "location", palette),
    },

    description: {
        marginTop: 28,

        fontSize: 16,

        lineHeight: 24,

        color: glassColor("color", "#777777", "description", palette),
    },


    /* BOTTOM */

    bottom: {
        marginTop: 46,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "flex-end",
    },

   

    perPerson: {
        marginTop: 4,

        fontSize: 14,

        color: glassColor("color", "#999999", "perPerson", palette),
    },

    routeButton: {
        minWidth: 190,

        height: 58,

        paddingHorizontal: 15,

        borderRadius: 30,

        backgroundColor: palette.accent,

        alignItems: "center",

        justifyContent: "center",
    },

    routeButtonText: {
        color: palette.accentText,

        fontSize: 15,

        fontWeight: "600",
    },


    /* ERROR */

    errorContainer: {
        flex: 1,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "errorContainer", palette),
    },

    errorText: {
        fontSize: 18,

        color: glassColor("color", "#333333", "errorText", palette),
    },

});