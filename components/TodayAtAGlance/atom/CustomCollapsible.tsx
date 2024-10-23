import { ReactNode } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Collapsible from "react-native-collapsible";

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
