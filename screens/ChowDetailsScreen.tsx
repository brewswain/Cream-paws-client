import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { RootTabScreenProps } from "../types";
import {
  SubFields,
  renderDetailInputs,
} from "../components/details/DetailScreenComponents";

interface ChowDetailsProps {
  navigation: RootTabScreenProps<"ChowDetails">;
  route: {
    params: Chow;
  };
}

const ChowDetailsScreen = ({ navigation, route }: ChowDetailsProps) => {
  const { brand, flavour, size, unit, wholesale_price, retail_price } =
    route.params;

  const chowFields: SubFields[] = [
    { title: "Brand", content: brand },
    { title: "Flavour", content: flavour },
    { title: "Size", content: size },
    { title: "Unit", content: unit },
    { title: "Wholesale Price", content: wholesale_price },
    { title: "Retail Price", content: retail_price },
  ];

  return <View>{renderDetailInputs(chowFields)}</View>;
};

export default ChowDetailsScreen;
