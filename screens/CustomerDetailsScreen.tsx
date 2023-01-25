import { useState } from "react";
import {
   View,
   StyleSheet,
   Text,
   ScrollView,
   useWindowDimensions,
} from "react-native";

import Collapsible from "react-native-collapsible";

import { RootTabScreenProps } from "../types";

import { testCustomerDetails } from "../data/test_data";
import { DetailsText, FilteredOrderDetails } from "../components";

interface CustomerDetailProps {
   navigation: RootTabScreenProps<"CustomerDetails">;
   route: any;
}

const CustomerDetailsScreen = ({ navigation, route }: CustomerDetailProps) => {
   // False by default to ensure Outstanding orders are displayed
   const [outstandingCollapsible, setOutstandingCollapsible] =
      useState<boolean>(false);
   const [completedCollapsible, setCompletedCollapsible] =
      useState<boolean>(true);

   // const { pets, orders, name, id } = route.params;
   const { pets, orders, name, id } = testCustomerDetails;
   const {
      container,
      header,
      subHeader,
      collapsibleHeader,
      deEmphasis,
      bold,
      regular,
      totalCost,
   } = styles;

   const { height, width } = useWindowDimensions();

   const TEST_PETS_EXIST =
      testCustomerDetails.pets && testCustomerDetails.pets.length > 0;
   const TEST_ORDERS_EXIST =
      testCustomerDetails.orders && testCustomerDetails.orders.length > 0;
   // const petsExist = pets && pets.length > 0;
   // const ordersExist = orders && orders.length > 0;

   const mappedCostArray = orders
      .filter((order) => order.payment_made === false)
      .map((order) => order.chow_details.retail_price * order.quantity);

   //TODO: remove test payload

   const renderPets = () => (
      <View>
         <Text style={[subHeader]}>{pets!.length > 1 ? "Pets" : "Pet"}</Text>

         {pets?.map((pet: { name: string; breed: string }, index: number) => (
            <View key={`${index} Pet Container`}>
               <DetailsText header={"Name"} details={pet.name} />
               <DetailsText header={"Breed"} details={pet.breed} />
            </View>
         ))}
      </View>
   );

   const renderOrders = () => {
      // Using explicit boolean verification here for DX purposes
      const outstandingOrders = orders.filter(
         (order) => order.payment_made === false
      );
      const completedOrders = orders.filter(
         (order) => order.payment_made === true
      );
      return (
         <View>
            <Text style={subHeader}>
               {orders!.length > 1 ? "Orders" : "Order"}
            </Text>

            <View>
               <Text
                  style={collapsibleHeader}
                  onPress={() =>
                     setOutstandingCollapsible(!outstandingCollapsible)
                  }
               >
                  Outstanding Orders
               </Text>
               <Collapsible collapsed={outstandingCollapsible}>
                  <FilteredOrderDetails orders={outstandingOrders} />
               </Collapsible>
            </View>
            <View>
               <Text
                  style={collapsibleHeader}
                  onPress={() => setCompletedCollapsible(!completedCollapsible)}
               >
                  Completed Orders
               </Text>
               <Collapsible collapsed={completedCollapsible}>
                  <FilteredOrderDetails orders={completedOrders} />
               </Collapsible>
            </View>
         </View>
      );
   };

   return (
      <ScrollView style={[container, { height: height, width: width }]}>
         <Text style={header}>{name}</Text>
         <Text style={totalCost}>
            Total Outstanding Cost:{" "}
            {mappedCostArray.reduce(
               (accumulator, currentValue) => accumulator + currentValue,
               0
            )}
         </Text>
         <View>
            {TEST_PETS_EXIST && renderPets()}
            {TEST_ORDERS_EXIST && renderOrders()}
         </View>
         <Text style={deEmphasis}>Customer ID: {id}</Text>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {},
   header: {
      fontSize: 24,
      fontWeight: "600",
      textAlign: "center",
      margin: 8,
   },
   collapsibleHeader: {
      paddingLeft: 20,
   },
   subHeader: {
      fontSize: 20,
      color: "hsl(186,63%,30%)",
      fontWeight: "600",
      marginTop: 4,
      marginBottom: 4,
      paddingLeft: 20,
   },
   totalCost: {
      fontSize: 16,
      color: "red",
      marginBottom: 4,
   },
   deEmphasis: {
      color: "hsla(222,31%,66%, 0.7)",
      marginTop: 12,
      marginBottom: 12,
   },
   bold: {
      fontWeight: "600",
   },
   regular: {
      fontWeight: "400",
   },
});

export default CustomerDetailsScreen;
