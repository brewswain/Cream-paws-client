import { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/AntDesign";

import { getAllChow } from "../api/routes/stock";
import CreateChowModal from "../components/modals/CreateChowModal";

const StockScreen = () => {
   const [showModal, setShowModal] = useState<boolean>(false);

   const [chow, setChow] = useState<Chow[]>([]);

   const openModal = () => {
      setShowModal(true);
   };

   const populateChowList = async () => {
      const response = await getAllChow();
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
