import { useRouter } from "expo-router";
import {
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GlassBottomNav from "../../../components/GlassBottomNav";
import { savedTrips } from "./tripStore";

export default function ExpensesScreen() {
    const insets = useSafeAreaInsets();
    const hasTrips = savedTrips.length > 0;
    const router = useRouter();

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
                        paddingTop: insets.top + 20,
                    },
                ]}
            >
                <Text style={styles.title}>
                    Despesas
                </Text>

                <Text style={styles.subtitle}>
                    Organize os gastos das suas viagens.
                </Text>

                {hasTrips && (
                    <View style={styles.tripsContainer}>
                        {savedTrips.map((trip) => (
                            <Pressable
                                key={trip.id}
                                style={styles.tripCard}
                                onPress={() =>
                                    router.push({
                                        pathname: "/logic/expenses/[id]",
                                        params: { id: trip.id },
                                    })
                                }
                            >
                                <Text style={styles.tripDestination}>
                                    {trip.destination}
                                </Text>

                                <Text style={styles.tripCountry}>
                                    {trip.country}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>

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
        paddingHorizontal: 24,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#303030",
    },

    subtitle: {
        marginTop: 8,
        fontSize: 14,
        color: "#888888",
    },

    tripsContainer: {
        marginTop: 30,
    },

    tripCard: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    tripDestination: {
        fontSize: 18,
        fontWeight: "700",
        color: "#303030",
        marginBottom: 5,
    },

    tripCountry: {
        fontSize: 13,
        color: "#888888",
    },
});