import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import {
   createCustomer,
   deleteCustomer,
   getAllCustomers,
   updateCustomer,
} from "../api/routes/customers";

const CustomersScreen = () => {
   const [customers, setCustomers] = useState<Customer[]>();
   const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

   const getCustomersTest = async () => {
      const response = await getAllCustomers();
      setCustomers(response);
   };

   return (
      <View>
         <Text>Welcome to the list of clients</Text>
         <Text>Currently Selected Customer's ID: {selectedCustomerId}</Text>
         <Button
            title="Create Customer"
            onPress={() => createCustomer("test 3")}
         />
         <Button title="Get Customers" onPress={() => getCustomersTest()} />
         {/* TODO: For now i'm testing just updating the customer name to ensure the route is working, will update with proper details later */}

         <Button
            title="Update Customer"
            onPress={() => updateCustomer(selectedCustomerId, "updated name")}
         />
         <Button
            title="Delete Customer"
            onPress={() => deleteCustomer(selectedCustomerId)}
         />

         <View>
            <Text>List of Customers:</Text>
            <View>
               {customers &&
                  customers.map((customer) => (
                     <Text
                        key={customer.id}
                        onPress={() => {
                           setSelectedCustomerId(customer.id);
                        }}
                     >
                        {customer.name}
                     </Text>
                  ))}
            </View>
         </View>
      </View>
   );
};

export default CustomersScreen;
