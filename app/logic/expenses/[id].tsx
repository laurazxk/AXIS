import GlassFrost from "../../../components/GlassFrost";
import { useAxisTheme } from "../../../contexts/ThemeContext";
import { glassColor, glassDecoration, type GlassPalette } from "../../../constants/glass";
import GlassBackdrop from "../../../components/GlassBackdrop";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { savedTrips } from "../trips/tripStore";

type ExpenseGroup = {
    key: string;
    name: string;
    color: string;
    currency: string;
    value: number;
};

const PIE_COLORS: Record<string, string> = {
    red: "#E57373",
    blue: "#6C8CFF",
    green: "#7BCFA6",
    yellow: "#F2C94C",
};

function getColor(color: string) {
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return color;
    }

    return PIE_COLORS[color] || "#999999";
}

function formatMoney(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

// Formatação usada apenas nos 3 cards.
// Mantém o valor calculado com centavos,
// mas remove os centavos somente na exibição.
function formatMetricMoney(value: number) {
    return Math.trunc(value).toLocaleString("pt-BR");
}

function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
) {
    const angleInRadians =
        ((angleInDegrees - 90) * Math.PI) / 180;

    return {
        x:
            centerX +
            radius * Math.cos(angleInRadians),
        y:
            centerY +
            radius * Math.sin(angleInRadians),
    };
}

