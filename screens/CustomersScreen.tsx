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
import { PostgrestError } from "@supabase/supabase-js";
import { useCustomerStore } from "../store/customerStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomersScreen = () => {
  const [customersWithOpenOrders, setCustomersWithOpenOrders] =
    useState<Customer[]>();
  const [customersWithoutOpenOrders, setCustomersWithoutOpenOrders] =
    useState<Customer[]>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);

  const { customers, error, isFetching, fetchCustomers } = useCustomerStore();

  const populateCustomersList = async () => {
    const filterOpenOrders = (customers: Customer[]) => {
      return customers.filter((customer) => {
        if (customer.orders) {
          return customer.orders.some((order) => order.payment_made === false);
        }
      });
    };

    const filterNoOpenOrders = (customers: Customer[]) => {
      return customers.filter((customer) => {
        if (customer.orders) {
          return customer.orders.every((order) => order.payment_made === true);
        }
        return customer;
      });
    };

    fetchCustomers();

    setCustomersWithOpenOrders(filterOpenOrders(customers));
    setCustomersWithoutOpenOrders(filterNoOpenOrders(customers));

    if (error) {
      console.error(error);
    }
  };

  console.log({ customersWithOpenOrders });
  const openModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    populateCustomersList();
  }, []);

  return (
    <View style={styles.container}>
      {isFetching ? (
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
