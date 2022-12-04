import { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/AntDesign";

import { getAllChow } from "../api/routes/stock";
import CreateChowModal from "../components/modals/CreateChowModal";

const StockScreen = () => {
   const [showModal, setShowModal] = useState<boolean>(false);

   const [chow, setChow] = useState<Chow[]>([]);
   const [customerChow, setCustomerChow] = useState<Chow[]>([]);
   const [warehouseChow, setWarehouseChow] = useState<Chow[]>([]);

   const openModal = () => {
      setShowModal(true);
   };

   const populateChowList = async () => {
      const response: Chow[] = await getAllChow();

      const customerReservedChow = response.filter(
         (item) => item.is_paid_for === true
      );
      const unpaidForChow = response.filter(
         (item) => item.is_paid_for === false
      );

      setCustomerChow(customerReservedChow);
      setWarehouseChow(unpaidForChow);
      setChow(response);
   };

   useEffect(() => {
      populateChowList();
   }, []);

   return (
      <View style={styles.container}>
         <View>
            {chow &&
               chow.map((item) => (
                  <Text key={item.id}>{item.retail_price}</Text>
               ))}
         </View>
         <View>
            <Text>Stock in Warehouse</Text>
         </View>
         {/* Simply reduce their price and show total after showing truncated list */}
         <Text>{customerChow}</Text>
         <View>
            <Text>Stock called for by Customer</Text>
         </View>
         {/* Simply reduce their price and show total after showing truncated list */}
         <Text> {warehouseChow}</Text>
         <Pressable style={styles.buttonContainer} onPress={openModal}>
            <Icon name="plus" size={20} />
         </Pressable>
         <CreateChowModal
            isOpen={showModal}
            setShowModal={setShowModal}
            populateChowList={populateChowList}
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

export default StockScreen;
