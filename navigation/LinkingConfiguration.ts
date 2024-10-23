/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "home",
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: "two",
            },
          },
          Customers: {
            screens: {
              CustomersScreen: "customers",
            },
          },
          Orders: {
            screens: {
              OrdersScreen: "orders",
            },
          },
          Stock: {
            screens: {
              StockScreen: "stock",
            },
          },
          Finance: {
            screens: {
              FinanceScreen: "finance",
            },
          },
          Auth: {
            screens: {
              AuthScreen: "auth",
            },
          },
        },
      },
      Modal: "modal",
      NotFound: "*",
    },
  },
};

export default linking;
