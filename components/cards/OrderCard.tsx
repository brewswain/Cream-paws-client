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
  const [showModal, setShowModal] = useState<boolean>(false);

  const navigation = useNavigation();
  const { orders } = data;

  const {
    container,
    detailsContainer,
    clientNameHeader,
    orderDetails,
    priceContainer,
    price,
    flexRow,
  } = styles;

  const viewDetails = () => {
    navigation.navigate("OrderDetails", { orders, client_name });
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

  return (
    <View style={container}>
      {/* Separated items into two Views to allow for better layout */}
      <Pressable style={flexRow} onPress={() => viewDetails()}>
        <View
          style={{
            width: "80%",
          }}
        >
          <View style={detailsContainer}>
            <Text style={clientNameHeader}>{client_name}</Text>
            {/* <Text
              style={orderDetails}
            >{`${orders.chow_details.brand} - ${orders.chow_details.flavours.flavour_name} x ${orders.quantity}`}</Text>
          </View> */}
            {orders.map((order) => {
              return (
                <Text
                  style={orderDetails}
                >{`${order.chow_details.brand} - ${order.chow_details.flavours.flavour_name} x ${order.quantity}`}</Text>
              );
            })}
          </View>
          <View style={priceContainer}>
            <Text style={price}>
              {Dinero({
                amount: Math.round(subTotal || 0),
              }).toFormat("$0,0.00")}
            </Text>
          </View>
        </View>
        {/* <Pressable onPress={() => setShowModal(true)}>
          <Icon
            name="ellipsis-h"
            size={20}
            style={{ padding: 12, color: "white" }}
          />
        </Pressable> */}
      </Pressable>
      {/* <SettingsModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDeletion={() =>
          handleDelete(orders.order_id || "id not found", customerId)
        }
        deletionId={orders.order_id}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 4,
    width: "90%",
    backgroundColor: "#434949",
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
    fontSize: 26,
    color: "white",
    paddingBottom: 4,
  },
  orderDetails: {
    color: "white",
    width: "80%",
  },
  priceContainer: {
    marginLeft: 8,
  },
  price: {
    color: "#55E8D9",
    fontSize: 20,
  },
});

export default OrderCard;
