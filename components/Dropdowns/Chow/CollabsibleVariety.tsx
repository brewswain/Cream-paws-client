import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  Pressable,
} from "react-native";

import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/FontAwesome";

import Dinero from "dinero.js";

import { ChowVariety } from "../../../models/chow";
import { useState } from "react";
import DetailsText from "../../DetailsText";

interface CollapsibleVarietyProps {
  setVarietyCollapsible: React.Dispatch<React.SetStateAction<boolean>>;
  varietyCollapsible: boolean;
  varieties: ChowVariety[];
  children: React.ReactNode;
}

const CollapsibleVariety = ({
  setVarietyCollapsible,
  varietyCollapsible,
  varieties,
  children,
}: CollapsibleVarietyProps) => {
  const [varietyIndex, setVarietyIndex] = useState(0);

  const { dropdownContainer, dropdownIcon, dropdownText } = styles;

  return (
    <View>
      <TouchableOpacity
        style={dropdownContainer}
        onPress={() => {
          setVarietyCollapsible(!varietyCollapsible);
        }}
      >
        <Text style={dropdownText}>{children}</Text>
        <Icon
          name={`${varietyCollapsible ? "caret-right" : "caret-down"}`}
          size={20}
          style={dropdownIcon}
        />
      </TouchableOpacity>

      <Collapsible collapsed={varietyCollapsible}>
        <View
          style={[
            styles.buttonContainer,
            {
              justifyContent: varieties.length > 1 ? "space-between" : "center",
            },
          ]}
        >
          {varieties.map((variety, index) => (
            <View>
              {/* make button press set active variety, using index */}
              <Pressable
                style={
                  index === varietyIndex
                    ? styles.activeButton
                    : styles.inactiveButton
                }
                onPress={() => setVarietyIndex(index)}
              >
                <Text>{variety.size + variety.unit}</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <DetailsText
          header="Wholesale Price"
          details={varieties[varietyIndex].wholesale_price}
          color="black"
        />
        <DetailsText
          header="Retail Price"
          details={varieties[varietyIndex].retail_price}
          color="black"
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
    backgroundColor: "white",
    padding: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownIcon: {
    paddingLeft: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activeButton: {
    backgroundColor: "red",
  },
  inactiveButton: {},
});
export default CollapsibleVariety;
