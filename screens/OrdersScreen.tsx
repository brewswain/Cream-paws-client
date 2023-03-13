import { useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

import "react-native-get-random-values";
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

const OrdersScreen = () => {
   const [showModal, setShowModal] = useState<boolean>(false);
   const [chow, setChow] = useState<Chow[]>();
   const [orders, setOrders] = useState<Order[]>();
   const [customers, setCustomers] = useState<Customer[]>();

   const { orderDetails, orderHeader, orderContainer } = styles;

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
      // console.log({ response });
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

   const uuid = uuidv4();

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

   const customersArray = customers && customers;

   const renderOrders = (customer: Customer, index: number) => {
      return;
   };
   return (
      <View style={styles.container}>
         <View>
            {/* Nested Map isn't the best pattern but it's functional and performance cost shouldn't be atrocious based on scale*/}
            {customersArray?.map((customer) => {
               const mappedCostArray = customer.orders
                  ?.filter((order) => order.payment_made === false)
                  .map(
                     (order) => order.chow_details.retail_price * order.quantity
                  );

               return (
                  <View style={orderContainer} key={customer.id}>
                     <Text style={orderHeader}>{customer.name}</Text>

                     {/*  WIP, need to separate tax and delivery costs properly */}
                     {mappedCostArray ? (
                        <Text style={orderDetails}>
                           Total outstanding cost:{" "}
                           {mappedCostArray.reduce(
                              (accumulator, currentValue) =>
                                 accumulator + currentValue,
                              0
                           )}
                        </Text>
                     ) : null}
                     <Text style={orderDetails}>
                        Quantity of orders: {customer.orders?.length}
                     </Text>
                     <View>
                        {customer.orders?.map((order) => {
                           return (
                              <View>
                                 <Text
                                    style={orderDetails}
                                 >{`${order.chow_details.brand}-${order.chow_details.size} ${order.chow_details.unit} x ${order.quantity}`}</Text>
                                 <Text style={orderDetails}>
                                    WIP Warehouse Price:{" "}
                                    {order.chow_details.wholesale_price *
                                       order.quantity}
                                 </Text>
                                 <Text style={orderDetails}></Text>
                              </View>
                           );
                        })}
                     </View>
                  </View>
               );
            })}
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
   orderContainer: {
      display: "flex",
      flexDirection: "column",
   },
   orderHeader: {
      display: "flex",
      alignSelf: "center",
      textAlign: "center",
      fontSize: 24,
      width: "100%",
      borderBottomWidth: 1,
      borderBottomColor: "black",
   },
   orderDetails: {
      fontSize: 14,
      // paddingTop: 2,
      paddingLeft: 4,
   },
});

export default OrdersScreen;