function createPieSlicePath(
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number
) {
    const start = polarToCartesian(
        centerX,
        centerY,
        radius,
        endAngle
    );

    const end = polarToCartesian(
        centerX,
        centerY,
        radius,
        startAngle
    );

    const largeArcFlag =
        endAngle - startAngle > 180 ? 1 : 0;

    return [
        `M ${centerX} ${centerY}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
        "Z",
    ].join(" ");
}

export default function ExpenseTripScreen() {
    const { palette: axisPalette, darkMode: axisDarkMode, setDarkMode: setAxisDarkMode } = useAxisTheme();
    const styles = React.useMemo(() => createStyles(axisPalette), [axisPalette]);

    const { id } = useLocalSearchParams<{
        id: string;
    }>();

    const router = useRouter();

    const trip = savedTrips.find(
        (item) => item.id === id
    );

    const expenses = trip?.expenses ?? [];

    /*
     * Agrupa despesas com:
     * mesmo nome + mesma cor + mesma moeda.
     *
     * Exemplo:
     * Compras + verde + BRL = R$ 5
     * Compras + verde + BRL = R$ 3
     *
     * Resultado:
     * Compras + verde + BRL = R$ 8
     */

    const groupedExpenses =
        expenses.reduce<ExpenseGroup[]>(
            (groups, expense) => {
                const currency =
                    expense.currency ||
                    trip?.budgetCurrency ||
                    "BRL";

                const key = `${expense.name.trim().toLowerCase()}-${expense.color}-${currency}`;

                const existingGroup =
                    groups.find(
                        (group) =>
                            group.key === key
                    );

                if (existingGroup) {
                    existingGroup.value +=
                        expense.value;
                } else {
                    groups.push({
                        key,
                        name: expense.name.trim(),
                        color: expense.color,
                        currency,
                        value: expense.value,
                    });
                }

                return groups;
            },
            []
        );

    const totalSpent = expenses.reduce(
        (total, expense) =>
            total + expense.value,
        0
    );

    const totalForPie =
        groupedExpenses.reduce(
            (total, expense) =>
                total + expense.value,
            0
        );

    const pieSize = 230;
    const center = pieSize / 2;
    const radius = 105;

    let currentAngle = 0;

    return (
        <View style={styles.container}>
            <GlassBackdrop />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backText}>
                            ‹
                        </Text>
                    </Pressable>

                    <View>
                        <Text style={styles.title}>
                            {trip?.destination ||
                                "Viagem"}
                        </Text>

                        <Text style={styles.country}>
                            {trip?.country || ""}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>
                    Orçamento e gastos por dia
                </Text>

                <View style={styles.metricsContainer}>
                    <View style={styles.metricCard}>
                <GlassFrost />
                        <Text
                            style={styles.metricLabel}
                        >
                            Orçamento Total
                        </Text>

                        <Text
                            style={styles.metricValue}
                        >
                            {trip?.budgetCurrency ||
                                "BRL"}{" "}
                            {trip?.budget
                                ? formatMetricMoney(
                                      Number(
                                          trip.budget
                                      )
                                  )
                                : "Não informado"}
                        </Text>
                    </View>

                    <View style={styles.metricCard}>
                <GlassFrost />
                        <Text
                            style={styles.metricLabel}
                        >
                            Média Diária
                        </Text>

                        <Text
                            style={styles.metricValue}
                        >
                            {trip?.budget &&
                            trip.duration
                                ? `${trip.budgetCurrency} ${formatMetricMoney(
                                      Number(
                                          trip.budget
                                      ) /
                                          trip.duration
                                  )}`
                                : "Não informado"}
                        </Text>
                    </View>

                    <View style={styles.metricCard}>
                <GlassFrost />
                        <Text
                            style={styles.metricLabel}
                        >
                            Total Gasto
                        </Text>

                        <Text
                            style={styles.metricValue}
                        >
                            {trip?.budgetCurrency ||
                                "BRL"}{" "}
                            {formatMetricMoney(
                                totalSpent
                            )}
                        </Text>
                    </View>
                </View>

                <View style={styles.chartCard}>
                <GlassFrost />
                    <Text style={styles.chartTitle}>
                        Gastos por categoria
                    </Text>

                    {groupedExpenses.length > 0 ? (
                        <>
                            <View
                                style={
                                    styles.pieContainer
                                }
                            >
                                <Svg
                                    width={pieSize}
                                    height={pieSize}
                                    viewBox={`0 0 ${pieSize} ${pieSize}`}
                                >
                                    {groupedExpenses.map(
                                        (expense) => {
                                            const percentage =
                                                expense.value /
                                                totalForPie;

                                            const angle =
                                                percentage *
                                                360;

                                            const startAngle =
                                                currentAngle;

                                            const endAngle =
                                                currentAngle +
                                                angle;

                                            currentAngle =
                                                endAngle;

                                            /*
                                             * Caso exista apenas
                                             * uma categoria, usamos
                                             * um círculo completo.
                                             */

                                            if (
                                                groupedExpenses.length ===
                                                    1 ||
                                                angle >=
                                                    359.99
                                            ) {
                                                return (
                                                    <Path
                                                        key={
                                                            expense.key
                                                        }
                                                        d={`
                                                            M ${center} ${center}
                                                            m -${radius}, 0
                                                            a ${radius},${radius} 0 1,0 ${radius * 2},0
                                                            a ${radius},${radius} 0 1,0 -${radius * 2},0
                                                        `}
                                                        fill={getColor(
                                                            expense.color
                                                        )}
                                                    />
                                                );
                                            }

                                            return (
                                                <Path
                                                    key={
                                                        expense.key
                                                    }
                                                    d={createPieSlicePath(
                                                        center,
                                                        center,
                                                        radius,
                                                        startAngle,
                                                        endAngle
                                                    )}
                                                    fill={getColor(
                                                        expense.color
                                                    )}
                                                />
                                            );
                                        }
                                    )}
                                </Svg>
                            </View>

                            <View
                                style={
                                    styles.legend
                                }
                            >
                                {groupedExpenses.map(
                                    (expense) => {
                                        const percentage =
                                            totalForPie >
                                            0
                                                ? (expense.value /
                                                      totalForPie) *
                                                  100
                                                : 0;

                                        return (
                                            <View
                                                key={
                                                    expense.key
                                                }
                                                style={
                                                    styles.legendItem
                                                }
                                            >
                                                <View
                                                    style={[
                                                        styles.legendColor,
                                                        {
                                                            backgroundColor:
                                                                getColor(
                                                                    expense.color
                                                                ),
                                                        },
                                                    ]}
                                                />

                                                <View
                                                    style={
                                                        styles.legendInfo
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.legendName
                                                        }
                                                    >
                                                        {
                                                            expense.name
                                                        }
                                                    </Text>

                                                    <Text
                                                        style={
                                                            styles.legendPercentage
                                                        }
                                                    >
                                                        {percentage
                                                            .toFixed(
                                                                1
                                                            )
                                                            .replace(
                                                                ".",
                                                                ","
                                                            )}
                                                        %
                                                    </Text>
                                                </View>

                                                <Text
                                                    style={
                                                        styles.legendValue
                                                    }
                                                >
                                                    {
                                                        expense.currency
                                                    }{" "}
                                                    {formatMoney(
                                                        expense.value
                                                    )}
                                                </Text>
                                            </View>
                                        );
                                    }
                                )}
                            </View>
                        </>
                    ) : (
                        <View
                            style={styles.emptyChart}
                        >
                            <View
                                style={
                                    styles.emptyChartIcon
                                }
                            >
                                <MaterialIcons
                                    name="attach-money"
                                    size={30}
                                    color={axisPalette.muted}
                                />
                            </View>

                            <Text
                                style={
                                    styles.emptyChartTitle
                                }
                            >
                                Nenhuma despesa
                                registrada
                            </Text>

                            <Text
                                style={
                                    styles.emptyChartText
                                }
                            >
                                Adicione uma despesa
                                para começar a
                                acompanhar seus
                                gastos.
                            </Text>
                        </View>
                    )}
                </View>

                <Pressable
                    style={styles.addButton}
                    onPress={() =>
                        router.push({
                            pathname:
                                "/logic/expenses/new",
                            params: {
                                id: trip?.id,
                            },
                        })
                    }
                >
                    <Text
                        style={
                            styles.addButtonText
                        }
                    >
                        + Adicionar Despesa
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const createStyles = (palette: GlassPalette) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#f7f7f7", "container", palette),
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
        backgroundColor: glassColor("backgroundColor", "#ffffff", "backButton", palette),
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    backText: {
        fontSize: 30,
        color: glassColor("color", "#303030", "backText", palette),
        lineHeight: 32,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: glassColor("color", "#303030", "title", palette),
    },

    country: {
        marginTop: 4,
        fontSize: 14,
        color: glassColor("color", "#888888", "country", palette),
    },

    sectionTitle: {
        marginTop: 32,
        marginBottom: 14,
        fontSize: 18,
        fontWeight: "700",
        color: glassColor("color", "#303030", "sectionTitle", palette),
    },

    metricsContainer: {
        flexDirection: "row",
        gap: 12,
    },

    metricCard: {
        ...glassDecoration("metricCard", palette),
        flex: 1,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "metricCard", palette),
        borderRadius: 18,
        padding: 18,
    },

    metricLabel: {
        fontSize: 12,
        color: glassColor("color", "#888888", "metricLabel", palette),
        marginBottom: 8,
    },

    metricValue: {
        fontSize: 17,
        fontWeight: "700",
        color: glassColor("color", "#303030", "metricValue", palette),
    },

    chartCard: {
        ...glassDecoration("chartCard", palette),
        marginTop: 18,
        backgroundColor: glassColor("backgroundColor", "#ffffff", "chartCard", palette),
        borderRadius: 20,
        padding: 20,
    },

    chartTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: glassColor("color", "#303030", "chartTitle", palette),
        marginBottom: 10,
    },

    pieContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
        marginBottom: 14,
    },

    legend: {
        marginTop: 4,
    },

    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: glassColor("borderTopColor", "#eeeeee", "legendItem", palette),
    },

    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },

    legendInfo: {
        flex: 1,
    },

    legendName: {
        fontSize: 14,
        fontWeight: "600",
        color: glassColor("color", "#303030", "legendName", palette),
    },

    legendPercentage: {
        marginTop: 3,
        fontSize: 11,
        color: glassColor("color", "#999999", "legendPercentage", palette),
    },

    legendValue: {
        fontSize: 14,
        fontWeight: "700",
        color: glassColor("color", "#303030", "legendValue", palette),
    },

    emptyChart: {
        minHeight: 180,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    emptyChartIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: glassColor("backgroundColor", "#f0f0f0", "emptyChartIcon", palette),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },

    emptyChartTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: glassColor("color", "#555555", "emptyChartTitle", palette),
        textAlign: "center",
    },

    emptyChartText: {
        marginTop: 6,
        fontSize: 12,
        lineHeight: 18,
        color: glassColor("color", "#999999", "emptyChartText", palette),
        textAlign: "center",
        maxWidth: 240,
    },

    addButton: {
        marginTop: 24,
        backgroundColor: glassColor("backgroundColor", "#000000", "addButton", palette),
        borderRadius: 40,
        paddingVertical: 18,
        alignItems: "center",
    },

    addButtonText: {
        color: glassColor("color", "#ffffff", "addButtonText", palette),
        fontSize: 16,
        fontWeight: "600",
    },
});