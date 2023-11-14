import { Dispatch, SetStateAction, useState } from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import Dinero from "dinero.js";
import Icon from "react-native-vector-icons/FontAwesome";
import DeleteModal from "../modals/DeleteModal";
import { deleteOrder } from "../../api";
import { deleteCustomersOrder } from "../../api/routes/orders";
import SettingsModal from "../modals/SettingsModal";
import { useNavigation } from "@react-navigation/native";

interface OrderCardProps {
  client_name: string;
  order: OrderWithChowDetails;
  setIsDeleted: Dispatch<SetStateAction<boolean | null>>;
  isDeleted: boolean | null;
  populateData: () => void;
  customerId: string;
}

const OrderCard = ({
  client_name,
  order,
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
    navigation.navigate("OrderDetails", { ...order, client_name });
  };

  const handleDelete = async (orderId: string, customerId: string) => {
    try {
      setIsDeleted(false);
      // await deleteOrder(id);
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
        <View style={{ width: "80%" }}>
          <View style={detailsContainer}>
            <Text style={clientNameHeader}>{client_name}</Text>
            <Text
              style={orderDetails}
            >{`${order.chow_details.brand} - ${order.chow_details.flavour} x ${order.quantity}`}</Text>
          </View>
          <View style={priceContainer}>
            <Text style={price}>
              {Dinero({
                amount:
                  Math.round(
                    order.chow_details.retail_price * order.quantity || 0
                  ) * 100,
              }).toFormat("$0,0.00")}
            </Text>
          </View>
        </View>
        <Pressable onPress={() => setShowModal(true)}>
          <Icon
            name="ellipsis-h"
            size={20}
            style={{ padding: 12, color: "white" }}
          />
        </Pressable>
      </Pressable>
      <SettingsModal
        showModal={showModal}
        setShowModal={setShowModal}
        handlePress={() =>
          handleDelete(order._id || "id not found", customerId)
        }
        deletionId={order._id}
      />
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
    marginBottom: 8,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
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
    display: "flex",
    alignSelf: "flex-start",
    marginLeft: 8,
    marginBottom: 8,
  },
  price: {
    color: "#55E8D9",
    fontSize: 20,
  },
});

export default OrderCard;
