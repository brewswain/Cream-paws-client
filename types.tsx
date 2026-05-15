/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Customer } from "./models/customer";
import { OrderFromSupabase } from "./models/order";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: undefined;
  Customers: undefined;
  Orders: undefined;
  Finance: undefined;
  Auth: undefined;
  CustomerDetails: { customer: Customer };
  OrderDetails: { order: OrderFromSupabase };
  EditCustomer: { customer: Customer };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

/** Bottom tab routes only (stack modals live on `RootStackParamList`). */
export type RootTabParamList = {
  Home: undefined;
  Customers: undefined;
  Orders: undefined;
  Finance: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
