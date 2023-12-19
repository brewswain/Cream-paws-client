import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import Dinero from "dinero.js";
import Icon from "react-native-vector-icons/FontAwesome";
import { deleteOrder } from "../../api";
import { deleteCustomersOrder } from "../../api/routes/orders";
import DeleteModal from "../modals/DeleteModal";
import SettingsModal from "../modals/SettingsModal";
import { CombinedOrder, OrderWithChowDetails } from "../../models/order";

interface OrderCardProps {
  client_name: string;
  orders: CombinedOrder;
  // order: OrderWithChowDetails;
  setIsDeleted: Dispatch<SetStateAction<boolean | null>>;
  isDeleted: boolean | null;
  populateData: () => void;
  customerId: string;
}

const OrderCard = ({
  client_name,
  orders,
  isDeleted,
  setIsDeleted,
  populateData,
  customerId,
}: OrderCardProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const navigation = useNavigation();

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
    navigation.navigate("OrderDetails", { ...orders, client_name });
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
              console.log({ order, orders });
              // return (
              //   <Text
              //     style={orderDetails}
              //   >{`${order.chow_details.brand} - ${order.chow_details.flavours.flavour_name} x ${order.quantity}`}</Text>
              // );
            })}
          </View>
          {/* <View style={priceContainer}>
            <Text style={price}>
              {Dinero({
                amount:
                  Math.round(
                    orders.chow_details.flavours.varieties.retail_price *
                      orders.quantity || 0
                  ) * 100,
              }).toFormat("$0,0.00")}
            </Text>
          </View> */}
        </View>
        <Pressable onPress={() => setShowModal(true)}>
          <Icon
            name="ellipsis-h"
            size={20}
            style={{ padding: 12, color: "white" }}
          />
        </Pressable>
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
