import { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { getAllCustomers, getAllOrders } from "../api";
import { ItemizedBreakdownCard } from "../components";
import { testCustomerDetails, testCustomersFinances } from "../data/test_data";
import { getTodaysOrders } from "../utils";

const FinanceScreen = () => {
  const { container, header } = styles;

  return (
    <ScrollView style={container}>
      <Text style={header}>Finances</Text>

      <ItemizedBreakdownCard />

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
    fontSize: 40,
    textAlign: "center",
    margin: 2,
  },
});
export default FinanceScreen;
