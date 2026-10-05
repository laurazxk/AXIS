import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { savedTrips } from "../trips/tripStore";

export default function ExpenseTripScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const trip = savedTrips.find((item) => item.id === id);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backText}>‹</Text>
                    </Pressable>

                    <View>
                        <Text style={styles.title}>
                            {trip?.destination || "Viagem"}
                        </Text>

                        <Text style={styles.country}>
                            {trip?.country || ""}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>
                    Métricas Diárias
                </Text>

                <View style={styles.metricsContainer}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>
                            Orçamento Total
                        </Text>

                        <Text style={styles.metricValue}>
                            R$ 10.000,00
                        </Text>
                    </View>

                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>
                            Média Diária
                        </Text>

                        <Text style={styles.metricValue}>
                            R$ 2.500,00
                        </Text>
                    </View>
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>
                        Distribuição dos gastos
                    </Text>

                    <View style={styles.chart}>
                        <View style={styles.chartTop} />
                        <View style={styles.chartRight} />
                        <View style={styles.chartBottom} />
                        <View style={styles.chartLeft} />
                    </View>

                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.dot, styles.dotBlue]} />
                            <Text style={styles.legendText}>
                                Passagem 33%
                            </Text>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.dot, styles.dotGreen]} />
                            <Text style={styles.legendText}>
                                Hospedagem 29%
                            </Text>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.dot, styles.dotYellow]} />
                            <Text style={styles.legendText}>
                                Alimentação 21%
                            </Text>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.dot, styles.dotPurple]} />
                            <Text style={styles.legendText}>
                                Passeios 17%
                            </Text>
                        </View>
                    </View>
                </View>

                <Pressable
                    style={styles.addButton}
                    onPress={() => router.push("/logic/expenses/new")}
                >
                    <Text style={styles.addButtonText}>
                        + Adicionar Despesa
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    backText: {
        fontSize: 30,
        color: "#303030",
        lineHeight: 32,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#303030",
    },

    country: {
        marginTop: 4,
        fontSize: 14,
        color: "#888888",
    },

    sectionTitle: {
        marginTop: 32,
        marginBottom: 14,
        fontSize: 18,
        fontWeight: "700",
        color: "#303030",
    },

    metricsContainer: {
        flexDirection: "row",
        gap: 12,
    },

    metricCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 18,
    },

    metricLabel: {
        fontSize: 12,
        color: "#888888",
        marginBottom: 8,
    },

    metricValue: {
        fontSize: 17,
        fontWeight: "700",
        color: "#303030",
    },

    chartCard: {
        marginTop: 18,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 20,
    },

    chartTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#303030",
        marginBottom: 18,
    },

    expenseRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
    },

    chart: {
        width: 180,
        height: 180,
        borderRadius: 90,
        alignSelf: "center",
        marginBottom: 24,
        overflow: "hidden",
        position: "relative",
    },

    chartTop: {
        position: "absolute",
        width: "100%",
        height: "50%",
        backgroundColor: "#6C8CFF",
        top: 0,
        left: 0,
    },

    chartRight: {
        position: "absolute",
        width: "50%",
        height: "50%",
        backgroundColor: "#7BCFA6",
        top: "50%",
        right: 0,
    },

    chartBottom: {
        position: "absolute",
        width: "50%",
        height: "50%",
        backgroundColor: "#F2C94C",
        bottom: 0,
        left: 0,
    },

    chartLeft: {
        position: "absolute",
        width: "50%",
        height: "50%",
        backgroundColor: "#B58CFF",
        top: "50%",
        left: 0,
    },

    legend: {
        gap: 10,
    },

    legendItem: {
        flexDirection: "row",
        alignItems: "center",
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },

    dotBlue: {
        backgroundColor: "#6C8CFF",
    },

    dotGreen: {
        backgroundColor: "#7BCFA6",
    },

    dotYellow: {
        backgroundColor: "#F2C94C",
    },

    dotPurple: {
        backgroundColor: "#B58CFF",
    },

    legendText: {
        fontSize: 13,
        color: "#555555",
    },

    addButton: {
        marginTop: 24,
        backgroundColor: "#303030",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
    },

    addButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});