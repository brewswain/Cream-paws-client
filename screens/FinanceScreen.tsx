import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";

import { getAllCustomers, getAllOrders } from "../api";
import { ItemizedBreakdownCard } from "../components";
import { getTodaysOrders } from "../utils";
import { Button } from "native-base";

const FinanceScreen = () => {
  const [showSupplierOwed, setShowSupplierOwed] = useState(false);
  const [mode, setMode] = useState<"customers" | "courier" | "warehouse">(
    "customers"
  );
  const { container, header } = styles;

  const options = [
    { label: "Open Customer Orders", value: false },
    { label: "Unpaid Warehouse Orders", value: true },
  ];

  return (
    <ScrollView style={container}>
      <View style={{ alignItems: "center", paddingVertical: 10 }}>
        <View style={styles.selectorContainer}>
          <Button onPress={() => setMode("customers")}>Customer</Button>
          <Button onPress={() => setMode("courier")}>Courier Fees</Button>
          <Button onPress={() => setMode("warehouse")}>Warehouse</Button>
        </View>
      </View>

      <Text style={header}>
        {mode === "warehouse"
          ? "Total owed Supplier"
          : mode === "customers"
          ? "Total owed Cream Paws"
          : "Total owed courier"}
      </Text>

      <ItemizedBreakdownCard mode={mode} />

      {/* New Card Block */}
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
