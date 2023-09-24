import { Dispatch, SetStateAction, useState } from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import Dinero from "dinero.js";
import Icon from "react-native-vector-icons/FontAwesome";
import DeleteModal from "../modals/DeleteModal";
import { deleteOrder } from "../../api";
import { deleteCustomersOrder } from "../../api/routes/orders";

interface OrderCardProps {
  clientName: string;
  order: OrderWithChowDetails;
  setIsDeleted: Dispatch<SetStateAction<boolean | null>>;
  isDeleted: boolean | null;
  populateData: () => void;
  customerId: string;
}

const OrderCard = ({
  clientName,
  order,
  isDeleted,
  setIsDeleted,
  populateData,
  customerId,
}: OrderCardProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    container,
    detailsContainer,
    clientNameHeader,
    orderDetails,
    priceContainer,
    price,
    flexRow,
  } = styles;

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
      <View style={flexRow}>
        <View>
          <View style={detailsContainer}>
            <Text style={clientNameHeader}>{clientName}</Text>
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
        <Pressable style={{ marginTop: 8 }} onPress={() => setShowModal(true)}>
          <Icon
            name="trash-o"
            size={20}
            style={{ marginRight: 20, color: "white" }}
          />
        </Pressable>
      </View>
      <DeleteModal
        showModal={showModal}
        setShowModal={setShowModal}
        handlePress={() => handleDelete(order.id, customerId)}
        deletionId={order._id}
        message={` Please confirm that you wish to delete this order.`}
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
