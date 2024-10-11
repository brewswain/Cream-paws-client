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
import {
  CombinedOrder,
  OrderFromSupabase,
  OrderWithChowDetails,
} from "../models/order";
import { Chow } from "../models/chow";
import { Customer } from "../models/customer";
import { useCustomerStore } from "../store/customerStore";
import { supabase } from "../utils/supabase";

const OrdersScreen = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chow, setChow] = useState<Chow[]>();
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<OrderFromSupabase[]>();
  const { customers, fetchCustomers } = useCustomerStore();

  const populateAllData = async () => {
    setIsLoading(true);
    try {
      const ordersData = await getAllOrders();

      setData(ordersData);
      // const response = await getUnpaidCustomerOrders();
      // fetchCustomers();
      // populateChowList();
      // const formattedOrders = response && (await combineOrders(response));

      // const

      // // Sort the orders first by delivery_date in ascending order, then by name
      // formattedOrders.sort((a, b) => {
      //   // Compare delivery_date
      //   const dateA = new Date(a.delivery_date);
      //   const dateB = new Date(b.delivery_date);
      //   const dateComparison = dateA - dateB;

      //   // If delivery_date is the same, compare by name
      //   if (dateComparison === 0) {
      //     const nameA = a.name.toLowerCase(); // assuming case-insensitive comparison
      //     const nameB = b.name.toLowerCase();
      //     return nameA.localeCompare(nameB);
      //   }

      //   return dateComparison;
      // });

      // setData(formattedOrders);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
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

  const getCustomerName = async (customerId: number) => {
    const { data, error } = await supabase
      .from("customers")
      .select("name")
      .eq("id", customerId)
      .single();

    if (error) {
      console.error("Error fetching customer's name: ", error);
    }

    return data;
  };

  const deliveryDates = data?.map((order) =>
    new Date(order.delivery_date).toDateString()
  );
  const today = new Date().toDateString();
  return (
    <View style={styles.container}>
      <ScrollView>
        {isLoading ? (
          generateSkeletons({ count: 4, type: "OrderSkeleton" })
        ) : (
          <View>
            {data?.map((order, index) => {
              return (
                <View key={order.customer_id + index.toString()}>
                  <OrderCard
                    key={order.id}
                    isDeleted={isDeleted}
                    setIsDeleted={setIsDeleted}
                    populateData={populateData}
                    client_name={order.customers.name}
                    customerId={order.customer_id}
                    data={order}
                  />
                </View>
              );
            })}
          </View>
        )}

        <CreateOrderModal
          isOpen={showModal}
          setShowModal={setShowModal}
          populateCustomersList={populateData}
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
  },
  totalOrderDetails: {
    color: "white",
    fontSize: 16,
    paddingLeft: 4,
  },
  timeStamp: {},
});

export default OrdersScreen;
