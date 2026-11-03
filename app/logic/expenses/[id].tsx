import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";

import GlassBackdrop from "../../../components/GlassBackdrop";
import GlassFrost from "../../../components/GlassFrost";
import {
  glassDecoration,
  type GlassPalette,
} from "../../../constants/glass";
import { useAxisTheme } from "../../../contexts/ThemeContext";
import { savedTrips } from "../../../stores/tripStore";

type ExpenseValue = {
  name: string;
  color: string;
  value: number;
  currency?: string;
  valueBRL?: number;
  exchangeRate?: number;
};

type ExpenseGroup = {
  key: string;
  name: string;
  color: string;
  value: number;
};

const PIE_COLORS: Record<string, string> = {
  red: "#E57373",
  blue: "#6C8CFF",
  green: "#7BCFA6",
  yellow: "#F2C94C",
};

function getColor(color: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return color;
  }

  return PIE_COLORS[color] || "#999999";
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(
  value: number,
  currency = "BRL"
): string {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${formatMoney(value)}`;
  }
}

function getExpenseValueBRL(
  expense: ExpenseValue
): number {
  if (typeof expense.valueBRL === "number") {
    return expense.valueBRL;
  }

  if (!expense.currency || expense.currency === "BRL") {
    return Number(expense.value) || 0;
  }

  if (typeof expense.exchangeRate === "number") {
    return expense.value * expense.exchangeRate;
  }

  return 0;
}

function getTripDays(trip: unknown): number {
  if (!trip || typeof trip !== "object") {
    return 0;
  }

  const data = trip as {
    duration?: number | string;
    startDate?: string;
    endDate?: string;
  };

  const duration = Number(data.duration);

  if (Number.isFinite(duration) && duration > 0) {
    return Math.ceil(duration);
  }

  if (data.startDate && data.endDate) {
    const start = new Date(
      `${data.startDate}T12:00:00`
    );

    const end = new Date(
      `${data.endDate}T12:00:00`
    );

    const difference =
      end.getTime() - start.getTime();

    if (Number.isFinite(difference) && difference >= 0) {
      return (
        Math.round(difference / 86400000) + 1
      );
    }
  }

  return 0;
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number
) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  };
}

function createPieSlicePath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
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
  const { palette, darkMode } = useAxisTheme();

  const styles = useMemo(
    () => createStyles(palette, darkMode),
    [palette, darkMode]
  );

  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const trip = savedTrips.find(
    (item) => item.id === id
  );

  const expenses = (trip?.expenses ?? []) as ExpenseValue[];

  const initialBudget = Number(trip?.budget) || 0;

  const hasBudget =
    trip?.budget !== undefined &&
    trip?.budget !== null &&
    trip?.budget !== "";

  const localCurrency = (
    trip?.localCurrency || "BRL"
  ).toUpperCase();

  const days = getTripDays(trip);

  const [budgetExchangeRate, setBudgetExchangeRate] =
    useState<number | null>(
      localCurrency === "BRL" ? 1 : null
    );

  const [rateLoading, setRateLoading] = useState(
    localCurrency !== "BRL"
  );

  const [rateError, setRateError] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchRate() {
      if (localCurrency === "BRL") {
        setBudgetExchangeRate(1);
        setRateLoading(false);
        setRateError(false);
        return;
      }

      setRateLoading(true);
      setRateError(false);
      setBudgetExchangeRate(null);

      try {
        const response = await fetch(
          `https://api.frankfurter.dev/v2/rate/BRL/${encodeURIComponent(
            localCurrency
          )}`
        );

        if (!response.ok) {
          throw new Error("Falha ao consultar cotação.");
        }

        const data = await response.json();

        if (
          typeof data.rate !== "number" ||
          !Number.isFinite(data.rate)
        ) {
          throw new Error("Cotação inválida.");
        }

        if (active) {
          setBudgetExchangeRate(data.rate);
          setRateError(false);
        }
      } catch (error) {
        console.error(
          "Erro ao consultar cotação:",
          error
        );

        if (active) {
          setBudgetExchangeRate(null);
          setRateError(true);
        }
      } finally {
        if (active) {
          setRateLoading(false);
        }
      }
    }

    fetchRate();

    return () => {
      active = false;
    };
  }, [localCurrency]);

  const groupedExpenses = expenses.reduce<
    ExpenseGroup[]
  >((groups, expense) => {
    const name = (expense.name || "Outros").trim();

    const key = `${name.toLowerCase()}-${
      expense.color
    }`;

    const value = getExpenseValueBRL(expense);

    const existing = groups.find(
      (group) => group.key === key
    );

    if (existing) {
      existing.value += value;
    } else {
      groups.push({
        key,
        name,
        color: expense.color,
        value,
      });
    }

    return groups;
  }, []);

  const totalSpent = expenses.reduce(
    (total, expense) =>
      total + getExpenseValueBRL(expense),
    0
  );

  const remainingBudget =
    initialBudget - totalSpent;

  const dailyAverage =
    hasBudget && days > 0
      ? remainingBudget / days
      : null;

  const localInitialBudget =
    budgetExchangeRate !== null
      ? initialBudget * budgetExchangeRate
      : null;

  const localRemainingBudget =
    budgetExchangeRate !== null
      ? remainingBudget * budgetExchangeRate
      : null;

  const localDailyAverage =
    dailyAverage !== null &&
    budgetExchangeRate !== null
      ? dailyAverage * budgetExchangeRate
      : null;

  const totalForPie = groupedExpenses.reduce(
    (total, expense) =>
      total + Math.max(0, expense.value),
    0
  );

  const pieSize = 230;
  const center = pieSize / 2;
  const radius = 105;

  let currentAngle = 0;

  function localDescription(
    amount: number | null
  ): string {
    if (localCurrency === "BRL") {
      return "Moeda da viagem: BRL";
    }

    if (rateLoading) {
      return "Consultando cotação...";
    }

    if (amount !== null) {
      return formatCurrency(
        amount,
        localCurrency
      );
    }

    return rateError
      ? "Cotação indisponível"
      : "Conversão indisponível";
  }

  return (
    <View style={styles.container}>
      <GlassBackdrop />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <MaterialIcons
              name="arrow-back"
              size={23}
              color={palette.text}
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              {trip?.destination || "Viagem"}
            </Text>

            <Text style={styles.country}>
              {trip?.country || ""}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Orçamento e gastos por dia
        </Text>

        {/* CARD SUPERIOR: ORÇAMENTO INICIAL */}
        <View style={styles.budgetCard}>
          <GlassFrost />

          <View style={styles.budgetHeading}>
            <View style={styles.budgetIcon}>
              <MaterialIcons
                name="account-balance-wallet"
                size={22}
                color={palette.text}
              />
            </View>

            <Text style={styles.budgetLabel}>
              Orçamento inicial
            </Text>
          </View>

          <Text style={styles.budgetValue}>
            {hasBudget
              ? formatCurrency(
                  initialBudget,
                  "BRL"
                )
              : "Não informado"}
          </Text>

          {hasBudget && (
            <Text style={styles.budgetSecondary}>
              {localDescription(
                localInitialBudget
              )}
            </Text>
          )}
        </View>

        {/* TRÊS INDICADORES INFERIORES */}
        <View style={styles.metricsContainer}>
          {/* SALDO RESTANTE */}
          <View style={styles.metricCard}>
            <GlassFrost />

            <Text style={styles.metricLabel}>
              Saldo restante
            </Text>

            <Text
              style={[
                styles.metricValue,
                remainingBudget < 0 &&
                  styles.negativeValue,
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {hasBudget
                ? formatCurrency(
                    remainingBudget,
                    "BRL"
                  )
                : "—"}
            </Text>

            <Text
              style={styles.metricSecondary}
              numberOfLines={2}
            >
              {hasBudget
                ? localDescription(
                    localRemainingBudget
                  )
                : "Sem orçamento"}
            </Text>
          </View>

          {/* MÉDIA DIÁRIA */}
          <View style={styles.metricCard}>
            <GlassFrost />

            <Text style={styles.metricLabel}>
              Média diária
            </Text>

            <Text
              style={[
                styles.metricValue,
                dailyAverage !== null &&
                  dailyAverage < 0 &&
                  styles.negativeValue,
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {dailyAverage !== null
                ? formatCurrency(
                    dailyAverage,
                    "BRL"
                  )
                : "—"}
            </Text>

            <Text
              style={styles.metricSecondary}
              numberOfLines={2}
            >
              {dailyAverage !== null
                ? localCurrency !== "BRL"
                  ? localDescription(
                      localDailyAverage
                    )
                  : `Disponível por dia`
                : days <= 0
                  ? "Duração não informada"
                  : "Sem orçamento"}
            </Text>
          </View>

          {/* TOTAL GASTO */}
          <View style={styles.metricCard}>
            <GlassFrost />

            <Text style={styles.metricLabel}>
              Total gasto
            </Text>

            <Text
              style={styles.metricValue}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {formatCurrency(
                totalSpent,
                "BRL"
              )}
            </Text>

            <Text style={styles.metricSecondary}>
              {expenses.length}{" "}
              {expenses.length === 1
                ? "despesa"
                : "despesas"}
            </Text>
          </View>
        </View>

        {/* GRÁFICO ORIGINAL */}
        <View style={styles.chartCard}>
          <GlassFrost />

          <Text style={styles.chartTitle}>
            Gastos por categoria
          </Text>

          {groupedExpenses.length > 0 ? (
            <>
              <View style={styles.pieContainer}>
                <Svg
                  width={pieSize}
                  height={pieSize}
                  viewBox={`0 0 ${pieSize} ${pieSize}`}
                >
                  {groupedExpenses.map(
                    (expense) => {
                      const percentage =
                        totalForPie > 0
                          ? Math.max(
                              0,
                              expense.value
                            ) / totalForPie
                          : 0;

                      const angle =
                        percentage * 360;

                      const startAngle =
                        currentAngle;

                      const endAngle =
                        currentAngle + angle;

                      currentAngle = endAngle;

                      if (
                        percentage <= 0
                      ) {
                        return null;
                      }

                      if (
                        groupedExpenses.length === 1 ||
                        angle >= 359.99
                      ) {
                        return (
                          <Path
                            key={expense.key}
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
                          key={expense.key}
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

              <View style={styles.legend}>
                {groupedExpenses.map(
                  (expense) => {
                    const percentage =
                      totalForPie > 0
                        ? (Math.max(
                            0,
                            expense.value
                          ) /
                            totalForPie) *
                          100
                        : 0;

                    return (
                      <View
                        key={expense.key}
                        style={styles.legendItem}
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
                          style={styles.legendInfo}
                        >
                          <Text
                            style={styles.legendName}
                          >
                            {expense.name}
                          </Text>

                          <Text
                            style={
                              styles.legendPercentage
                            }
                          >
                            {percentage
                              .toFixed(1)
                              .replace(".", ",")}
                            %
                          </Text>
                        </View>

                        <Text
                          style={styles.legendValue}
                        >
                          {formatCurrency(
                            expense.value,
                            "BRL"
                          )}
                        </Text>
                      </View>
                    );
                  }
                )}
              </View>
            </>
          ) : (
            <View style={styles.emptyChart}>
              <View
                style={styles.emptyChartIcon}
              >
                <MaterialIcons
                  name="attach-money"
                  size={30}
                  color={palette.muted}
                />
              </View>

              <Text
                style={styles.emptyChartTitle}
              >
                Nenhuma despesa registrada
              </Text>

              <Text
                style={styles.emptyChartText}
              >
                Adicione uma despesa para
                começar a acompanhar seus
                gastos.
              </Text>
            </View>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => {
            if (!trip) return;

            router.push({
              pathname: "/logic/expenses/new",
              params: {
                id: trip.id,
              },
            });
          }}
          accessibilityRole="button"
        >
          <MaterialIcons
            name="add"
            size={22}
            color={palette.accentText}
          />

          <Text style={styles.addButtonText}>
            Adicionar despesa
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function createStyles(
  palette: GlassPalette,
  darkMode: boolean
) {
  const cardBackground = darkMode
    ? "rgba(42,42,42,0.80)"
    : "rgba(255,255,255,0.82)";

  const iconBackground = darkMode
    ? "rgba(255,255,255,0.12)"
    : "rgba(0,0,0,0.06)";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 45,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
    },

    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: iconBackground,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },

    headerText: {
      flex: 1,
    },

    title: {
      fontSize: 24,
      fontWeight: "700",
      color: palette.text,
    },

    country: {
      marginTop: 4,
      fontSize: 14,
      color: palette.muted,
    },

    sectionTitle: {
      marginTop: 32,
      marginBottom: 14,
      fontSize: 18,
      fontWeight: "700",
      color: palette.text,
    },

    budgetCard: {
      ...glassDecoration(
        "budgetCard",
        palette
      ),
      width: "100%",
      borderRadius: 20,
      padding: 20,
      backgroundColor: cardBackground,
      overflow: "hidden",
    },

    budgetHeading: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 15,
    },

    budgetIcon: {
      width: 38,
      height: 38,
      borderRadius: 13,
      backgroundColor: iconBackground,
      alignItems: "center",
      justifyContent: "center",
    },

    budgetLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: palette.muted,
    },

    budgetValue: {
      fontSize: 29,
      fontWeight: "800",
      color: palette.text,
    },

    budgetSecondary: {
      marginTop: 8,
      fontSize: 13,
      color: palette.muted,
    },

    metricsContainer: {
      flexDirection: "row",
      gap: 8,
      marginTop: 12,
    },

    metricCard: {
      ...glassDecoration(
        "metricCard",
        palette
      ),
      flex: 1,
      minWidth: 0,
      borderRadius: 17,
      paddingHorizontal: 12,
      paddingVertical: 18,
      minHeight: 135,
      backgroundColor: cardBackground,
      overflow: "hidden",
    },

    metricLabel: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "600",
      color: palette.muted,
      marginTop: 0,
      marginBottom: 14,
      minHeight: 36,
    },

    metricValue: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: "800",
      color: palette.text,
      flexShrink: 1,
    },

    metricSecondary: {
      fontSize: 12,
      lineHeight: 17,
      color: palette.muted,
      marginTop: 7,
    },

    negativeValue: {
      color: darkMode
        ? "#FF9090"
        : "#C62828",
    },

    chartCard: {
      ...glassDecoration(
        "chartCard",
        palette
      ),
      marginTop: 20,
      backgroundColor: cardBackground,
      borderRadius: 20,
      padding: 20,
      overflow: "hidden",
    },

    chartTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: palette.text,
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
      borderTopColor: palette.divider,
      gap: 8,
    },

    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },

    legendInfo: {
      flex: 1,
      minWidth: 0,
    },

    legendName: {
      fontSize: 14,
      fontWeight: "600",
      color: palette.text,
    },

    legendPercentage: {
      marginTop: 3,
      fontSize: 11,
      color: palette.muted,
    },

    legendValue: {
      fontSize: 12,
      fontWeight: "700",
      color: palette.text,
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
      backgroundColor: iconBackground,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },

    emptyChartTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: palette.text,
      textAlign: "center",
    },

    emptyChartText: {
      marginTop: 6,
      fontSize: 12,
      lineHeight: 18,
      color: palette.muted,
      textAlign: "center",
      maxWidth: 240,
    },

    addButton: {
      marginTop: 24,
      backgroundColor: palette.accent,
      borderRadius: 40,
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },

    addButtonText: {
      color: palette.accentText,
      fontSize: 16,
      fontWeight: "600",
    },
  });
}