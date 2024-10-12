import { useNavigation } from "@react-navigation/native";
import { Button, Modal } from "native-base";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { deleteCustomer } from "../../api";
import DeleteModal from "../modals/DeleteModal";
import SettingsModal from "../modals/SettingsModal";
import { Customer } from "../../models/customer";

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

  const { name, city } = customer;
  const {
    cardContainer,
    clientDetails,
    emphasis,
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
    navigation.navigate("CustomerDetails", { customer });
  };

  const handleEdit = () => {
    setShowModal(false);
    navigation.navigate("EditCustomer", customer);
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

  const hasOpenOrders = openOrdersArray && openOrdersArray.length > 0;

  return (
    <>
      <TouchableOpacity
        onPress={() => viewDetails()}
        onLongPress={() => setShowModal(true)}
      >
        <View style={cardContainer}>
          <View style={detailsContainer}>
            <Text style={clientNameHeader}>{name}</Text>
            <View style={{ flexDirection: "row" }}>
              {city && (
                <Text style={clientDetails}>
                  {city} {hasOpenOrders && <Icon name="circle" size={8} />}{" "}
                </Text>
              )}
              {hasOpenOrders && (
                <Text style={emphasis}>
                  {` Open Orders: ${openOrdersArray?.length}`}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <SettingsModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleEdit={handleEdit}
        handleDeletion={handleDelete}
        deletionId={customer.id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    display: "flex",
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 6,
    borderColor: "#e3e3e3",
    borderWidth: 1,
    width: "90%",
    minHeight: 80,
    marginVertical: 4,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },

  detailsContainer: {
    marginLeft: 8,
  },
  clientNameHeader: {
    fontSize: 20,
    color: "black",
    marginVertical: 4,
    // fontFamily: "Poppins-semibold",
  },
  clientDetails: {
    fontSize: 14,
    color: "#6c747a",
  },
  emphasis: {
    fontSize: 12,
    color: "#588ca8",
    marginTop: 2,
    fontFamily: "Poppins-semibold",
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
