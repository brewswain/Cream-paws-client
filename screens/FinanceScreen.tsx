import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import SwitchSelector from "react-native-switch-selector";

import { getAllCustomers, getAllOrders } from "../api";
import { ItemizedBreakdownCard } from "../components";
import { getTodaysOrders } from "../utils";

const FinanceScreen = () => {
  const [showSupplierOwed, setShowSupplierOwed] = useState(false);
  const { container, header } = styles;

  const options = [
    { label: "Open Customer Orders", value: false },
    { label: "Unpaid Warehouse Orders", value: true },
  ];

  const handleClick = (value: boolean) => {
    setShowSupplierOwed(value);
  };

  return (
    <ScrollView style={container}>
      <View style={{ alignItems: "center", paddingVertical: 10 }}>
        <View style={styles.selectorContainer}>
          <SwitchSelector
            options={options}
            initial={0}
            textColor="#7a44cf" //'#7a44cf'
            selectedColor="white"
            buttonColor="#7a44cf"
            borderColor="#7a44cf"
            onPress={(value: boolean) => handleClick(value)}
          />
        </View>
      </View>

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
  selectorContainer: {
    width: "70%",
  },
  header: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    margin: 2,
  },
});
export default FinanceScreen;
