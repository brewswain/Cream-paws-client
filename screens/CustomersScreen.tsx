import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import {
   createCustomer,
   deleteCustomer,
   getAllCustomers,
   updateCustomer,
} from "../api/routes/customers";
import CustomerCard from "../components/cards/CustomerCard";

const CustomersScreen = () => {
   const [customers, setCustomers] = useState<Customer[]>();
   const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

   const populateCustomersList = async () => {
      const response = await getAllCustomers();
      setCustomers(response);
   };

   const handlePress = () => {
      //TODO: create Customer flow
      // Open customer Modal

      // After creation, call API to get new customer data
      // Actually, we want to run this inside of our customer Modal itself after awaiting customer
      populateCustomersList();
   };

   useEffect(() => {
      populateCustomersList();
   }, []);

   return (
      <View>
         {customers &&
            customers.map((customer) => (
               <CustomerCard customer={customer} key={customer.id} />
            ))}

         <Pressable style={styles.buttonContainer} onPress={handlePress}>
            <Icon name="plus" size={20} />
         </Pressable>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   button: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 50,
      backgroundColor: "#8099c1",
   },
   buttonContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      height: 50,
      width: 50,
      bottom: 20,
      right: 10,
      zIndex: 100,
   },
});

export default CustomersScreen;
