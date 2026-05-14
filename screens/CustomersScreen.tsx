import Icon from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "native-base";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

import { generateSkeletons } from "../components/Skeleton/Skeleton";
import CustomerCard from "../components/cards/CustomerCard";
import CreateCustomerModal from "../components/modals/CreateCustomerModal";
import { useCustomersWithOrdersQuery } from "../hooks/useCustomersWithOrdersQuery";
import { Customer } from "../models/customer";

function partitionByOpenOrders(customers: Customer[]) {
  const withOpen = customers.filter(
    (c) => c.orders?.some((o) => !o.payment_made) ?? false
  );
  const withoutOpen = customers.filter((c) => {
    if (c.orders?.length) {
      return c.orders.every((o) => o.payment_made === true);
    }
    return true;
  });
  return { withOpen, withoutOpen };
}

const CustomersScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);

  const { data: customers = [], isPending, error, refetch } =
    useCustomersWithOrdersQuery();

  const { withOpen: customersWithOpenOrders, withoutOpen: customersWithoutOpenOrders } =
    useMemo(() => partitionByOpenOrders(customers), [customers]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Could not load customers",
        text2: error instanceof Error ? error.message : String(error),
      });
    }
  }, [error]);

  const populateCustomersList = useCallback(() => {
    void refetch();
  }, [refetch]);

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      {isPending ? (
        generateSkeletons({ count: 12, type: "CustomerSkeleton" })
      ) : (
        <ScrollView>
          {customersWithOpenOrders.map((customer, index) => (
            <View
              key={customer.id}
              style={index === 0 ? { marginTop: 12 } : null}
            >
              <CustomerCard
                customer={customer}
                populateCustomersList={populateCustomersList}
                isDeleted={isDeleted}
                setIsDeleted={setIsDeleted}
              />
            </View>
          ))}
          {customersWithoutOpenOrders.map((customer, index) => (
            <View
              key={customer.id}
              style={index === 0 ? { marginTop: 12 } : null}
            >
              <CustomerCard
                customer={customer}
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
