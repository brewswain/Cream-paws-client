import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import Collapsible from "react-native-collapsible";

import DetailsText from "./DetailsText";
import CollapsibleChowDetails from "./Dropdowns/CollapsibleChowDetails";

interface FilteredOrderDetailsProps {
   orders: OrderWithChowDetails[];
}

const FilteredOrderDetails = ({ orders }: FilteredOrderDetailsProps) => {
   const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
   const { orderContainer } = styles;

   return (
      <View>
         {orders?.map((order: any, index: number) => {
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
                  {/* <DetailsText
                     header="Customer Paid for Chow"
                     details={order.payment_made ? "Yes" : "No"}
                  /> */}
                  {order.payment_made ? (
                     <DetailsText
                        header="Payment Date"
                        details={order.payment_date}
                     />
                  ) : (
                     <DetailsText
                        header="Outstanding Cost"
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
                  <CollapsibleChowDetails
                     chowDetails={order.chow_details}
                     isCollapsed={isCollapsed}
                     setIsCollapsed={setIsCollapsed}
                     index={index}
                  />
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
