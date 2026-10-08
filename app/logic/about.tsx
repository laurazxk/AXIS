import GlassFrost from "../../components/GlassFrost";
import { useAxisTheme } from "../../contexts/ThemeContext";
import { glassColor, glassDecoration, type GlassPalette } from "../../constants/glass";
import GlassBackdrop from "../../components/GlassBackdrop";
import React from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import GlassBottomNav from "../../components/GlassBottomNav";


export default function AboutScreen() {
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);


    const router = useRouter();

    const insets = useSafeAreaInsets();


    return (
        <View style={styles.container}>
            <GlassBackdrop />

            {/* CABEÇALHO */}

            <View
                style={[
                    styles.header,
                    {
                        paddingTop: insets.top,
                    },
                ]}
            >

                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons
                        name="arrow-back"
                        size={26}
                        color={axisPalette.muted}
                    />
                </Pressable>

                <Text style={styles.headerTitle}>
                    Sobre
                </Text>

                <View style={styles.headerSpace} />

            </View>


            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                <Text style={styles.axisTitle}>
                    Axis
                </Text>

                <Text style={styles.description}>
                    Um aplicativo criado para facilitar a organização
                    de viagens em grupo.
                </Text>


                <Text style={styles.sectionTitle}>
                    Nossa equipe
                </Text>


                {/* JULIA */}

                <View style={styles.memberCard}>
                <GlassFrost />

                    <View style={styles.photoPlaceholder}>
                        <MaterialIcons
                            name="person"
                            size={38}
                            color={axisPalette.muted}
                        />
                    </View>

                    <Text style={styles.memberName}>
                        Julia Bandeira Freitas da Silva
                    </Text>

                </View>


                {/* KYARA */}

                <View style={styles.memberCard}>
                <GlassFrost />

                    <View style={styles.photoPlaceholder}>
                        <MaterialIcons
                            name="person"
                            size={38}
                            color={axisPalette.muted}
                        />
                    </View>

                    <Text style={styles.memberName}>
                        Kyara Murayama de Oliveira
                    </Text>

                </View>


                {/* LAILA */}

                <View style={styles.memberCard}>
                <GlassFrost />

                    <View style={styles.photoPlaceholder}>
                        <MaterialIcons
                            name="person"
                            size={38}
                            color={axisPalette.muted}
                        />
                    </View>

                    <Text style={styles.memberName}>
                        Laila Camile Gonçalves de Menezes
                    </Text>

                </View>


                {/* LAURA */}

                <View style={styles.memberCard}>
                <GlassFrost />

                    <View style={styles.photoPlaceholder}>
                        <MaterialIcons
                            name="person"
                            size={38}
                            color={axisPalette.muted}
                        />
                    </View>

                    <Text style={styles.memberName}>
                        Laura Santos Marques
                    </Text>

                </View>

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
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },

    photoPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: glassColor("backgroundColor", "#eef0f4", "photoPlaceholder", palette),
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    memberName: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
        color: glassColor("color", "#333333", "memberName", palette),
    },

});
