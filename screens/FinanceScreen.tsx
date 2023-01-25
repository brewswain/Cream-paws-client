import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { getAllCustomers, getAllOrders } from "../api";
import { testCustomerDetails, testCustomersFinances } from "../data/test_data";

const FinanceScreen = () => {
   const [customers, setCustomers] = useState<any[]>();
   const [orders, setOrders] = useState<any[]>();
   const [warehouseTotal, setWarehouseTotal] = useState(0);
   // getAllOrders
   // Reduce sum of every single order's warehouse price
   // Calculate Tax on the sum, not individual chow
   // Display Amount owed to the warehouse with said tax.
   // TODO: Put the heavy logic into our backend once this approach is verified
   const getWarehouseOwedCost = async () => {
      // TODO: RE-ENABLE THIS
      // const response: Customer[] = await getAllCustomers();
      // TODO: stopgap for development speed--Instead of extracting our prices
      // here, do this in API
      // const orderCostArray = response.map(order => order.)
      // Okay. We need to get our orders here. The problem is, they're attached to our customers. This means that we'll need to make a call to our Customers route while looking for orders. Some logic routes i can see include:
      // - Make a call to our getAllOrders() route. from there, we can iterate through and extract every customerId, and pull a list of those orders. From there, we extract warehouse_price from each customer and then run our reduce.
      //   This approach is obviously incredibly expensive and incredibly naive. However, it IS a solution and should be seen as nothing more than a framework for getting our mindMap under control.
      /* - Make a call to getAllCustomers(). From here, we filter those that have an orders[] length of 1 or higher, while extracting  our wholesale_price x quantity. This method still isn't good but it's better than the above.
       */

      const TEST_CUSTOMERS_WITH_ORDERS = testCustomersFinances
         .map((orderArray) => orderArray)
         .flat();

      // const TEST_UNPAID_WAREHOUSE_ORDERS = TEST_CUSTOMERS_WITH_ORDERS.filter(
      //    (order) => order.warehouse_paid === false
      // );

      // const TEST_WAREHOUSE_PRICE_TOTAL = TEST_CUSTOMERS_WITH_ORDERS.map(
      //    (order) =>
      //       order && order?.chow_details.wholesale_price * order?.quantity
      // ).reduce((accumulator, currentValue) => accumulator! + currentValue!, 0);

      // const TEST_TOTAL_WITH_TAX =
      //    TEST_WAREHOUSE_PRICE_TOTAL &&
      //    TEST_WAREHOUSE_PRICE_TOTAL * 0.125 + TEST_WAREHOUSE_PRICE_TOTAL;

      // console.log({
      //    TEST_CUSTOMERS_WITH_ORDERS,
      //    testFilter,
      //    TEST_WAREHOUSE_PRICE_TOTAL,
      //    TEST_TOTAL_WITH_TAX,
      // });
      // const mappedOrders = response
      //    .map((orderArray) => orderArray.orders)
      //    .flat();

      // const UnpaidWarehouseOrders = mappedOrders.filter(
      //    (order) => order.warehouse_paid === false
      // );

      // const warehousePriceTotal = mappedOrders
      //    .map(
      //       (order) =>
      //          order && order?.chow_details.wholesale_price * order?.quantity
      //    )
      //    .reduce(
      //       (accumulator, currentValue) => accumulator! + currentValue!,
      //       0
      //    );

      // Done with tax separate to allow for easier extraction as needed

      // const totalWithTax =
      //    warehousePriceTotal &&
      //    warehousePriceTotal * 0.125 + warehousePriceTotal;

      // getSum(mappedOrders);
      //       addTax(totalChowCost)
      // totalWithTax && setWarehouseTotal(totalWithTax);

      // TEST_TOTAL_WITH_TAX && setWarehouseTotal(TEST_TOTAL_WITH_TAX);
      // setCustomers(testCustomersFinances);
      setOrders(TEST_CUSTOMERS_WITH_ORDERS);
      // setCustomers(response)
      // setOrders(mappedOrders)
   };

   // const getSum = (costs) => {
   //    const orderSum = costs.reduce(
   //       (accumulator, currentValue) => accumulator + currentValue
   //    );
   // setTotalChowCost(orderSum)
   // };

   // TODO: RE-ENABLE THIS ONCE DONE WITH TESTING FOR THE LOVE OF GOD
   useEffect(() => {
      getWarehouseOwedCost();
      // console.log(orders?.map((order) => order));
      //    console.log({ orders });
   }, []);

   useEffect(() => {
      console.log(orders?.map((order) => order));
   }, [orders]);
   return (
      <View>
         <Text>Finances</Text>
         {/* Have list of relevant orders */}
         <Text>Amount owed Troy (Tax Inclusive):</Text>
         <Text>{warehouseTotal}</Text>
         {/* <Text>{warehouseTotal}</Text> */}
         <View>
            <Text>Stock Breakdown:</Text>
         </View>
         {/* Show stock unpaid */}
         <Text>Amount owed Josh:</Text>
         <Text>
            WIP, but mirrors a lot of logic as Warehouse price calculation.{" "}
         </Text>
         <Text>Outstanding Orders:</Text>

         {orders &&
            orders?.map((order) => (
               <Text>
                  {order.name}
                  <Text>
                     {/* {order.quantity * order.chow_details.retail_price} */}
                     {order.quantity}
                  </Text>
               </Text>
            ))}
      </View>
   );
};

export default FinanceScreen;
