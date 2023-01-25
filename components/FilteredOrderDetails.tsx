import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import Collapsible from "react-native-collapsible";

import DetailsText from "./DetailsText";

interface FilteredOrderDetailsProps {
   orders: {
      id: string;
      version: number;
      delivery_date: string;
      payment_made: boolean;
      payment_date: string;
      is_delivery: boolean;
      quantity: number;
      driver_paid: boolean;
      warehouse_paid: boolean;
      customer_id: string;
      chow_details: {
         brand: string;
         target_group: string;
         flavour: string;
         size: number;
         unit: string;
         wholesale_price: number;
         retail_price: number;
         is_paid_for: boolean;
         version: number;
         warehouse_paid: boolean;
         id: string;
      };
      chow_id: string;
   }[];
}

const FilteredOrderDetails = ({ orders }: FilteredOrderDetailsProps) => {
   const { orderContainer } = styles;

   const renderChowDetails = (index: number, order: any) => {
      const { brand, target_group, flavour, size, unit, retail_price } =
         order.chow_details;
      return (
         <View>
            <DetailsText header={"Brand"} details={brand} />
            <DetailsText header={"Target Group"} details={target_group} />
            <DetailsText header={"Flavour"} details={flavour} />
            <DetailsText header={"Size"} details={`${size} ${unit}`} />
            <DetailsText header={"Cost"} details={retail_price} />
         </View>
      );
   };
   return (
      <View>
         {orders?.map((order: any, index: number) => {
            const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

            return (
               <View
                  key={`${index} Chow ID:${order.id}`}
                  style={orderContainer}
               >
                  {/* Payment Made Block */}

                  <DetailsText
                     header="Summary"
                     details={`${order.chow_details.brand}-${order.chow_details.size} ${order.chow_details.unit} x ${order.quantity}`}
                  />

                  {order.payment_made ? null : (
                     <DetailsText
                        header="Outstanding Cost"
                        details={
                           order.chow_details.retail_price * order.quantity
                        }
                     />
                  )}

                  <DetailsText
                     header="Customer Paid for Chow"
                     details={order.payment_made ? "Yes" : "No"}
                  />

                  {order.payment_made ? (
                     <DetailsText
                        header="Payment Date"
                        details={order.payment_date}
                     />
                  ) : (
                     <DetailsText
                        header="Outstanding Payment"
                        details={
                           order.chow_details.retail_price * order.quantity
                        }
                     />
                  )}

                  {/* Is Delivery Block */}
                  <DetailsText
                     header="Delivery"
                     details={order.is_delivery ? "Yes" : "No"}
                  />

                  {order.is_delivery ? (
                     <DetailsText
                        header="Delivery Date"
                        details={order.delivery_date}
                     />
                  ) : null}

                  {/* Quantity Block */}
                  <DetailsText header="Quantity" details={order.quantity} />

                  {/* Driver/Warehouse Block */}
                  <DetailsText
                     header="Warehouse Paid"
                     details={order.warehouse_paid ? "Yes" : "No"}
                  />

                  <DetailsText
                     header="Driver Paid"
                     details={order.driver_paid ? "Yes" : "No"}
                  />

                  <Text
                     key={`${index} Collapsible`}
                     onPress={() => {
                        setIsCollapsed(!isCollapsed);
                     }}
                     style={{ paddingLeft: 20 }}
                  >
                     {isCollapsed
                        ? "View Chow Details:"
                        : "Close Chow Details:"}
                  </Text>
                  <Collapsible collapsed={isCollapsed}>
                     {renderChowDetails(index, order)}
                  </Collapsible>
               </View>
            );
         })}
      </View>
   );
};

const styles = StyleSheet.create({
   orderContainer: {
      borderBottomColor: "grey",
      borderBottomWidth: 1,
      paddingTop: 8,
      paddingBottom: 8,
      alignSelf: "stretch",
   },
});

export default FilteredOrderDetails;
