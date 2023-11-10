import axios from "axios";
import { ScrollView } from "native-base";
import { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, Pressable } from "react-native";
import Icon from "@expo/vector-icons/AntDesign";

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
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);

  const populateCustomersList = async () => {
    const response: Customer[] = await getAllCustomers();
    // TODO: this logic should be  localised inside of the backend. Let's refactor this later.
    // The goal is that getAllCustomers() will return an object with 2 fields: customersWithOrders and customersWithoutOrders.
    // So basically, we'll get response.customersWithOrders and response.customersWithoutOrders. That too can be optimized so that our state
    // only uses one object and specifies from there, but i like the separation for now as it makes my life easier

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
  }, [isDeleted]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {customersWithOpenOrders &&
          customersWithOpenOrders.map((customer, index) => (
            <View
              key={customer.id}
              style={index === 0 ? { marginTop: 12 } : null}
            >
              <CustomerCard
                customer={customer}
                key={customer.id}
                populateCustomersList={populateCustomersList}
                isDeleted={isDeleted}
                setIsDeleted={setIsDeleted}
              />
            </View>
          ))}
        {customersWithoutOpenOrders &&
          customersWithoutOpenOrders.map((customer, index) => (
            <View
              key={customer.id}
              style={index === 0 ? { marginTop: 12 } : null}
            >
              <CustomerCard
                customer={customer}
                key={customer.id}
                populateCustomersList={populateCustomersList}
                isDeleted={isDeleted}
                setIsDeleted={setIsDeleted}
              />
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
