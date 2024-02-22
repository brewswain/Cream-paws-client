import { ReactNode } from "react";
import { TouchableOpacity, Text } from "react-native";
import Collapsible from "react-native-collapsible";
import {
  CollapsibleTargets,
  TodaysOrderState,
} from "../TodayAtAGlanceCard.model";

interface CustomCollapsibleProps {
  children: ReactNode;
  target: CollapsibleTargets;
  todaysOrders: TodaysOrderState;
}

const CustomCollapsible = ({
  children,
  target,
  todaysOrders,
}: CustomCollapsibleProps) => {
  const targetIndex = todaysOrders.collapsed.findIndex(
    (item) => item.title === target
  );

  const currentTarget = todaysOrders.collapsed[targetIndex];

  return (
    <Collapsible collapsed={currentTarget.isCollapsed}>{children}</Collapsible>
  );
};

export default CustomCollapsible;
