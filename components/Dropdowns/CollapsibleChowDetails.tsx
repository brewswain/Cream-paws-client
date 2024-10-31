import Dinero from "dinero.js";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/FontAwesome";

import DetailsText from "../DetailsText";
import { Divider } from "native-base";
import { OrderFromSupabase } from "../../models/order";

interface CollapsibleChowDetailsProps {
  order: OrderFromSupabase;
  index: number;
  color?: string;
  paddingLeft: number;
}

const CollapsibleChowDetails = ({
  order,
  index,
  color,
  paddingLeft,
}: CollapsibleChowDetailsProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { dropdownContainer, dropdownIcon, dropdownText } = styles;

  return (
    <View>
      <TouchableOpacity
        style={dropdownContainer}
        onPress={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        <Text
          key={`${index} Collapsible`}
          style={[dropdownText, { color, paddingLeft }]}
        >
          {isCollapsed ? "View Chow Details: " : "Close Chow Details: "}
        </Text>
        <Icon
          name={`${isCollapsed ? "caret-right" : "caret-down"}`}
          size={20}
          style={dropdownIcon}
        />
      </TouchableOpacity>

      <Collapsible collapsed={isCollapsed}>
        <View>
          <DetailsText
            header={"Brand"}
            details={order.flavours.brand_details.name}
            paddingLeft={paddingLeft}
            color={color}
          />
          <DetailsText
            header={"Flavour"}
            paddingLeft={paddingLeft}
            color={color}
            details={order.flavours.details.flavour_name}
          />
          <DetailsText
            header={"Size"}
            details={`${order.variety.size} ${order.variety.size}`}
            paddingLeft={paddingLeft}
            color={color}
          />

          <DetailsText
            header={"Cost"}
            paddingLeft={paddingLeft}
            color={color}
            details={Dinero({
              amount: Math.round(order.retail_price * 100),
            }).toFormat("$0,0.00")}
          />
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 4,
    borderRadius: 4,
    width: "70%",
  },
  dropdownText: {
    // TODO: font family+ aliasing please for the love of god
    fontSize: 14,
    color: "white",
  },
  dropdownIcon: {
    paddingLeft: 20,
  },
});

export default CollapsibleChowDetails;
