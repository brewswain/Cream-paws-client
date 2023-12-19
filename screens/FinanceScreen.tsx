import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getAllCustomers, getAllOrders } from "../api";
import { ItemizedBreakdownCard } from "../components";
import { testCustomerDetails, testCustomersFinances } from "../data/test_data";
import { getTodaysOrders } from "../utils";

const FinanceScreen = () => {
  const [showSupplierOwed, setShowSupplierOwed] = useState(false);
  const { container, header } = styles;

  return (
    <ScrollView style={container}>
      <Text style={header}>
        {showSupplierOwed ? "Total Owed Supplier" : "Total Owed Cream Paws"}
      </Text>

      <ItemizedBreakdownCard
        mode={showSupplierOwed ? "suppliers" : "customers"}
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
  header: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    margin: 2,
  },
});
export default FinanceScreen;
