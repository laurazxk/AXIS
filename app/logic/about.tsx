import React from "react";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import GlassBackdrop from "../../components/GlassBackdrop";
import GlassFrost from "../../components/GlassFrost";
import { glassColor, glassDecoration, type GlassPalette } from "../../constants/glass";
import { useAxisTheme } from "../../contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GlassBottomNav from "../../components/GlassBottomNav";

const team = [
    { id: "julia", name: "Julia Bandeira Freitas da Silva", image: require("../../assets/images/julia.jpg") },
    { id: "kyara", name: "Kyara Murayama de Oliveira", image: require("../../assets/images/kyara.jpg") },
    { id: "laila", name: "Laila Camile Gonçalves de Menezes", image: require("../../assets/images/laila.jpg") },
    { id: "laura", name: "Laura Santos Marques", image: require("../../assets/images/laura.jpg") },
];

export default function AboutScreen() {
    const { palette: axisPalette, darkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette, darkMode), [axisPalette, darkMode]);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <GlassBackdrop />

            <View style={[styles.header, { paddingTop: insets.top, height: insets.top + 56 }]}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    accessibilityLabel="Voltar"
                >
                    <MaterialIcons name="arrow-back" size={25} color={axisPalette.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Sobre</Text>
                <View style={styles.headerSpace} />
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: 130 + insets.bottom }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.intro}>
                    <Text style={styles.axisTitle}>AXIS</Text>
                    <Text style={styles.tagline}>Sua viagem começa aqui.</Text>
                </View>

                <View style={styles.aboutCard}>
                    <GlassFrost />
                    <Text style={styles.aboutHeading}>Sobre o aplicativo</Text>
                    <Text style={styles.paragraph}>
                        O AXIS é um aplicativo desenvolvido para tornar o planejamento de viagens mais simples, organizado e colaborativo.
                    </Text>
                    <Text style={styles.paragraph}>
                        Criado para quem ama explorar novos destinos, o AXIS reúne em um só lugar as principais ferramentas para organizar uma viagem, desde a escolha do destino até a criação de roteiros personalizados, o controle de despesas e o planejamento de atividades.
                    </Text>
                    <Text style={styles.paragraph}>
                        Com uma interface moderna e intuitiva, o aplicativo também permite compartilhar viagens com outras pessoas, facilitando a organização em grupo.
                    </Text>
                    <Text style={[styles.paragraph, styles.lastParagraph]}>
                        Mais do que planejar viagens, o AXIS foi criado para transformar ideias em experiências, tornando cada etapa da jornada mais prática e acessível.
                    </Text>
                </View>

                <View style={styles.sectionHeadingRow}>
                    <Text style={styles.sectionTitle}>Nossa equipe</Text>
                    <Text style={styles.teamCount}>4 integrantes</Text>
                </View>

                {team.map((member) => (
                    <View key={member.id} style={styles.memberCard}>
                        <GlassFrost />
                        <Image source={member.image} style={styles.memberPhoto} resizeMode="cover" />
                        <Text style={styles.memberName}>{member.name}</Text>
                    </View>
                ))}
            </ScrollView>

            <GlassBottomNav />
        </View>
    );
}

const createStyles = (palette: GlassPalette, darkMode: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
    },
    header: {
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
        color: palette.text,
    },
    headerSpace: { width: 40, height: 40 },
    content: {
        paddingHorizontal: 22,
        paddingTop: 20,
    },
    intro: {
        alignItems: "center",
        marginBottom: 26,
    },
    axisTitle: {
        fontSize: 34,
        fontWeight: "800",
        letterSpacing: 2,
        color: palette.text,
        textAlign: "center",
    },
    tagline: {
        marginTop: 5,
        fontSize: 13,
        color: palette.muted,
        textAlign: "center",
    },
    aboutCard: {
        ...glassDecoration("memberCard", palette),
        backgroundColor: glassColor("backgroundColor", "#ffffff", "memberCard", palette),
        borderRadius: 20,
        paddingHorizontal: 21,
        paddingVertical: 23,
        overflow: "hidden",
    },
    aboutHeading: {
        fontSize: 17,
        fontWeight: "700",
        color: palette.text,
        marginBottom: 14,
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 23,
        color: darkMode ? "#D3D3D3" : "#5C5C5C",
        textAlign: "left",
        marginBottom: 15,
    },
    lastParagraph: { marginBottom: 0 },
    sectionHeadingRow: {
        marginTop: 32,
        marginBottom: 14,
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: "700",
        color: palette.text,
    },
    teamCount: {
        fontSize: 12,
        color: palette.muted,
    },
    memberCard: {
        ...glassDecoration("memberCard", palette),
        minHeight: 82,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "memberCard", palette),
        borderRadius: 16,
        marginBottom: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        shadowColor: glassColor("shadowColor", "#000000", "memberCard", palette),
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    memberPhoto: {
        width: 54,
        height: 54,
        borderRadius: 27,
        marginRight: 14,
    },
    memberName: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "600",
        color: palette.text,
    },
});