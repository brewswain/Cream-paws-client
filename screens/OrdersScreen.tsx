import { useState, useEffect, useCallback } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

import "react-native-get-random-values";
import Dinero from "dinero.js";
import { v4 as uuid } from "uuid";

import Icon from "@expo/vector-icons/AntDesign";

import {
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
  getAllChow,
  getAllCustomers,
} from "../api";

import CreateOrderModal from "../components/modals/CreateOrderModal";
import { OrderCard } from "../components";
import { ScrollView } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { generateSkeletons } from "../components/Skeleton/Skeleton";

const OrdersScreen = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chow, setChow] = useState<Chow[]>();
  const [orders, setOrders] = useState<Order[]>();
  const [customers, setCustomers] = useState<Customer[]>();
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { orderHeader, orderContainer, totalOrderDetails } = styles;

  const populateOrdersList = async () => {
    setIsLoading(true);
    try {
      const response = await getAllOrders();
      setOrders(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const populateChowList = async () => {
    const response = await getAllChow();
    setChow(response);
  };

  const populateCustomersList = async () => {
    const response = await getAllCustomers();
    setCustomers(response);
  };

  const populateData = async () => {
    populateChowList();
    populateCustomersList();
    populateOrdersList();
  };

  const openModal = () => {
    setShowModal(true);
  };

  useFocusEffect(
    useCallback(() => {
      populateData();
    }, [isDeleted])
  );

  const customersArray = customers && customers;

  return (
    <View style={styles.container}>
      <ScrollView>
        {isLoading ? (
          generateSkeletons({ count: 4, type: "OrderSkeleton" })
        ) : (
          <View>
            {/* Nested Map isn't the best pattern but it's functional and performance cost shouldn't be atrocious based on scale*/}
            {customersArray?.map((customer: Customer, index: number) => {
              return (
                <View style={orderContainer} key={customer.id + index}>
                  <View>
                    {customer.orders &&
                      customer.orders
                        .flat()
                        .filter((order) => order.payment_made === false)
                        .map((order, index) => {
                          return (
                            <View
                              key={
                                order._id
                                  ? order._id + index
                                  : `order id not found - ${index}`
                              }
                              style={index === 0 ? { paddingTop: 20 } : null}
                            >
                              <OrderCard
                                isDeleted={isDeleted}
                                setIsDeleted={setIsDeleted}
                                populateData={populateData}
                                client_name={customer.name}
                                customerId={customer.id}
                                order={order}
                              />
                            </View>
                          );
                        })}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <CreateOrderModal
          isOpen={showModal}
          setShowModal={setShowModal}
          populateCustomersList={populateCustomersList}
          chow={chow}
          customers={customers}
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
  orderContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  orderHeader: {
    display: "flex",
    alignSelf: "center",
    textAlign: "center",
    color: "white",
    fontSize: 28,
    width: "100%",
    // borderBottomWidth: 1,
    // borderBottomColor: "black",
  },
  totalOrderDetails: {
    color: "white",
    fontSize: 16,
    paddingLeft: 4,
  },
});

export default OrdersScreen;
