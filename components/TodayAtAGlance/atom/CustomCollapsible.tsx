import { ReactNode } from "react";
import { TouchableOpacity, Text, ViewStyle, StyleProp } from "react-native";
import Collapsible from "react-native-collapsible";
import {
  CollapsibleTargets,
  TodaysOrderState,
} from "../TodayAtAGlanceCard.model";

type CustomCollapsibleProps = {
  children: ReactNode;
  isCollapsed: boolean;
} & StyleProp<ViewStyle>;

const CustomCollapsible = ({
  children,
  isCollapsed,
}: CustomCollapsibleProps) => {
  return (
    <Collapsible
      style={{ display: "flex", flexDirection: "column" }}
      collapsed={isCollapsed}
    >
      {children}
    </Collapsible>
  );
};

export default CustomCollapsible;
