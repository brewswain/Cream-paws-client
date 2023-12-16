import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getAllCustomers, getAllOrders } from "../api";
import { ItemizedBreakdownCard } from "../components";
import { testCustomerDetails, testCustomersFinances } from "../data/test_data";
import { getTodaysOrders } from "../utils";

const FinanceScreen = () => {
  const { container, header } = styles;

  return (
    <ScrollView style={container}>
      <Text style={header}>Total Owed Suppliers</Text>

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
    fontSize: 20,
    textAlign: "center",
    margin: 2,
  },
});
export default FinanceScreen;
