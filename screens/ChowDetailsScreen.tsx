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
  const [chowPayload, setChowPayload] = useState(route.params);

  const chowFields: SubFields[] = [
    { title: "Brand", content: chowPayload.brand },
    { title: "Flavour", content: chowPayload.flavour },
    { title: "Size", content: chowPayload.size },
    { title: "Unit", content: chowPayload.unit },
    { title: "Wholesale Price", content: chowPayload.wholesale_price },
    { title: "Retail Price", content: chowPayload.retail_price },
  ];

  return <View>{renderDetailInputs(chowFields)}</View>;
};

export default ChowDetailsScreen;
