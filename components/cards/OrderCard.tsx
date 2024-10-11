import { Dispatch, SetStateAction, useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Dinero from "dinero.js";

import { deleteCustomersOrder } from "../../api/routes/orders";

import { CombinedOrder, OrderFromSupabase } from "../../models/order";

interface OrderCardProps {
  client_name: string;
  data: OrderFromSupabase;
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
      order: data,
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

  // const mappedCostArray = orders
  //   .filter((order) => order.payment_made === false)
  //   .map(
  //     (order) =>
  //       order.chow_details.flavours.varieties.retail_price * order.quantity
  //   );

  // const subTotal = Math.round(
  //   mappedCostArray.reduce(
  //     (accumulator, currentValue) => accumulator + currentValue,
  //     0
  //   ) * 100
  // );

  // const deliveryCostArray = data.orders
  //   .map((order) => order.delivery_cost)
  //   .sort((a, b) => b - a);

  // const totalWithDeliveryCost = deliveryCostArray[0]
  //   ? subTotal + deliveryCostArray[0] * 100
  //   : subTotal;

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
            {/* {orders.map((order, index) => {
              return (
                <View key={`${order.id} - ${index}`}>
                  <Text style={orderDetails}>
                    {`${order.chow_details.brand} - ${order.chow_details.flavours.flavour_name} x ${order.quantity}`}
                  </Text>
                </View>
                );
                })} */}
            <View key={data.id}>
              <Text
                style={orderDetails}
              >{`${data.flavours.brand_details.name}  - ${data.flavours.details.flavour_name} x ${data.quantity}`}</Text>
            </View>
          </View>
          <View style={priceContainer}>
            <Text style={price}>
              {Dinero({
                amount: Math.round(
                  (data.delivery_cost + data.retail_price) * 100 || 0
                ),
              }).toFormat("$0,0.00")}
              {/* {Dinero({
                amount: Math.round(totalWithDeliveryCost || 0),
              }).toFormat("$0,0.00")} */}
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
