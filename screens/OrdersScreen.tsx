import { Button, Text, View } from "react-native";
import {
   createOrder,
   deleteOrder,
   getAllOrders,
   updateOrder,
} from "../api/routes/orders";

const OrdersScreen = () => {
   // Test payload
   const orderPayload: Order = {
      delivery_date: "test_delivery_date",
      payment_made: true,
      payment_date: "test_payment_date",
      is_delivery: true,
      driver_paid: true,
      warehouse_paid: false,
      customer_id: "632af554efd6cbb9858a5157",
      chow_id: "632af56a806f2af148eba268",
   };

   const updatedOrderPayload: Order = {
      delivery_date: "updated date",
      payment_made: true,
      payment_date: "test_payment_date 2",
      is_delivery: true,
      driver_paid: true,
      warehouse_paid: false,
      customer_id: "632af554efd6cbb9858a5157",
      chow_id: "632af56a806f2af148eba268",
   };

   const createOrderTest = async () => {
      await createOrder(orderPayload);
   };

   const deleteOrderTest = async (id: string) => {
      await deleteOrder(id);
   };

   // TODO: fix types
   const updateOrderTest = async (id: string, order: Order) => {
      await updateOrder(id, order);
   };

   const getAllOrdersTest = async () => {
      const response = await getAllOrders();
      console.log({ response });
   };

   return (
      <View>
         <Button
            title="Create Order"
            onPress={() => {
               createOrderTest();
            }}
         />
         <Button
            title="Delete Order"
            onPress={() => {
               deleteOrderTest("632af6adc540b867a3243042");
            }}
         />
         <Button
            title="Update Order"
            onPress={() => {
               updateOrderTest("632af6adc540b867a3243042", updatedOrderPayload);
            }}
         />

         <Button
            title="Get All Orders"
            onPress={() => {
               getAllOrdersTest();
            }}
         />
         {/* <Button title="Get Customer's Order" onPress={() => {}} /> */}
      </View>
   );
};

export default OrdersScreen;
