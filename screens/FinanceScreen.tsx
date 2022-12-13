import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { getAllCustomers } from "../api";
import { ChowDetails } from "../components";

const FinanceScreen = () => {
   const [warehouseTotal, setWarehouseTotal] = useState(0);
   // getAllOrders
   // Reduce sum of every single order's warehouse price
   // Calculate Tax on the sum, not individual chow
   // Display Amount owed to the warehouse with said tax.
   // TODO: Put the heavy logic into our backend once this approach is verified
   const getWarehouseOwedCost = async () => {
      const response: Customer[] = await getAllCustomers();
      // TODO: stopgap for development speed--Instead of extracting our prices
      // here, do this in API
      // const orderCostArray = response.map(order => order.)
      // Okay. We need to get our orders here. The problem is, they're attached to our customers. This means that we'll need to make a call to our Customers route while looking for orders. Some logic routes i can see include:
      // - Make a call to our getAllOrders() route. from there, we can iterate through and extract every customerId, and pull a list of those orders. From there, we extract warehouse_price from each customer and then run our reduce.
      //   This approach is obviously incredibly expensive and incredibly naive. However, it IS a solution and should be seen as nothing more than a framework for getting our mindMap under control.
      /* - Make a call to getAllCustomers(). From here, we filter those that have an orders[] length of 1 or higher, while extracting  our wholesale_price x quantity. This method still isn't good but it's better than the above.
       */

      const customersWithOrders = response
         .filter(
            (customer) =>
               customer.orders &&
               customer.orders.some((orders) => !orders.warehouse_paid)
         )
         .map((orderArray) => orderArray.orders)
         .flat();

      const warehousePriceTotal = customersWithOrders
         .map(
            (order) =>
               order && order?.chow_details.wholesale_price * order?.quantity
         )
         .reduce(
            (accumulator, currentValue) => accumulator! + currentValue!,
            0
         );

      const totalWithTax =
         warehousePriceTotal &&
         warehousePriceTotal * 0.125 + warehousePriceTotal;

      console.log(warehousePriceTotal, totalWithTax);
      // getSum(customersWithOrders);
      //       addTax(totalChowCost)
      totalWithTax && setWarehouseTotal(totalWithTax);
   };

   // const getSum = (costs) => {
   //    const orderSum = costs.reduce(
   //       (accumulator, currentValue) => accumulator + currentValue
   //    );
   //    // setTotalChowCost(orderSum)
   // };

   getWarehouseOwedCost();

   return (
      <View>
         <Text>Finances</Text>
         {/* Have list of relevant orders */}
         <Text>Amount owed Troy:</Text>
         <Text>{warehouseTotal}</Text>
         <View>
            <Text>Stock Breakdown:</Text>
            <ChowDetails />
         </View>
         {/* Show stock unpaid */}
         <Text>Amount owed Josh:</Text>
         <Text>
            WIP, but mirrors a lot of logic as Warehouse price calculation.{" "}
         </Text>
      </View>
   );
};

export default FinanceScreen;
