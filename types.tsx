/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Chow, ChowFlavour } from "./models/chow";
import { Customer } from "./models/customer";

declare global {
  namespace ReactNavigation {
    type RootParamList = RootStackParamList;
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Home: undefined;
  Modal: undefined;
  NotFound: undefined;
  Customers: undefined;
  Orders: undefined;
  Stock: undefined;
  Finance: undefined;
  Auth: undefined;
  CustomerDetails: Customer;
  OrderDetails: OrderDetails;
  ChowDetails: {
    chow: Chow;
    populateChowList: () => void;
  };
  ChowFlavour: {
    flavours: ChowFlavour[];
    brand: string;
    brand_id: string;
    populateChowList?: () => void;
  };
  EditChow: {
    brand_id: string;
    flavour_id?: string;
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Home: undefined;
  TabOne: undefined;
  TabTwo: undefined;
  Customers: undefined;
  Orders: undefined;
  Stock: undefined;
  Finance: undefined;
  Auth: undefined;
  CustomerDetails: Customer;
  OrderDetails: OrderDetails;
  ChowDetails: Chow;
  ChowFlavour: {
    flavours: ChowFlavour[];
    brand: string;
    brand_id: string;
    populateChowList?: () => void;
  };
  EditChow: {
    brand_id: string;
    flavour_id?: string;
  };
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
