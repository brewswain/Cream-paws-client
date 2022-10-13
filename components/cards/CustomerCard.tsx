import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface CustomerCardProps {
   customer: Customer;
}
const CustomerCard = ({ customer }: CustomerCardProps) => {
   const [isExpanded, setIsExpanded] = useState<boolean>(false);
   const [customerId, setCustomerId] = useState<string>();

   const { name, id, pets, orders } = customer;
   const { container, heading, subHeading } = styles;

   const renderPets = () => {};
   const renderOrders = () => {};

   const expandCard = () => {
      setIsExpanded(true);
   };

   const contractCard = () => {
      setIsExpanded(false);
   };

   const handleClick = (id: string) => {
      setCustomerId(id);
   };

   useEffect(() => {
      console.log({
         customerId,
         isExpanded,
      });
   }, [customerId, isExpanded]);

   console.log({ customer, isExpanded });
   return (
      <View style={container}>
         <Text style={heading} onPress={() => handleClick(customer.id)}>
            {name}
         </Text>
         <Text onPress={expandCard}>View details</Text>
         {isExpanded && (
            <>
               <Text style={subHeading}>{pets}</Text>
               <Text style={subHeading}>{orders}</Text>
            </>
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      padding: 20,
      borderRadius: 4,
      borderColor: "black",
      borderWidth: 1,
      width: 200,
      height: 75,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
   },
   heading: {
      fontSize: 18,
      fontWeight: "600",
   },
   subHeading: {
      fontSize: 14,
   },
});

export default CustomerCard;
