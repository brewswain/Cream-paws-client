import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ItemizedBreakdownCard } from "../components";
import { Button } from "native-base";

const FinanceScreen = () => {
  const [mode, setMode] = useState<"courier" | "warehouse">("courier");
  const { container, header } = styles;

  return (
    <ScrollView style={container}>
      <View style={{ alignItems: "center", paddingVertical: 10 }}>
        <View style={styles.selectorContainer}>
          <Button onPress={() => setMode("courier")}>Courier Fees</Button>
          <Button onPress={() => setMode("warehouse")}>Warehouse</Button>
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
  },
  header: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    margin: 2,
  },
});
export default FinanceScreen;
