import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { RootTabScreenProps } from "../types";

interface OrderDetailsProps {
  navigation: RootTabScreenProps<"OrderDetails">;
  route: any;
}

const OrderDetailsScreen = ({ navigation, route }: OrderDetailsProps) => {
  const { chow_id, delivery_date, driver_paid, chow_details, is_delivery, payment_date, payment_made, quantity, warehouse_paid } = route.params;
  console.log(route.params)
  return (
    <View>
      <Text>Order Details</Text>
      <View style={{ width: "90%", }}>
        {/*  Delivery Date */}
        {/* Checkmarks like Driver Paid, etc */}
        {/* Chow Details */}
        <TextInput placeholder="" />
      </View>
    </View>
  );
};

export default OrderDetailsScreen;
