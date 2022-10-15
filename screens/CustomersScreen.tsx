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
import CreateCustomerModal from "../components/modals/CreateCustomerModal";

const CustomersScreen = () => {
   const [customers, setCustomers] = useState<Customer[]>();
   const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
   const [showModal, setShowModal] = useState<boolean>(false);

   const populateCustomersList = async () => {
      const response = await getAllCustomers();
      setCustomers(response);
   };

   const openCreateCustomerModal = () => {};

   const handlePress = () => {
      //TODO: create Customer flow
      // Open customer Modal
      setShowModal(true);
      openCreateCustomerModal();

      // After creation, call API to get new customer data
      // Actually, we want to run this inside of our customer Modal itself after awaiting customer
      populateCustomersList();
   };

   useEffect(() => {
      populateCustomersList();
   }, []);

   return (
      <View style={styles.container}>
         {customers &&
            customers.map((customer) => (
               <CustomerCard customer={customer} key={customer.id} />
            ))}

         <Pressable style={styles.buttonContainer} onPress={handlePress}>
            <Icon name="plus" size={20} />
         </Pressable>
         <CreateCustomerModal isOpen={showModal} setShowModal={setShowModal} />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   buttonContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      height: 40,
      width: 40,
      bottom: 20,
      right: 10,
      borderRadius: 50,
      backgroundColor: "#8099c1",
   },
});

export default CustomersScreen;
