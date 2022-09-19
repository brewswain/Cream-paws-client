import { Button, Text, View } from "react-native";
import { createOrder } from "../api/routes/orders";

const OrdersScreen = () => {
   const orderPayload: Order = {
      delivery_date: "test_delivery_date",
      payment_made: true,
      payment_date: "test_payment_date",
      is_delivery: true,
      driver_paid: true,
      warehouse_paid: false,
      customer_id: "632396fd81a6363cb0d11c2e",
      chow_id: "6323a6b3b1c47a72f1319604",
   };

   const createOrderTest = async () => {
      const response = await createOrder(orderPayload);
   };
   return (
      <View>
         <Button
            title="Create Order"
            onPress={() => {
               createOrderTest();
            }}
         />
         <Button title="Delete Order" onPress={() => {}} />
         <Button title="Update Order" onPress={() => {}} />

         <Button title="Get All Orders" onPress={() => {}} />
         <Button title="Get Customer's Order" onPress={() => {}} />
      </View>
   );
};

export default OrdersScreen;
