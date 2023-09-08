import { useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

import "react-native-get-random-values";
import Dinero from "dinero.js";
import { v4 as uuidv4 } from "uuid";

import Icon from "react-native-vector-icons/AntDesign";

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

const OrdersScreen = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chow, setChow] = useState<Chow[]>();
  const [orders, setOrders] = useState<Order[]>();
  const [customers, setCustomers] = useState<Customer[]>();

  const { orderHeader, orderContainer, totalOrderDetails } = styles;

  const populateOrdersList = async () => {
    const response = await getAllOrders();

    setOrders(response);
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

  // const uuid = uuidv4();

  useEffect(() => {
    populateData();
  }, []);

  const customersArray = customers && customers;

  return (
    <View style={styles.container}>
      <ScrollView>
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
                            key={order.id + index}
                            style={index === 0 ? { paddingTop: 20 } : null}
                          >
                            {order ? (
                              <OrderCard
                                clientName={customer.name}
                                order={order}
                              />
                            ) : null}
                          </View>
                        );
                      })}
                </View>
              </View>
            );
          })}
        </View>

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
