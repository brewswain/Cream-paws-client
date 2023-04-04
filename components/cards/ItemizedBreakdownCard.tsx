import { StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";

import { clearAllOrders } from "../../utils";

interface ItemizedBreakdownCardProps {
   outstandingOrders: OrderWithChowDetails[];
   getWarehouseOwedCost(): void;
}

const ItemizedBreakdownCard = ({
   outstandingOrders,
   getWarehouseOwedCost,
}: ItemizedBreakdownCardProps) => {
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

   const handleClearingAllOrders = async () => {
      await clearAllOrders(orders);

      getWarehouseOwedCost();
   };

   return (
      <View style={container}>
         <Text onPress={() => clearAllOrders(orders)}>hi</Text>
         <View style={headerWrapper}>
            <Text style={header}>Itemized Breakdown</Text>
         </View>
         <View style={tableContainer}>
            {orders.map((order) => {
               const vatExclusivePrice = Dinero({
                  amount: order.chow_details.wholesale_price * order.quantity,
               }).toFormat("$0,0.00");

               return (
                  <View key={order.id} style={orderContainer}>
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
               );
            })}
         </View>

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
      justifyContent: "center",
      flexDirection: "column",
   },

   // Fix naming  convention
   orderContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
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
   },

   // Orders Block
   totalsContainer: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      margin: 40,
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
