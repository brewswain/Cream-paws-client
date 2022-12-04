import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, Touchable, View } from "react-native";

interface CustomerCardProps {
   customer: Customer;
}
const CustomerCard = ({ customer }: CustomerCardProps) => {
   const [isExpanded, setIsExpanded] = useState<boolean>(false);
   const [customerId, setCustomerId] = useState<string>();

   const { name, id, pets, orders } = customer;
   const { container, heading, subHeading } = styles;

   const renderPets = () => (
      <View>
         {pets!.length > 1 ? <Text>Pets</Text> : <Text>Pet</Text>}
         {pets?.map((pet) => (
            <View>
               <Text key={pet.name}>Name: {pet.name}</Text>
               <Text key={pet.breed}>Breed: {pet.breed}</Text>
            </View>
         ))}
      </View>
   );

   const renderOrders = () => (
      <View>
         {orders!.length > 1 ? <Text>Orders</Text> : <Text>Order</Text>}

         {orders?.map((order) => (
            <View>
               <Text key={order.customer_id}>Order</Text>
            </View>
         ))}
      </View>
   );

   const handleClick = (id: string) => {
      setIsExpanded(!isExpanded);
   };

   return (
      <Pressable onPress={() => handleClick(customer.id)}>
         <View style={container}>
            <Text style={heading}>{name}</Text>
            <View>
               {isExpanded && pets && pets?.length > 0 && renderPets()}
               {isExpanded && orders && orders?.length > 0 && renderOrders()}
            </View>
         </View>
      </Pressable>
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
