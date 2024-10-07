import Icon from "@expo/vector-icons/AntDesign";
import axios from "axios";
import { ScrollView } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

import { getAllCustomers } from "../api/routes/customers";

import { useFocusEffect } from "@react-navigation/native";
import { generateSkeletons } from "../components/Skeleton/Skeleton";
import CustomerCard from "../components/cards/CustomerCard";
import CreateCustomerModal from "../components/modals/CreateCustomerModal";
import { Customer } from "../models/customer";

const CustomersScreen = () => {
  const [customersWithOpenOrders, setCustomersWithOpenOrders] =
    useState<Customer[]>();
  const [customersWithoutOpenOrders, setCustomersWithoutOpenOrders] =
    useState<Customer[]>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const populateCustomersList = async () => {
    setIsLoading(true);
    try {
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
      const mappedCustomersWithoutOrders = response.filter((customer) => {
        if (customer.orders) {
          return customer.orders.every((order) => order.payment_made === true);
        }
        return customer;
      });

      setCustomersWithOpenOrders(mappedCustomersWithOrders);
      setCustomersWithoutOpenOrders(mappedCustomersWithoutOrders);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const renderCustomerCard = (customer: Customer) => {};

  useFocusEffect(
    useCallback(() => {
      populateCustomersList();
    }, [isDeleted])
  );
  return (
    <View style={styles.container}>
      {isLoading ? (
        generateSkeletons({ count: 12, type: "CustomerSkeleton" })
      ) : (
        <ScrollView>
          {customersWithOpenOrders?.map((customer, index) => {
            return (
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
            );
          })}
          {customersWithoutOpenOrders?.map((customer, index) => (
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
        </ScrollView>
      )}
      <CreateCustomerModal
        isOpen={showModal}
        setShowModal={setShowModal}
        populateCustomerList={populateCustomersList}
      />
      <Pressable style={styles.buttonContainer} onPress={openModal}>
        <Icon name="plus" size={20} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f2f3",
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
