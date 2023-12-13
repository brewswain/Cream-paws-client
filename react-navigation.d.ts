import { NavigationProp, ParamListBase } from "@react-navigation/native";

declare global {
  namespace ReactNavigation {
    type RootParamList = ParamListBase;
  }
}

export function useNavigation<T extends NavigationProp>(): T;
