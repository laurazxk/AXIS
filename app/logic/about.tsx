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
    {
        id: "julia",
        name: "Julia Bandeira Freitas da Silva",
        image: require("../../assets/images/julia.jpg"),
    },
    {
        id: "kyara",
        name: "Kyara Murayama de Oliveira",
        image: require("../../assets/images/kyara.jpg"),
    },
    {
        id: "laila",
        name: "Laila Camile Gonçalves de Menezes",
        image: require("../../assets/images/laila.jpg"),
    },
    {
        id: "laura",
        name: "Laura Santos Marques",
        image: require("../../assets/images/laura.jpg"),
    },
];

export default function AboutScreen() {
    const { palette: axisPalette } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <GlassBackdrop />

            <View style={[styles.header, { paddingTop: insets.top }]}>
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={26} color={axisPalette.muted} />
                </Pressable>
                <Text style={styles.headerTitle}>Sobre</Text>
                <View style={styles.headerSpace} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.axisTitle}>Axis</Text>
                <Text style={styles.description}>
                    Um aplicativo criado para facilitar a organização de viagens em grupo.
                </Text>

                <Text style={styles.sectionTitle}>Nossa equipe</Text>

                {team.map((member) => (
                    <View key={member.id} style={styles.memberCard}>
                        <GlassFrost />
                        <Image
                            source={member.image}
                            style={styles.memberPhoto}
                            resizeMode="cover"
                        />
                        <Text style={styles.memberName}>{member.name}</Text>
                    </View>
                ))}
            </ScrollView>

            <GlassBottomNav />
        </View>
    );
}

const createStyles = (palette: GlassPalette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
    },
    header: {
        height: 75,
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
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 120,
    },
    axisTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: glassColor("color", "#303030", "axisTitle", palette),
        textAlign: "center",
    },
    description: {
        marginTop: 8,
        fontSize: 14,
        color: glassColor("color", "#888888", "description", palette),
        textAlign: "center",
        lineHeight: 21,
    },
    sectionTitle: {
        marginTop: 35,
        marginBottom: 14,
        fontSize: 19,
        fontWeight: "700",
        color: glassColor("color", "#8492a8", "sectionTitle", palette),
    },
    memberCard: {
        ...glassDecoration("memberCard", palette),
        minHeight: 78,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "memberCard", palette),
        borderRadius: 15,
        marginBottom: 12,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: glassColor("shadowColor", "#000000", "memberCard", palette),
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    memberPhoto: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 14,
    },
    memberName: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
        color: glassColor("color", "#333333", "memberName", palette),
    },
});