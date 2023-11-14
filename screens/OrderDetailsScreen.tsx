import { ReactNode, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import { RootTabScreenProps } from "../types";
import {
  CustomInput,
  Header,
  SubFields,
  renderDetailInputs,
} from "../components/details/DetailScreenComponents";

interface OrderDetailsProps {
  navigation: RootTabScreenProps<"OrderDetails">;
  route: {
    params: OrderDetails;
  };
}

const OrderDetailsScreen = ({ navigation, route }: OrderDetailsProps) => {
  const {
    client_name,
    chow_id,
    delivery_date,
    driver_paid,
    chow_details,
    is_delivery,
    payment_date,
    payment_made,
    quantity,
    warehouse_paid,
  } = route.params;
  console.log(route.params);
  // TODO: sanitize our inputs

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toDateString();

    return formattedDate;
  };

  const formattedDeliveryDate = formatDate(delivery_date);

  const chowFields: SubFields[] = [
    { title: "Brand", content: chow_details.brand },
    { title: "Flavour", content: chow_details.flavour },
    { title: "Size", content: chow_details.size },
    { title: "Unit", content: chow_details.unit },
    { title: "Quantity", content: quantity },
  ];

  const costsFields: SubFields[] = [
    { title: "Wholesale Price", content: chow_details.wholesale_price },
    { title: "Retail Price", content: chow_details.retail_price },
    { title: "Delivery Fee", content: "Add delivery fee dropdown here" },
    { title: "Total Cost", content: "Calculate all costs in our API" },
  ];

  return (
    <View>
      <View style={{ width: "90%" }}>
        {/* Checkmarks like Driver Paid, etc */}
        <Text style={{ fontSize: 26, textAlign: "center", fontWeight: "600" }}>
          {client_name}
        </Text>

        <Header>Delivery Date</Header>
        <CustomInput>{formattedDeliveryDate}</CustomInput>

        <Header>Chow Details</Header>
        {renderDetailInputs(chowFields)}

        {/* TODO:  Add driver fees here: remember that we want a dropdown of 4 different delivery fees */}
        <Header>Costs</Header>
        {renderDetailInputs(costsFields)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    paddingLeft: 12,
    marginHorizontal: 8,
    marginTop: 4,
  },
});

export default OrderDetailsScreen;
