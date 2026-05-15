/**
 * Deep linking — tab routes live under `Root`; stack-only routes are siblings.
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: "home",
          Customers: "customers",
          Orders: "orders",
          Finance: "finance",
        },
      },
      Auth: "auth",
      NotFound: "*",
    },
  },
};

export default linking;
