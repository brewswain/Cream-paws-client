import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
   const { brand, target_group, flavour, size, unit, retail_price } =
      chowDetails;
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
               <DetailsText header={"Target Group"} details={target_group} />
               <DetailsText header={"Flavour"} details={flavour} />
               <DetailsText header={"Size"} details={`${size} ${unit}`} />
               <DetailsText header={"Cost"} details={retail_price} />
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
