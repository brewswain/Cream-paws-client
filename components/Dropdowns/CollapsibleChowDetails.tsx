import Dinero from "dinero.js";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/FontAwesome";

import DetailsText from "../DetailsText";

interface CollapsibleChowDetailsProps {
  chowDetails: Chow;
  index: number;
}

const CollapsibleChowDetails = ({
  chowDetails,
  index,
}: CollapsibleChowDetailsProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { brand } = chowDetails;
  const { size, unit, retail_price } = chowDetails.flavours.varieties;
  const { dropdownContainer, dropdownIcon, dropdownText } = styles;

  return (
    <View>
      <TouchableOpacity
        style={dropdownContainer}
        onPress={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        <Text key={`${index} Collapsible`} style={dropdownText}>
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
          <DetailsText header={"Brand"} details={brand} />
          <DetailsText
            header={"Flavour"}
            details={chowDetails.flavours.flavour_name}
          />
          <DetailsText header={"Size"} details={`${size} ${unit}`} />
          <DetailsText
            header={"Cost"}
            details={Dinero({
              amount: Math.round(retail_price * 100),
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
    backgroundColor: "white",
    padding: 4,
    borderRadius: 4,
    width: "70%",
  },
  dropdownText: {
    // TODO: font family+ aliasing please for the love of god
    fontSize: 16,
  },
  dropdownIcon: {
    paddingLeft: 20,
  },
});

export default CollapsibleChowDetails;
