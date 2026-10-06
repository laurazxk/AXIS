import {
    Pressable,
    StyleSheet,
    View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { BlurView } from "expo-blur";

import { usePathname, useRouter } from "expo-router";

export default function GlassBottomNav() {
    const router = useRouter();
    const pathname = usePathname();

    const isHome =
        pathname === "/logic/home";

    const isExpenses =
        pathname === "/logic/trips/expenses" ||
        pathname.startsWith("/logic/expenses");

    const isTrips =
        pathname.startsWith("/logic/trips") &&
        !isExpenses;

    const isProfile =
        pathname.startsWith("/logic/profile");

    return (
        <View style={styles.wrapper}>
            <BlurView
                intensity={80}
                tint="dark"
                style={styles.navigation}
            >
                {/* VIAGENS */}

                <Pressable
                    style={styles.navItem}
                    onPress={() =>
                        router.push("/logic/trips")
                    }
                >
                    <View
                        style={[
                            styles.iconContainer,
                            isTrips &&
                                styles.activeIconContainer,
                        ]}
                    >
                        <MaterialIcons
                            name="luggage"
                            size={25}
                            color={
                                isTrips
                                    ? "#ffffff"
                                    : "rgba(255,255,255,0.75)"
                            }
                        />
                    </View>
                </Pressable>

                {/* HOME */}

                <Pressable
                    style={styles.navItem}
                    onPress={() =>
                        router.push("/logic/home")
                    }
                >
                    <View
                        style={[
                            styles.iconContainer,
                            isHome &&
                                styles.activeIconContainer,
                        ]}
                    >
                        <MaterialIcons
                            name="home"
                            size={27}
                            color={
                                isHome
                                    ? "#ffffff"
                                    : "rgba(255,255,255,0.75)"
                            }
                        />
                    </View>
                </Pressable>

                {/* DESPESAS */}

                <Pressable
                    style={styles.navItem}
                    onPress={() =>
                        router.push(
                            "/logic/trips/expenses"
                        )
                    }
                >
                    <View
                        style={[
                            styles.iconContainer,
                            isExpenses &&
                                styles.activeIconContainer,
                        ]}
                    >
                        <MaterialIcons
                            name="attach-money"
                            size={27}
                            color={
                                isExpenses
                                    ? "#ffffff"
                                    : "rgba(255,255,255,0.75)"
                            }
                        />
                    </View>
                </Pressable>

                {/* PERFIL */}

                <Pressable
                    style={styles.navItem}
                    onPress={() =>
                        router.push("/logic/profile")
                    }
                >
                    <View
                        style={[
                            styles.iconContainer,
                            isProfile &&
                                styles.activeIconContainer,
                        ]}
                    >
                        <MaterialIcons
                            name="person"
                            size={27}
                            color={
                                isProfile
                                    ? "#ffffff"
                                    : "rgba(255,255,255,0.75)"
                            }
                        />
                    </View>
                </Pressable>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        left: 20,
        right: 20,
        bottom: 12,
        height: 66,
        zIndex: 100,
    },

    navigation: {
        height: 66,
        borderRadius: 34,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor:
            "rgba(70,70,70,0.55)",
        borderWidth: 1,
        borderColor:
            "rgba(255,255,255,0.40)",
    },

    navItem: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
    },

    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },

    activeIconContainer: {
        backgroundColor:
            "rgba(255,255,255,0.15)",
        borderWidth: 1,
        borderColor:
            "rgba(255,255,255,0.35)",
        shadowColor: "#ffffff",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
});