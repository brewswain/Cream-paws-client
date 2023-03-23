import Dinero from "dinero.js";
import { View, Text, StyleSheet } from "react-native";

interface OrderCardProps {
   clientName: string;
   order: OrderWithChowDetails;
}

const OrderCard = ({ clientName, order }: OrderCardProps) => {
   const {
      container,
      detailsContainer,
      clientNameHeader,
      orderDetails,
      priceContainer,
      price,
   } = styles;

   return (
      <View style={container}>
         {/* Separated items into two Views to allow for better layout */}
         <View style={detailsContainer}>
            <Text style={clientNameHeader}>{clientName}</Text>
            <Text
               style={orderDetails}
            >{`${order.chow_details.brand} - ${order.chow_details.flavour} x ${order.quantity}`}</Text>
         </View>
         <View style={priceContainer}>
            <Text style={price}>
               $
               {Dinero({
                  amount: order.chow_details.retail_price * order.quantity || 0,
               }).toFormat("$0,0.00")}
            </Text>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignSelf: "center",
      borderRadius: 4,
      width: "80%",
      backgroundColor: "#434949",
   },
   detailsContainer: {
      display: "flex",
      flexDirection: "column",
      marginLeft: 8,
      paddingBottom: 4,
   },
   clientNameHeader: {
      fontSize: 26,
      color: "white",
      paddingBottom: 4,
   },
   orderDetails: {
      color: "white",
   },
   priceContainer: {
      display: "flex",
      alignSelf: "center",
      marginRight: 8,
   },
   price: {
      color: "#55E8D9",
      fontSize: 20,
   },
});

export default OrderCard;
