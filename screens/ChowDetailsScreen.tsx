import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { RootTabScreenProps } from "../types";

interface ChowDetailsProps {
  navigation: RootTabScreenProps<"ChowDetails">;
  route: any;
}

const ChowDetailsScreen = ({ navigation, route }: ChowDetailsProps) => {
  const {} = route.params;

  return (
    <View>
      <Text>Chow Details</Text>
    </View>
  );
};

export default ChowDetailsScreen;
