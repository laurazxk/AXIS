import { useState } from "react";
import {
    Image,
    Pressable,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GlassBottomNav from "../../components/GlassBottomNav";

export default function ProfileScreen() {

    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <View style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#f7f7f7"
            />

            <View
                style={[
                    styles.content,
                    {
                        paddingTop: insets.top,
                    },
                ]}
            >

                {/* CABEÇALHO */}

                <View style={styles.header}>

                    <Pressable style={styles.menuButton}>
                        <MaterialIcons
                            name="menu"
                            size={27}
                            color="#8492a8"
                        />
                    </Pressable>

                    <Text style={styles.headerTitle}>
                        Meu Perfil
                    </Text>

                    <View style={styles.headerSpace} />

                </View>


                {/* CARD DO PERFIL */}

                <View style={styles.profileCard}>

                    <Image
                        source={require("../../assets/images/perfil.jpg")}
                        style={styles.profileImage}
                        resizeMode="cover"
                    />

                    <View style={styles.profileInfo}>

                        <Text style={styles.name}>
                            Kyara Murayama
                        </Text>

                        <Text style={styles.email}>
                            kyaram@gmail.com
                        </Text>

                    </View>

                </View>


                {/* CONFIGURAÇÕES */}

                <View style={styles.settings}>

                    <Text style={styles.sectionTitle}>
                        Configurações
                    </Text>

                    <View style={styles.settingsCard}>

                        {/* MODO ESCURO */}

                        <View style={styles.settingRow}>

                            <View style={styles.settingInfo}>

                                <MaterialIcons
                                    name="dark-mode"
                                    size={23}
                                    color="#8492a8"
                                />

                                <Text style={styles.settingText}>
                                    Modo escuro
                                </Text>

                            </View>

                            <Switch
                                value={darkMode}
                                onValueChange={setDarkMode}
                            />

                        </View>


                        {/* NOTIFICAÇÕES */}

                        <View style={styles.settingRow}>

                            <View style={styles.settingInfo}>

                                <MaterialIcons
                                    name="notifications-none"
                                    size={24}
                                    color="#8492a8"
                                />

                                <Text style={styles.settingText}>
                                    Notificações
                                </Text>

                            </View>

                            <Switch
                                value={notifications}
                                onValueChange={setNotifications}
                            />

                        </View>


                        {/* SOBRE */}

                        <Pressable
                            style={styles.settingRow}
                            onPress={() => router.push("/logic/about")}
                        >

                            <View style={styles.settingInfo}>

                                <MaterialIcons
                                    name="info-outline"
                                    size={24}
                                    color="#8492a8"
                                />

                                <Text style={styles.settingText}>
                                    Sobre
                                </Text>

                            </View>

                            <MaterialIcons
                                name="chevron-right"
                                size={25}
                                color="#8492a8"
                            />

                        </Pressable>

                    </View>

                </View>

            </View>


            {/* NAVEGAÇÃO INFERIOR */}

            <GlassBottomNav />

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },

    content: {
        flex: 1,
    },

    header: {
        height: 65,
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

    headerSpace: {
        width: 40,
        height: 40,
    },

    profileCard: {
        marginHorizontal: 25,
        marginTop: 25,
        paddingVertical: 22,
        backgroundColor: "#ffffff",
        borderRadius: 18,
        alignItems: "center",

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
    },

    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },

    profileInfo: {
        alignItems: "center",
        marginTop: 12,
    },

    name: {
        fontSize: 19,
        fontWeight: "700",
        color: "#303030",
    },

    email: {
        marginTop: 5,
        fontSize: 13,
        color: "#8b8b8b",
    },

    settings: {
        marginTop: 35,
        marginHorizontal: 25,
    },

    sectionTitle: {
        marginBottom: 12,
        fontSize: 19,
        fontWeight: "700",
        color: "#8492a8",
    },

    settingsCard: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        paddingHorizontal: 17,

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
    },

    settingRow: {
        minHeight: 62,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },

    settingInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    settingText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
    },

});