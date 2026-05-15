import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";

import AuthScreen from "../screens/AuthScreen";
import CustomerDetailsScreen from "../screens/CustomerDetailsScreen";
import CustomersScreen from "../screens/CustomersScreen";
import EditCustomerScreen from "../screens/EditCustomerScreen";
import FinanceScreen from "../screens/FinanceScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import OrdersScreen from "../screens/OrdersScreen";
import { RootStackParamList } from "../types";
import { BottomTabNavigator } from "./BottomTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStackNavigator() {
  const packageJson = require("../package.json");
  const appVersion = packageJson.version;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ title: `Cream Paws Beta ${appVersion}` }}
      />

      <Stack.Screen
        name="Customers"
        component={CustomersScreen}
        options={{ title: "Customers" }}
      />

      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ title: "Authentication" }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: "Orders" }}
      />
      <Stack.Screen
        name="Finance"
        component={FinanceScreen}
        options={{ title: "Finance" }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Screen
        name="CustomerDetails"
        component={CustomerDetailsScreen}
        options={{ title: "Customer Details" }}
      />
      <Stack.Screen
        name="EditCustomer"
        component={EditCustomerScreen}
        options={{ title: "Edit Customer" }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: "Order Details" }}
      />
    </Stack.Navigator>
  );
}
