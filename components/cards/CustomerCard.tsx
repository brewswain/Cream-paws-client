import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface CustomerCardProps {
   customer: Customer;
}
const CustomerCard = ({ customer }: CustomerCardProps) => {
   const { name } = customer;
   const {
      openOrdersContainer,
      noOrdersContainer,
      clientNameHeader,
      detailsContainer,
      priceContainer,
      price,
   } = styles;

   const navigation = useNavigation();

   // Keeping this as reference for using Animations
   // Using https://reactnative.dev/docs/animated as reference here
   // const expandAnimation = useRef(new Animated.Value(75)).current;
   // const expandClickedView = () => {
   //    Animated.timing(expandAnimation, {
   //       toValue: height,
   //       duration: 300,
   //       easing: Easing.linear,

   //       useNativeDriver: false, // Add This line
   //    }).start();
   // };

   const handleClick = (id: string) => {
      navigation.navigate("CustomerDetails", customer);
   };

   return (
      <Pressable onPress={() => handleClick(customer.id)}>
         {customer.orders && customer.orders.length > 0 && (
            <View style={openOrdersContainer}>
               <View style={detailsContainer}>
                  <Text style={clientNameHeader}>{name}</Text>
               </View>
               <View style={priceContainer}>
                  <Text style={price}>
                     {` Open Orders:${customer.orders?.length}`}
                  </Text>
               </View>
            </View>
         )}

         {customer.orders && customer.orders?.length < 1 && (
            <View style={noOrdersContainer}>
               <View style={detailsContainer}>
                  <Text style={[clientNameHeader, { color: "black" }]}>
                     {name}
                  </Text>
               </View>
            </View>
         )}
      </Pressable>
   );
};

const styles = StyleSheet.create({
   openOrdersContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignSelf: "center",
      borderRadius: 4,
      width: "90%",
      backgroundColor: "#434949",
      marginBottom: 8,
      padding: 8,
   },
   noOrdersContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignSelf: "center",
      borderRadius: 4,
      width: "90%",
      backgroundColor: "#BFBFBF",
      marginBottom: 8,
      padding: 8,
   },
   detailsContainer: {
      display: "flex",
      flexDirection: "column",
      marginLeft: 8,
      paddingBottom: 4,
   },
   clientNameHeader: {
      fontSize: 20,
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
      color: "#14F800",
      fontSize: 14,
   },
});

export default CustomerCard;
