import { useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

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

const OrdersScreen = () => {
   const [showModal, setShowModal] = useState<boolean>(false);
   const [chow, setChow] = useState<Chow[]>();
   const [orders, setOrders] = useState<Order[]>();
   const [customers, setCustomers] = useState<Customer[]>();

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
      console.log({ response });
      setCustomers(response);
   };

   const populateData = async () => {
      await populateChowList();
      await populateCustomersList();
      await populateOrdersList();
   };

   const openModal = () => {
      setShowModal(true);
   };

   useEffect(() => {
      populateData();
   }, []);

   // Test payload
   // const orderPayload: Order = {
   //    delivery_date: "test_delivery_date",
   //    payment_made: true,
   //    payment_date: "test_payment_date",
   //    is_delivery: true,
   //    driver_paid: true,
   //    warehouse_paid: false,
   //    customer_id: "632af554efd6cbb9858a5157",
   //    chow_id: "632af56a806f2af148eba268",
   // };

   // const updatedOrderPayload: Order = {
   //    delivery_date: "updated date",
   //    payment_made: true,
   //    payment_date: "test_payment_date 2",
   //    is_delivery: true,
   //    driver_paid: true,
   //    warehouse_paid: false,
   //    customer_id: "632af554efd6cbb9858a5157",
   //    chow_id: "632af56a806f2af148eba268",
   // };

   const testArray = customers && customers[0];

   return (
      <View style={styles.container}>
         <View>
            {testArray &&
               testArray!.orders!.map((order) => (
                  <Text>
                     WIP Warehouse Price:{" "}
                     {order.chow_details.wholesale_price * order.quantity}
                  </Text>
               ))}
         </View>
         <Pressable style={styles.buttonContainer} onPress={openModal}>
            <Icon name="plus" size={20} />
         </Pressable>
         <CreateOrderModal
            isOpen={showModal}
            setShowModal={setShowModal}
            populateOrdersList={populateOrdersList}
            chow={chow}
            customers={customers}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
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

export default OrdersScreen;
