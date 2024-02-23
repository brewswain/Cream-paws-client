import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/FontAwesome";

import FilteredOrderDetails from "../FilteredOrderDetails";
import { OrderWithChowDetails } from "../../models/order";
import { SelectedOrder } from "../../screens/CustomerDetailsScreen";

interface CollapsibleOrderProps {
  setOutstandingCollapsible: React.Dispatch<React.SetStateAction<boolean>>;
  outstandingCollapsible: boolean;
  children: React.ReactNode;
  isCompleted?: boolean;
}

const CollapsibleOrder = ({
  outstandingCollapsible,
  setOutstandingCollapsible,
  children,
  isCompleted,
}: CollapsibleOrderProps) => {
  const { dropdownContainer, dropdownIcon, dropdownText } = styles;

  return (
    <View>
      <TouchableOpacity
        style={dropdownContainer}
        onPress={() => {
          setOutstandingCollapsible(!outstandingCollapsible);
        }}
      >
        <Text style={dropdownText}>{children}</Text>
        <Icon
          name={`${outstandingCollapsible ? "caret-right" : "caret-down"}`}
          size={20}
          style={dropdownIcon}
        />
      </TouchableOpacity>

      <Collapsible collapsed={outstandingCollapsible}>
        {/*  We engage in some prop drilling as a treat--I should honestly see about better state management*/}
        <FilteredOrderDetails
          color="black"
          paddingLeft={0}
          isCompleted={isCompleted}
        />
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
    marginTop: 10,
  },
  dropdownText: {
    // TODO: font family+ aliasing please for the love of god
    fontSize: 16,
  },
  dropdownIcon: {
    paddingLeft: 20,
  },
});
export default CollapsibleOrder;
