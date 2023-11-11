import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { RootTabScreenProps } from "../types";

interface OrderDetailsProps {
  navigation: RootTabScreenProps<"OrderDetails">;
  route: any;
}

const OrderDetailsScreen = ({ navigation, route }: OrderDetailsProps) => {
  const {} = route.params;

  return (
    <View>
      <Text>Order Details</Text>
    </View>
  );
};

export default OrderDetailsScreen;
