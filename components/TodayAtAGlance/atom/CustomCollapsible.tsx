import { ReactNode } from "react";
import { TouchableOpacity, Text } from "react-native";
import Collapsible from "react-native-collapsible";
import {
  CollapsibleTargets,
  TodaysOrderState,
} from "../TodayAtAGlanceCard.model";

interface CustomCollapsibleProps {
  children: ReactNode;
  isCollapsed: boolean;
}

const CustomCollapsible = ({
  children,
  isCollapsed,
}: CustomCollapsibleProps) => {
  return <Collapsible collapsed={isCollapsed}>{children}</Collapsible>;
};

export default CustomCollapsible;
