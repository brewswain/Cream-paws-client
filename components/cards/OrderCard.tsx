import { Dispatch, SetStateAction, useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Dinero from "dinero.js";

import { deleteCustomersOrder } from "../../api/routes/orders";

import { CombinedOrder } from "../../models/order";

interface OrderCardProps {
  client_name: string;
  data: CombinedOrder;
  setIsDeleted: Dispatch<SetStateAction<boolean | null>>;
  isDeleted: boolean | null;
  populateData: () => void;
  customerId: string;
}

const OrderCard = ({
  client_name,
  data,
  isDeleted,
  setIsDeleted,
  populateData,
  customerId,
}: OrderCardProps) => {
  const navigation = useNavigation();
  const { orders } = data;

  const {
    container,
    detailsContainer,
    clientNameHeader,
    orderDetails,
    priceContainer,
    price,
    timestamp,
    flexRow,
  } = styles;

  const viewDetails = () => {
    navigation.navigate("OrderDetails", {
      orders,
      client_name,
      delivery_date: data.delivery_date,
      customer_id: customerId,
    });
  };

  const handleDelete = async (orderId: string, customerId: string) => {
    try {
      setIsDeleted(false);
      // await deleteOrder(orderId);
      await deleteCustomersOrder(orderId, customerId);
      setIsDeleted(true);
      populateData();
    } catch (error) {
      console.error(error);
    }
  };

  const mappedCostArray = orders
    .filter((order) => order.payment_made === false)
    .map(
      (order) =>
        order.chow_details.flavours.varieties.retail_price * order.quantity
    );

  const subTotal = Math.round(
    mappedCostArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * 100
  );

  const totalWithDeliveryCost = data.delivery_cost
    ? subTotal + data.delivery_cost * 100
    : subTotal;

  const formattedDeliveryDate = new Date(data.delivery_date).toDateString();
  const today = new Date().toDateString();
  return (
    <View style={container}>
      <Pressable style={flexRow} onPress={() => viewDetails()}>
        <Text style={timestamp}>
          {formattedDeliveryDate === today ? "Today" : formattedDeliveryDate}
        </Text>
        <View
          style={{
            width: "90%",
          }}
        >
          <View style={detailsContainer}>
            <Text style={clientNameHeader}>{client_name}</Text>
            {orders.map((order, index) => {
              return (
                <View key={`${order.id} - ${index}`}>
                  <Text style={orderDetails}>
                    {`${order.chow_details.brand} - ${order.chow_details.flavours.flavour_name} x ${order.quantity}`}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={priceContainer}>
            <Text style={price}>
              {Dinero({
                amount: Math.round(totalWithDeliveryCost || 0),
              }).toFormat("$0,0.00")}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    position: "relative",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    borderColor: "#e3e3e3",
    borderWidth: 1,
    marginVertical: 4,
    padding: 10,
    // backgroundColor: "#434949",
    minHeight: 120,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 120,
  },
  detailsContainer: {
    marginLeft: 8,
    paddingBottom: 4,
  },
  clientNameHeader: {
    fontSize: 22,
    color: "black",
    paddingVertical: 4,
  },
  orderDetails: {
    color: "#6c747a",
    width: "100%",
    marginVertical: 2,
  },
  priceContainer: {
    marginLeft: 8,
  },
  price: {
    color: "#38d180",
    fontSize: 20,
  },
  timestamp: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 12,
    color: "#588ca8",
    fontFamily: "Poppins",
  },
});

export default OrderCard;
