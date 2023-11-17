import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { deleteCustomer } from "../../api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Modal } from "native-base";
import DeleteModal from "../modals/DeleteModal";
import SettingsModal from "../modals/SettingsModal";

interface CustomerCardProps {
  customer: Customer;
  populateCustomersList: () => void;
  setIsDeleted: Dispatch<SetStateAction<boolean | null>>;
  isDeleted: boolean | null;
}
const CustomerCard = ({
  customer,
  populateCustomersList,
  isDeleted,
  setIsDeleted,
}: CustomerCardProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { name } = customer;
  const {
    openOrdersContainer,
    noOrdersContainer,
    clientNameHeader,
    detailsContainer,
    priceContainer,
    price,
  } = styles;

  const navigation = useNavigation();

  // Keeping this as reference for using Animations
  // Using https://reactnative.dev/docs/animated as reference here
  // const expandAnimation = useRef(new Animated.Value(75)).current;
  // const expandClickedView = () => {
  //    Animated.timing(expandAnimation, {
  //       toValue: height,
  //       duration: 300,
  //       easing: Easing.linear,

  //       useNativeDriver: false, // Add This line
  //    }).start();
  // };

  const viewDetails = () => {
    navigation.navigate("CustomerDetails", customer);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleted(false);
      await deleteCustomer(id);
      setIsDeleted(true);
      populateCustomersList();
    } catch (error) {
      console.error(error);
    }
  };

  const openOrdersArray = customer.orders?.filter(
    (order) => order.payment_made === false
  );

  return (
    <>
      <Pressable onPress={() => viewDetails()}>
        {customer.orders && customer.orders.length > 0 && (
          <View style={openOrdersContainer}>
            <View style={detailsContainer}>
              <Text style={clientNameHeader}>{name}</Text>
            </View>
            <View style={priceContainer}>
              <Text style={price}>
                {` Open Orders:${openOrdersArray?.length}`}
              </Text>
              <Pressable onPress={() => setShowModal(true)}>
                <Icon name="ellipsis-h" size={20} style={{ marginLeft: 14 }} />
              </Pressable>
            </View>
          </View>
        )}

        {customer.orders && customer.orders?.length < 1 && (
          <View style={noOrdersContainer}>
            <View style={detailsContainer}>
              <Text style={[clientNameHeader, { color: "black" }]}>{name}</Text>
            </View>
            <Pressable onPress={() => setShowModal(true)}>
              <Icon name="ellipsis-h" size={20} style={{ marginRight: 7 }} />
            </Pressable>
          </View>
        )}
      </Pressable>
      <SettingsModal
        showModal={showModal}
        setShowModal={setShowModal}
        handlePress={handleDelete}
        deletionId={customer.id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  openOrdersContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 4,
    width: "90%",
    backgroundColor: "#434949",
    marginBottom: 8,
    padding: 8,
    background:
      "linear-gradient(89deg, #FFF 24.58%, rgba(255, 255, 255, 0.75) 98.92%))",
  },
  noOrdersContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 4,
    width: "90%",
    backgroundColor: "#BFBFBF",
    marginBottom: 8,
    padding: 8,
    background:
      "linear-gradient(89deg, #FFF 24.58%, rgba(255, 255, 255, 0.75) 98.92%))",
  },
  detailsContainer: {
    display: "flex",
    marginLeft: 8,
  },
  clientNameHeader: {
    fontSize: 20,
    color: "white",
    fontFamily: "Poppins",
  },
  orderDetails: {
    color: "white",
  },
  priceContainer: {
    display: "flex",
    alignSelf: "center",
    marginRight: 8,
    flexDirection: "row",
  },
  price: {
    color: "#14F800",
    fontSize: 14,
  },
});

export default CustomerCard;
