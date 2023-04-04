import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";

import { clearAllOrders } from "../../utils";
import { Button, Checkbox } from "native-base";
import { clearOrders } from "../../utils/orderUtils";

interface ItemizedBreakdownCardProps {
   outstandingOrders: OrderWithChowDetails[];
   getWarehouseOwedCost(): void;
}

const ItemizedBreakdownCard = ({
   outstandingOrders,
   getWarehouseOwedCost,
}: ItemizedBreakdownCardProps) => {
   const [groupValues, setGroupValues] = useState([]);
   const [selectedOrders, setSelectedOrders] = useState([]);

   const {
      container,
      header,
      headerWrapper,
      tableContainer,
      orderContainer,
      tableQuantity,
      deEmphasis,
      tableChowDescription,
      tablePrice,
      buttonContainer,
      button,
      totalsContainer,
      totalWrapper,
      priceWrapper,
      subTotalCost,
      vatCost,
      totalCost,
   } = styles;

   const orders = outstandingOrders.flat();
   const mappedCostArray = orders
      .filter((order) => order.payment_made === false)
      .map((order) => order.chow_details.wholesale_price * order.quantity);

   const mappedVatArray = orders
      .filter((order) => order.payment_made === false)
      .map((order) => order.chow_details.wholesale_price * 0.125);

   const subTotal = mappedCostArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
   );

   const totalVat = mappedVatArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
   );

   const selectedOrdersArray = groupValues
      .map((orderId) => orders.filter((order) => order.id === orderId))
      .flat();

   const handleClearingSelectedOrders = async () => {
      await clearOrders(selectedOrdersArray);

      getWarehouseOwedCost();
   };
   const handleClearingAllOrders = async () => {
      await clearOrders(orders);

      getWarehouseOwedCost();
   };

   useEffect(() => {
      console.log({ groupValues, selectedOrdersArray });
   }, [groupValues]);

   return (
      <View style={container}>
         {orders.length > 0 ? (
            <Text onPress={() => handleClearingAllOrders()}>hi</Text>
         ) : null}
         <View style={headerWrapper}>
            <Text style={header}>Itemized Breakdown</Text>
         </View>
         <View style={tableContainer}>
            <Checkbox.Group onChange={setGroupValues} value={groupValues}>
               {orders.map((order) => {
                  const vatExclusivePrice: string = Dinero({
                     amount:
                        order.chow_details.wholesale_price * order.quantity,
                  }).toFormat("$0,0.00");

                  return (
                     <View key={order.id} style={[orderContainer]}>
                        <View
                           style={{
                              flexDirection: "row",
                              alignItems: "center",
                           }}
                        >
                           <Text style={tableQuantity}>
                              {order.quantity}
                              <Text style={deEmphasis}>x </Text>
                           </Text>
                           <Text style={tableChowDescription}>
                              {`${order.chow_details.brand} - ${order.chow_details.flavour}`}
                              :
                           </Text>
                           <Text style={tablePrice}> {vatExclusivePrice}</Text>
                        </View>
                        <View>
                           <Checkbox
                              value={`${order.id}`}
                              accessibilityLabel="Checkbox for identifying individual orders to pay"
                           />
                        </View>
                     </View>
                  );
               })}
            </Checkbox.Group>
         </View>
         {orders.length > 0 ? (
            <View style={buttonContainer}>
               <Button
                  onPress={() => handleClearingSelectedOrders()}
                  isDisabled={groupValues.length < 1}
                  style={button}
               >
                  Set orders to "Paid"
               </Button>
            </View>
         ) : null}
         <View style={totalsContainer}>
            <View style={totalWrapper}>
               <View style={priceWrapper}>
                  <Text style={subTotalCost}>Subtotal:</Text>
                  <Text style={subTotalCost}>
                     {Dinero({ amount: subTotal || 0 }).toFormat("$0,0.00")}
                  </Text>
               </View>
               <View style={priceWrapper}>
                  <Text style={vatCost}>VAT:</Text>
                  <Text style={vatCost}>
                     {Dinero({ amount: totalVat || 0 }).toFormat("$0,0.00")}
                  </Text>
               </View>
               <View style={priceWrapper}>
                  <Text style={totalCost}>Total:</Text>
                  <Text style={totalCost}>
                     {Dinero({
                        amount: subTotal + totalVat || 0,
                        precision: 2,
                     }).toFormat("$0,0.00")}
                  </Text>
               </View>
            </View>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      display: "flex",
   },
   headerWrapper: {
      display: "flex",
      tex: "center",
   },
   header: {
      fontSize: 24,
      fontWeight: "600",
      color: "white",
      borderBottomColor: "rgba(255,94,94, 1)",
      borderBottomWidth: 3,
      alignSelf: "center",
      marginTop: 8,
      marginBottom: 8,
   },
   tableContainer: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      marginTop: 6,
   },

   // Fix naming  convention
   orderContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      paddingLeft: 14,
      paddingRight: 14,
   },
   tableQuantity: {
      color: "white",
      fontSize: 18,
   },
   deEmphasis: {
      fontSize: 12,
   },
   tableChowDescription: {
      color: "white",
   },
   tablePrice: {
      color: "white",
      justifyContent: "flex-end",
      fontSize: 18,
      paddingLeft: 12,
   },

   // Button Block
   buttonContainer: {
      display: "flex",
      alignItems: "center",
      marginTop: 20,
   },
   button: { width: "60%" },

   // Orders Block
   totalsContainer: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      margin: 40,
      marginTop: 30,
   },
   totalWrapper: {
      display: "flex",
      alignItems: "center",
      paddingTop: 4,
      justifyContent: "space-between",
      borderTopColor: "rgba(255,94,94, 0.8)",
      borderTopWidth: 1,
   },
   priceWrapper: {
      width: "80%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
   },
   subTotalCost: {
      color: "white",
      fontSize: 20,
   },
   vatCost: {
      color: "white",
      fontSize: 20,
   },
   totalCost: {
      color: "white",
      fontSize: 20,
   },
});

export default ItemizedBreakdownCard;
