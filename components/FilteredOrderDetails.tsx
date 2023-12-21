import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";
import Collapsible from "react-native-collapsible";
import { CheckBox } from "@rneui/themed";

import DetailsText from "./DetailsText";
import CollapsibleChowDetails from "./Dropdowns/CollapsibleChowDetails";
import { OrderWithChowDetails } from "../models/order";
import { SelectedOrder } from "../screens/CustomerDetailsScreen";

interface FilteredOrderDetailsProps {
  orders: OrderWithChowDetails[];
  selectedOrders: SelectedOrder[];
  setSelectedOrders: React.Dispatch<React.SetStateAction<SelectedOrder[]>>;
}

const FilteredOrderDetails = ({
  orders,
  selectedOrders,
  setSelectedOrders,
}: FilteredOrderDetailsProps) => {
  const { orderContainer, divider } = styles;
  interface SelectedOrder {
    index: number;
    selected: boolean;
  }

  useEffect(() => {
    orders.map((_, index) => {
      if (!selectedOrders[index]) {
        setSelectedOrders([...selectedOrders, { index, selected: false }]);
      }
    });
  }, []);

  const handleCheckBoxChange = (orderIndex: number) => {
    const data = [...selectedOrders];
    data[orderIndex].selected = !data[orderIndex].selected;
    setSelectedOrders(data);
  };

  return (
    <View>
      {orders?.map((order: OrderWithChowDetails, orderIndex: number) => {
        return (
          <View
            key={`${orderIndex} Chow ID:${order.id}`}
            style={orderContainer}
          >
            <View>
              <CheckBox
                title=""
                checked={
                  selectedOrders[orderIndex]
                    ? selectedOrders[orderIndex].selected
                    : false
                }
                onPress={() => handleCheckBoxChange(orderIndex)}
              />
            </View>
            {/* Payment Made Block */}
            <DetailsText
              header="Summary"
              details={`${order.chow_details.brand}-${order.chow_details.flavours.varieties.size} ${order.chow_details.flavours.varieties.unit} x ${order.quantity}`}
            />
            {/* <DetailsText
                     header="Customer Paid for Chow"
                     details={order.payment_made ? "Yes" : "No"}
                  /> */}
            {order.payment_made ? (
              <DetailsText header="Payment Date" details={order.payment_date} />
            ) : (
              <DetailsText
                header="Outstanding Cost"
                details={Dinero({
                  amount: Math.round(
                    order.chow_details.flavours.varieties.retail_price *
                      order.quantity *
                      100
                  ),
                }).toFormat("$0,0.00")}
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
              index={orderIndex}
            />
          </View>
        );
      })}
      <View style={divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  orderContainer: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingLeft: 20,
    alignSelf: "stretch",
    borderBottomColor: "hsl(186, 52%, 61%)",
    borderBottomWidth: 1,

    position: "relative",
  },
  divider: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginBottom: 12,
  },
});

export default FilteredOrderDetails;
