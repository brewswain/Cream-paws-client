import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import "react-native-get-random-values";

import Icon from "@expo/vector-icons/AntDesign";

import { ScrollView } from "native-base";
import { OrderCard } from "../components";
import { generateSkeletons } from "../components/Skeleton/Skeleton";
import CreateOrderModal from "../components/modals/CreateOrderModal";
import { OrderFromSupabase } from "../models/order";
import { Chow } from "../models/chow";
import { useCustomerStore } from "../store/customerStore";
import { supabase } from "../utils/supabase";
import { useOrderStore } from "../store/orderStore";
import { useChowStore } from "../store/chowStore";

const OrdersScreen = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);
  const { customers } = useCustomerStore();
  const {
    orders,
    fetchOrders,
    isFetching,
    setOutstandingOrders,
    setCompletedOrders,
    outstandingOrders,
    completedOrders,
  } = useOrderStore();
  const { fetchChows, chows } = useChowStore();

  const populateAllData = async () => {
    fetchOrders();
    fetchChows();

    setOutstandingOrders(
      orders
        .filter((order) => order.payment_made === false)
        .sort((a, b) => {
          return (
            new Date(a.delivery_date).getTime() -
            new Date(b.delivery_date).getTime()
          );
        })
    );
    setCompletedOrders(
      orders
        .filter((order) => order.payment_made === true)
        .sort((a, b) => {
          return (
            new Date(a.delivery_date).getTime() -
            new Date(b.delivery_date).getTime()
          );
        })
    );
  };

  const populateData = async () => {
    // while this is an unnecessary layer for now, i'd rather just keep this code as unchanged as possible for the interim
    populateAllData();
  };

  const openModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    populateData();
  }, []);

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

  return (
    <View style={styles.container}>
      <ScrollView>
        {isFetching ? (
          generateSkeletons({ count: 4, type: "OrderSkeleton" })
        ) : (
          <>
            <View>
              <Text>Incomplete Orders</Text>
              {outstandingOrders?.map((order, index) => {
                return (
                  <View key={index}>
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
            <View>
              <Text>Completed Orders</Text>
              {completedOrders?.map((order, index) => {
                return (
                  <View key={index}>
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
          </>
        )}

        <CreateOrderModal
          isOpen={showModal}
          setShowModal={setShowModal}
          populateCustomersList={populateData}
          chow={chows}
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
