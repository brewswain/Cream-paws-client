import { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import {
   createChow,
   deleteChow,
   getAllChow,
   updateChow,
} from "../api/routes/stock";

const StockScreen = () => {
   const [chow, setChow] = useState([]);
   const [chowId, setChowid] = useState("");

   const chowPayload: Chow = {
      brand: "Taste of The Wild",
      target_group: "Puppy",
      flavour: "Puppy",
      size: 20,
      unit: "kg",
      quantity: 5,
      wholesale_price: 20,
      retail_price: 30,
      is_paid_for: false,
   };
   const updatedChowPayload: Chow = {
      brand: "Taste of The Wild",
      target_group: "Puppy",
      flavour: "Puppy",
      size: 30,
      unit: "lb",
      quantity: 5,
      wholesale_price: 100,
      retail_price: 200,
      is_paid_for: false,
   };

   const createChowTest = async () => {
      const response = await createChow(chowPayload);
      return response;
   };

   const deleteChowTest = async () => {
      const response = await deleteChow(chowId);

      return response;
   };

   const updateChowTest = async () => {
      const response = await updateChow(chowId, updatedChowPayload);
      return response;
   };

   const getAllChowTest = async () => {
      const response = await getAllChow();
      console.log(response);
      response ? setChow(response) : alert("Sorry, no Chow exists");
   };

   useEffect(() => {
      console.log(chowId);
   }, [chowId]);

   return (
      <View>
         <Button
            title="Create Chow"
            onPress={() => {
               createChowTest();
            }}
         />
         <Button
            title="Delete Chow"
            onPress={() => {
               deleteChowTest();
            }}
         />
         <Button
            title="Update Chow"
            onPress={() => {
               updateChowTest();
            }}
         />

         <Button
            title="Get All Chow"
            onPress={() => {
               getAllChowTest();
            }}
         />

         <Text>List of Chow Ids: </Text>
         <View>
            {chow &&
               chow.map((item) => (
                  <Text
                     key={item.id}
                     onPress={() => {
                        setChowid(item.id);
                     }}
                  >
                     {item.id}
                  </Text>
               ))}
         </View>

         <Text>List of Chow:</Text>
         <View>
            {chow &&
               chow.map((item) => (
                  <Text key={item.id}>{item.retail_price}</Text>
               ))}
         </View>
      </View>
   );
};

export default StockScreen;
