import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ItemizedBreakdownCard } from "../components";

const FinanceScreen = () => {
  const [mode, setMode] = useState<"courier" | "warehouse">("courier");
  const { container, header } = styles;

  return (
    <ScrollView style={container}>
      <View style={{ alignItems: "center", paddingVertical: 12 }}>
        <View style={styles.selectorContainer}>
          <Pressable
            testID="finance-mode-courier"
            accessibilityRole="button"
            onPress={() => setMode("courier")}
            style={[
              styles.modePill,
              mode === "courier" && styles.modePillActive,
            ]}
          >
            <Text
              style={[styles.modePillText, mode === "courier" && styles.modePillTextActive]}
            >
              Courier fees
            </Text>
          </Pressable>
          <Pressable
            testID="finance-mode-warehouse"
            accessibilityRole="button"
            onPress={() => setMode("warehouse")}
            style={[
              styles.modePill,
              mode === "warehouse" && styles.modePillActive,
            ]}
          >
            <Text
              style={[
                styles.modePillText,
                mode === "warehouse" && styles.modePillTextActive,
              ]}
            >
              Warehouse
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={header}>
        {mode === "warehouse" ? "Total owed Supplier" : "Total owed courier"}
      </Text>

      <ItemizedBreakdownCard mode={mode} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#434949",
    height: "100%",
  },
  selectorContainer: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  modePill: {
    minHeight: 48,
    minWidth: 140,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#2d3333",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  modePillActive: {
    backgroundColor: "rgba(255,94,94, 0.95)",
    borderColor: "rgba(255,94,94, 1)",
  },
  modePillText: {
    color: "#e2e8f0",
    fontSize: 16,
    fontWeight: "700",
  },
  modePillTextActive: {
    color: "#fff",
  },
  header: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    margin: 2,
  },
});
export default FinanceScreen;
