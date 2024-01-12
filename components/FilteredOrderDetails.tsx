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
  color?: string;
  paddingLeft?: number;
}

const FilteredOrderDetails = ({
  orders,
  selectedOrders,
  setSelectedOrders,
  color,
  paddingLeft,
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

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toDateString();

    return formattedDate;
  };

  return (
    <View>
      {orders?.map((order: OrderWithChowDetails, orderIndex: number) => {
        const formattedDeliveryDate = formatDate(order.delivery_date);
        return (
          <View
            key={`${orderIndex} Chow ID:${order.id}`}
            style={orderContainer}
          >
            <View>
              <CheckBox
                title="Check to pay"
                containerStyle={{
                  backgroundColor: "transparent",
                  paddingLeft: 0,
                  marginLeft: 0,
                }}
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
              color={color}
              paddingLeft={paddingLeft}
              header="Summary"
              details={`${order.chow_details.brand}-${
                order.chow_details.flavours.varieties.size
              } ${order.chow_details.flavours.varieties.unit} (${Dinero({
                amount: Math.round(
                  order.chow_details.flavours.varieties.retail_price * 100
                ),
              }).toFormat("$0,0.00")})  x ${order.quantity}`}
            />
            {/* <DetailsText color={color}
            paddingLeft={paddingLeft}
                     header="Customer Paid for Chow"
                     details={order.payment_made ? "Yes" : "No"}
                  /> */}

            {/* Is Delivery Block */}
            {/* <DetailsText
              color={color}
              paddingLeft={paddingLeft}
              header="Delivery"
              details={order.is_delivery ? "Yes" : "No"}
            /> */}
            {order.delivery_cost ? (
              <DetailsText
                color={color}
                paddingLeft={paddingLeft}
                header="Delivery Cost"
                details={Dinero({
                  amount: Math.round(order.delivery_cost * 100),
                }).toFormat("$0,0.00")}
              />
            ) : null}

            {order.payment_made ? (
              <DetailsText
                color={color}
                paddingLeft={paddingLeft}
                header="Payment Date"
                details={order.payment_date}
              />
            ) : (
              <DetailsText
                color={color}
                paddingLeft={paddingLeft}
                header="Outstanding Cost"
                details={Dinero({
                  amount: Math.round(
                    order.chow_details.flavours.varieties.retail_price *
                      order.quantity *
                      100 +
                      (order.delivery_cost ? order.delivery_cost * 100 : 0)
                  ),
                }).toFormat("$0,0.00")}
              />
            )}
            {order.is_delivery ? (
              <DetailsText
                color={color}
                paddingLeft={paddingLeft}
                header="Delivery Date"
                details={formattedDeliveryDate}
              />
            ) : null}
            {/* Quantity Block */}
            <DetailsText
              color={color}
              paddingLeft={paddingLeft}
              header="Quantity"
              details={order.quantity}
            />
            {/* Driver/Warehouse Block */}
            <DetailsText
              color={color}
              paddingLeft={paddingLeft}
              header="Warehouse Paid"
              details={order.warehouse_paid ? "Yes" : "No"}
            />
            <DetailsText
              color={color}
              paddingLeft={paddingLeft}
              header="Driver Paid"
              details={order.driver_paid ? "Yes" : "No"}
            />
            <CollapsibleChowDetails
              chowDetails={order.chow_details}
              index={orderIndex}
              color="black"
              paddingLeft={0}
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
