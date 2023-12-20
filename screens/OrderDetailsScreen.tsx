import { ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Button, ScrollView } from "native-base";
import { updateOrder } from "../api";
import {
  CustomInput,
  Header,
  SubFields,
  renderDetailInputs,
} from "../components/details/DetailScreenComponents";
import { RootTabScreenProps } from "../types";
import { OrderWithChowDetails } from "../models/order";

interface CustomerOrderDetails extends OrderWithChowDetails {
  client_name: string;
}
interface OrderDetailsProps {
  navigation: RootTabScreenProps<"OrderDetails">;
  route: {
    params: CustomerOrderDetails;
  };
}

const OrderDetailsScreen = ({ navigation, route }: OrderDetailsProps) => {
  const [orderPayload, setOrderPayload] = useState({
    ...route.params,
    id: route.params._id || "unknown id",
  });
  const navigate = useNavigation();
  // TODO: sanitize our inputs

  const handleChange = (
    name: string,
    value: string | number,
    selectedIndex: number
  ) => {
    if (name.includes("chow_details")) {
      const [nestedKey, propertyName] = name.split(".");

      setOrderPayload((prevState) => ({
        ...prevState,
        orders: prevState.orders.map((order, index) => {
          if (index === selectedIndex) {
            return {
              ...order,
              chow_details: {
                ...order.chow_details,
                [propertyName]: value,
              },
            };
          }
          return order;
        }),
      }));
    } else {
      setOrderPayload((prevState) => ({
        ...prevState,
        orders: prevState.orders.map((order, index) => {
          if (index === selectedIndex) {
            return {
              ...order,
              [name]: value,
            };
          }
          return order;
        }),
      }));
    }
  };

  const handleUpdate = async (index: number) => {
    const selectedOrder = {
      ...orderPayload,
      ...orderPayload.orders[index],
    };
    delete selectedOrder.orders;

    await updateOrder(selectedOrder);
    navigate.navigate("Orders");
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toDateString();

    return formattedDate;
  };

  const formattedDeliveryDate = formatDate(orderPayload.delivery_date);

  const costsFields = (index: number) => [
    {
      title: "Wholesale Price",
      content:
        orderPayload.orders[index].chow_details.flavours.varieties
          .wholesale_price,
      name: "chow_details.wholesale_price",
    },
    {
      title: "Retail Price",
      content:
        orderPayload.orders[index].chow_details.flavours.varieties.retail_price,
      name: "chow_details.retail_price",
    },
    {
      title: "Delivery Fee",
      content: "Add delivery fee dropdown here",
      name: "REPLACE_WHEN_WE_WORK_OUT_DATASHAPE",
    },
    {
      title: "Total Cost",
      content: "Calculate all costs in our API",
      name: "REPLACE_WHEN_WE_WORK_OUT_DATASHAPE",
    },
  ];

  const chowFields = (index: number) => [
    {
      title: "Brand",
      content: orderPayload.orders[index].chow_details.brand,
      name: "chow_details.brand",
    },
    {
      title: "Flavour",
      content: orderPayload.orders[index].chow_details.flavours.flavour_name,
      name: "chow_details.flavour",
    },
    {
      title: "Size",
      content: orderPayload.orders[index].chow_details.flavours.varieties.size,
      name: "chow_details.size",
    },
    {
      title: "Unit",
      content: orderPayload.orders[index].chow_details.flavours.varieties.unit,
      name: "chow_details.unit",
    },
    {
      title: "Quantity",
      content: orderPayload.orders[index].quantity,
      name: "quantity",
    },
  ];

  return (
    <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
      {orderPayload.orders.map((order, index: number) => (
        <>
          <View style={{ width: "90%" }}>
            {/* Checkmarks like Driver Paid, etc */}
            <Text
              style={{ fontSize: 26, textAlign: "center", fontWeight: "600" }}
            >
              {orderPayload.client_name}
            </Text>

            <Header>Delivery Date</Header>
            {/*  ignore this error till we implement the date-selector */}
            {/* @ts-ignore */}
            <CustomInput handleChange={handleChange}>
              {formattedDeliveryDate}
            </CustomInput>

            <Header>Chow Details</Header>
            {renderDetailInputs(chowFields(index), handleChange, index)}

            {/* TODO:  Add driver fees here: remember that we want a dropdown of 4 different delivery fees */}
            <Header>Costs</Header>
            {renderDetailInputs(costsFields(index), handleChange, index)}
          </View>
          <Button
            colorScheme="danger"
            style={{
              marginTop: 20,
              width: 150,
              alignSelf: "center",
            }}
            onPress={() => handleUpdate(index)}
          >
            Update Order
          </Button>
        </>
      ))}
    </ScrollView>
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
