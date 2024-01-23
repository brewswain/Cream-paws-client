import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";

import { getAllCustomers, getAllOrders } from "../api";
import { ItemizedBreakdownCard } from "../components";
import { getTodaysOrders } from "../utils";
import { Button } from "native-base";

const FinanceScreen = () => {
  const [showSupplierOwed, setShowSupplierOwed] = useState(false);
  const [mode, setMode] = useState<"customers" | "courier" | "suppliers">("customers")

  const { container, header } = styles;

  const options = [
    { label: "Open Customer Orders", value: false },
    { label: "Unpaid Warehouse Orders", value: true },
  ];

  return (
    <ScrollView style={container}>
      <View style={{ alignItems: "center", paddingVertical: 10 }}>
        <View style={styles.selectorContainer}>
          <Button onPress={() => setMode("customers")}>Customers</Button>
          <Button onPress={() => setMode("courier")}>Courier</Button>
          <Button onPress={() => setMode("suppliers")}>Warehouse Orders</Button>
        </View>
      </View>

      <Text style={header}>
        {mode === "suppliers" ? "Total Owed Supplier" : mode === "customers" ? "Total Owed Cream Paws" : "Total owed Courier"}
      </Text>

      <ItemizedBreakdownCard
        mode={mode}
      />

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
    gap: 10
  },
  header: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    margin: 2,
  },
});
export default FinanceScreen;
