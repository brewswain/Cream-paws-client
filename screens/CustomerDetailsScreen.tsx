import {
   View,
   StyleSheet,
   Text,
   ScrollView,
   useWindowDimensions,
} from "react-native";
import { RootTabScreenProps } from "../types";

interface CustomerDetailProps {
   navigation: RootTabScreenProps<"CustomerDetails">;
   route: any;
}

const CustomerDetailsScreen = ({ navigation, route }: CustomerDetailProps) => {
   console.log({ navigation, route });
   const { pets, orders, name, id } = route.params;
   const { container, heading, subHeading } = styles;

   const { height, width } = useWindowDimensions();

   const petsExist = pets && pets.length > 0;
   const ordersExist = orders && orders.length > 0;

   const renderPets = () => (
      <View>
         {pets!.length > 1 ? <Text>Pets</Text> : <Text>Pet</Text>}
         {pets?.map((pet: { name: string; breed: string }, index: number) => (
            <View>
               <Text key={`Name: ${pet.name}`}>Name: {pet.name}</Text>
               <Text key={`Breed: ${index} ${pet.breed}`}>
                  Breed: {pet.breed}
               </Text>
            </View>
         ))}
      </View>
   );

   const renderOrders = () => (
      <View>
         {orders!.length > 1 ? <Text>Orders</Text> : <Text>Order</Text>}

         {orders?.map((order: any, index: number) => (
            <View key={`${index} Chow ID:${order.chow_details.id}`}>
               <Text
                  key={`${index} Customer ID:${order.chow_details.warehouse_paid}`}
               >
                  Warehouse Paid
               </Text>
            </View>
         ))}
      </View>
   );

   return (
      <ScrollView style={[container, { minHeight: height, width: width }]}>
         <Text>{name}</Text>
         <Text>{id}</Text>
         {petsExist && renderPets()}
         {ordersExist && renderOrders()}
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {},
   // container: {
   //    backgroundColor: "white",
   //    position: "absolute",
   //    top: 0,
   //    left: 0,
   //    bottom: 0,
   // },

   heading: {
      fontSize: 14,
      fontWeight: "400",
   },
   subHeading: {
      fontSize: 14,
   },
});

export default CustomerDetailsScreen;
