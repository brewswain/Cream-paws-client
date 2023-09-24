import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { deleteCustomer } from "../../api";
import { useState } from "react";
import { Button, Modal } from "native-base";

interface CustomerCardProps {
  customer: Customer;
  populateCustomersList: () => void;
}
const CustomerCard = ({
  customer,
  populateCustomersList,
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

  const handleClick = (id: string) => {
    navigation.navigate("CustomerDetails", customer);
  };

  const handleDelete = (id: string) => {
    deleteCustomer(id);
    populateCustomersList();
  };

  const openOrdersArray = customer.orders?.filter(
    (order) => order.payment_made === false
  );

  return (
    <>
      <Pressable onPress={() => handleClick(customer.id)}>
        {customer.orders && customer.orders.length > 0 && (
          <View style={openOrdersContainer}>
            <View style={detailsContainer}>
              <Text style={clientNameHeader}>{name}</Text>
            </View>
            <View style={priceContainer}>
              <Pressable onPress={() => setShowModal(true)}>
                <Icon
                  name="trash-o"
                  style={{ color: "white", marginRight: 8, zIndex: 20 }}
                  size={20}
                />
              </Pressable>
              <Text style={price}>
                {` Open Orders:${openOrdersArray?.length}`}
              </Text>
            </View>
          </View>
        )}

        {customer.orders && customer.orders?.length < 1 && (
          <View style={noOrdersContainer}>
            <View style={detailsContainer}>
              <Text style={[clientNameHeader, { color: "black" }]}>{name}</Text>
            </View>
            <Pressable onPress={() => setShowModal(true)}>
              <Icon name="trash-o" size={20} style={{ marginRight: 20 }} />
            </Pressable>
          </View>
        )}
      </Pressable>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Delete Confirmation</Modal.Header>
          <Modal.Body>
            <Text>
              Please confirm that you wish to delete this customer -
              {customer.name}.
            </Text>
            <Button
              colorScheme="danger"
              style={{ marginTop: 60, width: 100, alignSelf: "center" }}
              onPress={() => handleDelete(customer.id)}
            >
              Delete
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
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
