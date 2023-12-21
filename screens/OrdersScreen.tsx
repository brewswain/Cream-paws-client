import { useCallback, useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

import Icon from "@expo/vector-icons/AntDesign";

import {
  createOrder,
  deleteOrder,
  getAllChow,
  getAllCustomers,
  getAllOrders,
  updateOrder,
} from "../api";

import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "native-base";
import React from "react";
import { OrderCard } from "../components";
import { generateSkeletons } from "../components/Skeleton/Skeleton";
import CreateOrderModal from "../components/modals/CreateOrderModal";
import { combineOrders, getUnpaidCustomerOrders } from "../utils/orderUtils";
import { CombinedOrder, OrderWithChowDetails } from "../models/order";
import { Chow } from "../models/chow";
import { Customer } from "../models/customer";

const OrdersScreen = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chow, setChow] = useState<Chow[]>();
  const [customers, setCustomers] = useState<Customer[]>();
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<CombinedOrder[]>();

  const populateAllData = async () => {
    setIsLoading(true);
    try {
      const response = await getUnpaidCustomerOrders();
      populateCustomersList();
      populateChowList();
      const formattedOrders = response && (await combineOrders(response));
      setData(formattedOrders);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const populateCustomersList = async () => {
    const response = await getAllCustomers();
    setCustomers(response);
  };
  const populateChowList = async () => {
    const response = await getAllChow();
    setChow(response);
  };

  const populateData = async () => {
    // while this is an unnecessary layer for now, i'd rather just keep this code as unchanged as possible for the interim
    populateAllData();
  };

  const openModal = () => {
    setShowModal(true);
  };

  useFocusEffect(
    useCallback(() => {
      populateData();
    }, [isDeleted])
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {isLoading ? (
          generateSkeletons({ count: 4, type: "OrderSkeleton" })
        ) : (
          <View>
            {data?.map((order, index) => {
              return (
                <OrderCard
                  key={order.orders[0].order_id}
                  isDeleted={isDeleted}
                  setIsDeleted={setIsDeleted}
                  populateData={populateData}
                  client_name={order.name}
                  customerId={order.customer_id}
                  data={order}
                />
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
