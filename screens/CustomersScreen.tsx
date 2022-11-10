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
   const [showModal, setShowModal] = useState<boolean>(false);

   const populateCustomersList = async () => {
      const response = await getAllCustomers();

      setCustomers(response);
   };

   const openModal = () => {
      setShowModal(true);
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

         <Pressable style={styles.buttonContainer} onPress={openModal}>
            <Icon name="plus" size={20} />
         </Pressable>
         <CreateCustomerModal
            isOpen={showModal}
            setShowModal={setShowModal}
            populateCustomerList={populateCustomersList}
         />
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
