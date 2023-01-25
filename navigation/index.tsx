import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
   NavigationContainer,
   DefaultTheme,
   DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import AuthScreen from "../screens/AuthScreen";
import CustomerDetailsScreen from "../screens/CustomerDetailsScreen";
import CustomersScreen from "../screens/CustomersScreen";
import ClientListScreen from "../screens/CustomersScreen";
import FinanceScreen from "../screens/FinanceScreen";
import HomeScreen from "../screens/HomeScreen";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import OrdersScreen from "../screens/OrdersScreen";
import StockScreen from "../screens/StockScreen";
import TabTwoScreen from "../screens/TabTwoScreen";

import {
   RootStackParamList,
   RootTabParamList,
   RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
   colorScheme,
}: {
   colorScheme: ColorSchemeName;
}) {
   return (
      <NavigationContainer
         linking={LinkingConfiguration}
         theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
         <RootNavigator />
      </NavigationContainer>
   );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
   return (
      <Stack.Navigator>
         <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Home" }}
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
            name="Stock"
            component={StockScreen}
            options={{ title: "Stock" }}
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

         <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
         </Stack.Group>
      </Stack.Navigator>
   );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
   const colorScheme = useColorScheme();

   return (
      <BottomTab.Navigator
         initialRouteName="TabOne"
         screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme].tint,
         }}
      >
         <BottomTab.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }: RootTabScreenProps<"Home">) => ({
               title: "Home",
               tabBarIcon: ({ color }) => (
                  <TabBarIcon name="code" color={color} />
               ),
               headerRight: () => (
                  <Pressable
                     onPress={() => navigation.navigate("Modal")}
                     style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                     })}
                  >
                     <FontAwesome
                        name="info-circle"
                        size={25}
                        color={Colors[colorScheme].text}
                        style={{ marginRight: 15 }}
                     />
                  </Pressable>
               ),
            })}
         />
         <BottomTab.Screen
            name="TabTwo"
            component={TabTwoScreen}
            options={{
               title: "Tab Two",
               tabBarIcon: ({ color }) => (
                  <TabBarIcon name="code" color={color} />
               ),
            }}
         />
      </BottomTab.Navigator>
   );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
   name: React.ComponentProps<typeof FontAwesome>["name"];
   color: string;
}) {
   return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
