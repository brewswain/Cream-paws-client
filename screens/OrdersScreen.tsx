import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import "react-native-get-random-values";

import Icon from "@expo/vector-icons/AntDesign";

import { ScrollView } from "native-base";
import { useFocusEffect } from "@react-navigation/native";

import { OrderCard } from "../components";
import { generateSkeletons } from "../components/Skeleton/Skeleton";
import CreateOrderModal from "../components/modals/CreateOrderModal";
import { useCustomersWithOrdersQuery } from "../hooks/useCustomersWithOrdersQuery";
import { resolveCustomersQueryData } from "../lib/customers/resolveCustomersQueryData";
import { flattenOrdersFromCustomers } from "../lib/orders/flattenOrdersFromCustomers";

const OrdersScreen = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);
  const { data, isPending, refetch } = useCustomersWithOrdersQuery();
  const customers = resolveCustomersQueryData(data);

  const { outstandingOrders, completedOrders } = useMemo(() => {
    const flat = flattenOrdersFromCustomers(customers);
    const outstanding = flat
      .filter((order) => order.payment_made === false)
      .sort(
        (a, b) =>
          new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime()
      );
    const completed = flat
      .filter((order) => order.payment_made === true)
      .sort(
        (a, b) =>
          new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime()
      );
    return { outstandingOrders: outstanding, completedOrders: completed };
  }, [customers]);

  const populateData = useCallback(() => {
    void refetch();
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  const openModal = () => {
    setShowModal(true);
  };

  const showInitialLoad = isPending && customers.length === 0;

  return (
    <View style={styles.container}>
      <ScrollView>
        {showInitialLoad ? (
          generateSkeletons({ count: 4, type: "OrderSkeleton" })
        ) : (
          <>
            <View>
              <Text>Incomplete Orders</Text>
              {outstandingOrders?.map((order) => {
                return (
                  <View key={order.id}>
                    <OrderCard
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
              {completedOrders?.map((order) => {
                return (
                  <View key={order.id}>
                    <OrderCard
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
