import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	DarkTheme,
	DefaultTheme,
	NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import AuthScreen from "../screens/AuthScreen";
import CustomerDetailsScreen from "../screens/CustomerDetailsScreen";
import CustomersScreen from "../screens/CustomersScreen";
import FinanceScreen from "../screens/FinanceScreen";
import HomeScreen from "../screens/HomeScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import OrdersScreen from "../screens/OrdersScreen";
import StockScreen from "../screens/StockScreen";

import ChowDetailsScreen from "../screens/ChowDetailsScreen";
import ChowFlavourScreen from "../screens/ChowFlavourScreen";
import EditChowScreen from "../screens/EditChowScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
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
	const packageJson = require("../package.json");
	const appVersion = packageJson.version;

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Root"
				component={BottomTabNavigator}
				options={{ title: `Cream Paws Beta ${appVersion}` }}
			/>

			{/* <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      /> */}
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
			<Stack.Screen
				name="ChowDetails"
				component={ChowDetailsScreen}
				options={{ title: "Chow Details" }}
			/>
			<Stack.Screen
				name="ChowFlavour"
				component={ChowFlavourScreen}
				options={{ title: "Chow Flavour" }}
			/>
			<Stack.Screen
				name="EditChow"
				component={EditChowScreen}
				options={{ title: "Edit Chow" }}
			/>
			<Stack.Screen
				name="OrderDetails"
				component={OrderDetailsScreen}
				options={{ title: "Order Details" }}
			/>

			{/* <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Modal" component={ModalScreen} />
         </Stack.Group> */}
		</Stack.Navigator>
	);
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabNavigator() {
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
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				})}
			/>
			<BottomTab.Screen
				name="Customers"
				component={CustomersScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="user-plus" color={color} />
					),
				}}
			/>
			<BottomTab.Screen
				name="Orders"
				component={OrdersScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="sticky-note" color={color} />
					),
				}}
			/>
			<BottomTab.Screen
				name="Stock"
				component={StockScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="shopping-bag" color={color} />
					),
				}}
			/>
			<BottomTab.Screen
				name="Finance"
				component={FinanceScreen}
				options={{
					tabBarIcon: ({ color }) => <TabBarIcon name="money" color={color} />,
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
