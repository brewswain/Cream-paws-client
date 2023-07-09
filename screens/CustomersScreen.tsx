import axios from "axios";
import { ScrollView } from "native-base";
import { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "../api/routes/customers";

import CustomerCard from "../components/cards/CustomerCard";
import CreateCustomerModal from "../components/modals/CreateCustomerModal";

const CustomersScreen = () => {
  const [customersWithOpenOrders, setCustomersWithOpenOrders] =
    useState<Customer[]>();
  const [customersWithoutOpenOrders, setCustomersWithoutOpenOrders] =
    useState<Customer[]>();
  const [showModal, setShowModal] = useState<boolean>(false);

  const populateCustomersList = async () => {
    const response: Customer[] = await getAllCustomers();
    response.sort((customerA, customerB) => {
      if (customerA.name < customerB.name) {
        return -1;
      }
      if (customerA.name > customerB.name) {
        return 1;
      }
      return 0;
    });
    const mappedCustomersWithOrders = response.filter((customer) => {
      if (customer.orders) {
        return customer.orders.some((order) => order.payment_made === false);
      }
    });
    const mappedCustomersWithoutOrders = response.filter(
      (customer) => customer.orders && customer.orders?.length < 1
    );

    setCustomersWithOpenOrders(mappedCustomersWithOrders);
    setCustomersWithoutOpenOrders(mappedCustomersWithoutOrders);
  };

  const openModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    populateCustomersList();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {customersWithOpenOrders &&
          customersWithOpenOrders.map((customer, index) => (
            <View
              key={customer.id}
              style={index === 0 ? { marginTop: 12 } : null}
            >
              <CustomerCard customer={customer} key={customer.id} />
            </View>
          ))}
        {customersWithoutOpenOrders &&
          customersWithoutOpenOrders.map((customer, index) => (
            <View
              key={customer.id}
              style={index === 0 ? { marginTop: 12 } : null}
            >
              <CustomerCard customer={customer} key={customer.id} />
            </View>
          ))}
        <CreateCustomerModal
          isOpen={showModal}
          setShowModal={setShowModal}
          populateCustomerList={populateCustomersList}
        />
      </ScrollView>
      <Pressable style={styles.buttonContainer} onPress={openModal}>
        <Icon name="plus" size={20} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: 40,
    width: 40,
    bottom: 20,
    right: 10,
    borderRadius: 50,
    backgroundColor: "#8099c1",
  },
});

export default CustomersScreen;
