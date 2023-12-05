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
import { Divider } from "native-base";

import Dinero from "dinero.js";

import { ChowVariety } from "../../../models/chow";
import { useState } from "react";
import DetailsText from "../../DetailsText";
import { useNavigation } from "@react-navigation/native";

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

  const navigation = useNavigation();

  const { dropdownContainer, dropdownIcon, dropdownText } = styles;

  return (
    <View style={{ marginVertical: 4, minHeight: 50 }}>
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
          {varieties.map((variety, index) => {
            const isActiveButton = index === varietyIndex;
            return (
              <View key={`${variety.chow_id}${variety.size}${variety.unit}`}>
                {/* make button press set active variety, using index */}
                <Pressable
                  style={[
                    styles.button,
                    isActiveButton
                      ? styles.activeButton
                      : styles.inactiveButton,
                  ]}
                  onPress={() => setVarietyIndex(index)}
                >
                  <Text
                    style={{ color: isActiveButton ? "white" : "black" }}
                  >{`${variety.size} ${variety.unit}`}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        <View style={{ paddingBottom: 12 }}>
          <DetailsText
            header="Wholesale Price"
            details={Dinero({
              amount: Math.round(varieties[varietyIndex].wholesale_price * 100),
            }).toFormat("$0,0.00")}
            color="black"
          />
          <DetailsText
            header="Retail Price"
            details={Dinero({
              amount: Math.round(varieties[varietyIndex].retail_price * 100),
            }).toFormat("$0,0.00")}
            color="black"
          />
        </View>
      </Collapsible>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  dropdownText: {
    fontSize: 18,
    width: "90%",
  },
  dropdownIcon: {
    paddingLeft: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    width: 60,
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#4939FF",
  },
  inactiveButton: {
    backgroundColor: "white",
  },
});
export default CollapsibleVariety;
