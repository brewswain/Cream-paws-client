import { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { getAllCustomers, getAllOrders } from "../api";
import { ItemizedBreakdownCard } from "../components";
import { testCustomerDetails, testCustomersFinances } from "../data/test_data";

const FinanceScreen = () => {
   const [outstandingOrders, setOutstandingOrders] = useState<any[]>([]);

   const { container, header } = styles;

   // TODO: Put the heavy logic into our backend once this approach is verified
   const getWarehouseOwedCost = async () => {
      // TODO: stopgap for development speed--Instead of extracting our prices
      // here, do this in API
      // const orderCostArray = response.map(order => order.)
      // Okay. We need to get our orders here. The problem is, they're attached to our customers. This means that we'll need to make a call to our Customers route while looking for orders. Some logic routes i can see include:
      // - Make a call to our getAllOrders() route. from there, we can iterate through and extract every customerId, and pull a list of those orders. From there, we extract warehouse_price from each customer and then run our reduce.
      //   This approach is obviously incredibly expensive and incredibly naive. However, it IS a solution and should be seen as nothing more than a framework for getting our mindMap under control.
      /* - Make a call to getAllCustomers(). From here, we filter those that have an orders[] length of 1 or higher, while extracting  our wholesale_price x quantity. This method still isn't good but it's better than the above.
       */
      const orderResponse: Order[] = await getAllOrders();
      const customerResponse: Customer[] = await getAllCustomers();

      const filteredOutstandingOrders = customerResponse.map(
         (customer: any) => {
            return customer.orders?.filter(
               (order: OrderWithChowDetails) => order.payment_made === false
            );
         }
      );
      // TODO: change order object so that it includes chow_details by default, since passing a customer down to get chow info is inefficient
      setOutstandingOrders(filteredOutstandingOrders);
   };

   useEffect(() => {
      getWarehouseOwedCost();
   }, []);

   return (
      <View style={container}>
         <Text style={header}>Finances</Text>

         {outstandingOrders ? (
            <ItemizedBreakdownCard outstandingOrders={outstandingOrders} />
         ) : null}

         {/* New Card Block */}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#434949",
      height: "100%",
   },
   header: {
      color: "white",
      fontSize: 40,
      textAlign: "center",
      margin: 2,
   },
});
export default FinanceScreen;
