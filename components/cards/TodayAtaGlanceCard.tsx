import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import Collapsible from "react-native-collapsible";

import { getAllOrders, findCustomer } from "../../api";

const TodayAtaGlanceCard = () => {
   const [orderCollapsed, setOrderCollapsed] = useState<boolean>(true);
   const [stockCollapsed, setStockCollapsed] = useState<boolean>(true);
   const [orders, setOrders] = useState<Order[]>();
   const [customers, setCustomers] = useState<Customer[]>();

   const { container, highlight, header, subHeader, deemphasis } = styles;

   const populateOrders = async () => {
      const response = await getAllOrders();

      setOrders(response);
      populateCustomers(response);
   };

   const populateCustomers = async (response: Order[]) => {
      const customerList = await Promise.all(
         response.map(async (order) => {
            console.log({ customerId: order.customer_id });
            return await findCustomer(order.customer_id);
         })
      );
      console.log({ customerList });
      setCustomers(customerList);
   };

   useEffect(() => {
      populateOrders();
   }, []);

   return (
      <View style={container}>
         <Text style={header}>Today at a Glance</Text>
         <View>
            {/* <Text style={highlight}>
               3 <Text style={subHeader}>orders</Text>
            </Text>
            <Collapsible collapsed={orderCollapsed}>
               <Text style={deemphasis}>Client name here</Text>
            </Collapsible> */}

            {orders && orders.length > 0 ? (
               <TouchableOpacity
                  onPress={() => setOrderCollapsed(!orderCollapsed)}
               >
                  <Text style={highlight}>
                     {orders?.length}{" "}
                     <Text style={subHeader}>
                        {orders?.length > 1 ? "orders" : "order"}
                     </Text>
                  </Text>
               </TouchableOpacity>
            ) : (
               <Text style={subHeader}>No orders left!</Text>
            )}
            <Collapsible collapsed={orderCollapsed}>
               {/* <Text style={deemphasis}>Client name here</Text> */}

               {customers?.map((customer) => (
                  <View>
                     <Text style={deemphasis}>{customer.name}</Text>
                  </View>
               ))}
            </Collapsible>
         </View>

         <TouchableOpacity onPress={() => setStockCollapsed(!stockCollapsed)}>
            <Text style={highlight}>
               5 <Text style={subHeader}>bags of Chow</Text>
            </Text>
            <Collapsible collapsed={stockCollapsed}>
               {/* TODO: fix this up to use dynamic data */}
               <Text style={deemphasis}>Client name here</Text>
            </Collapsible>
         </TouchableOpacity>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#434949",
      width: "90%",
      minHeight: "50%",
      marginTop: 24,
      padding: 12,
   },
   highlight: {
      color: "#B438FF",
      fontSize: 30,
   },
   header: {
      color: "white",
      fontSize: 24,
   },
   subHeader: {
      color: "white",
      fontSize: 20,
   },
   deemphasis: {
      color: "#BCBCBC",
      fontSize: 16,
      paddingLeft: 26,
   },
});

export default TodayAtaGlanceCard;
