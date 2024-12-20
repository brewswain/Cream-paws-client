import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";
import Collapsible from "react-native-collapsible";
import { CheckBox } from "@rneui/themed";

import DetailsText from "./DetailsText";
import CollapsibleChowDetails from "./Dropdowns/CollapsibleChowDetails";
import { OrderFromSupabase, OrderWithChowDetails } from "../models/order";
import { SelectedOrder } from "../screens/CustomerDetailsScreen";
import { CustomerDetailsContext } from "../context/CustomerDetailsContext";
import { useOrderStore } from "../store/orderStore";

interface FilteredOrderDetailsProps {
  color?: string;
  paddingLeft?: number;
  isCompleted?: boolean;
}

const FilteredOrderDetails = ({
  isCompleted,
  color,
  paddingLeft,
}: FilteredOrderDetailsProps) => {
  const customerDetails = useContext(CustomerDetailsContext);
  const {
    orders: contextOrders,
    selectedOrders,
    setSelectedOrders,
  } = customerDetails;

  const { orderContainer, divider } = styles;
  const {
    isFetching,
    completedOrders,
    outstandingOrders,
    selectedOrderIds,
    setSelectedOrderIds,
  } = useOrderStore();
  const orders = isCompleted ? completedOrders : outstandingOrders;

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
      {orders.length ? (
        orders?.map((order: OrderFromSupabase, orderIndex: number) => {
          const formattedDeliveryDate = formatDate(order.delivery_date);
          const totalCost = order.delivery_cost
            ? order.retail_price * order.quantity + order.delivery_cost
            : order.retail_price * order.quantity;

          return (
            <View
              key={`${orderIndex} Chow ID:${order.id}`}
              style={orderContainer}
            >
              {!isCompleted ? (
                <View>
                  <CheckBox
                    title="Check to pay"
                    containerStyle={{
                      backgroundColor: "transparent",
                      paddingLeft: 0,
                      marginLeft: 0,
                    }}
                    checked={selectedOrderIds.includes(order.id)}
                    onPress={() => setSelectedOrderIds(order.id)}
                  />
                </View>
              ) : null}
              {/* Payment Made Block */}
              <DetailsText
                color={color}
                paddingLeft={paddingLeft}
                header="Summary"
                details={`${order.flavours.brand_details.name}-${
                  order.variety.size
                } ${order.variety.unit} (${Dinero({
                  amount: Math.round(order.retail_price * 100),
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

              <DetailsText
                color={color}
                paddingLeft={paddingLeft}
                header="Delivery Date"
                details={new Date(order.delivery_date).toDateString()}
              />

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

              {order.delivery_cost ? (
                <DetailsText
                  color={color}
                  paddingLeft={paddingLeft}
                  header="Total"
                  details={Dinero({
                    amount: Math.round(totalCost * 100),
                  }).toFormat("$0,0.00")}
                />
              ) : null}

              {/* {order.payment_made ? (
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
            )} */}
              {order.is_delivery ? (
                <DetailsText
                  color={color}
                  paddingLeft={paddingLeft}
                  header="Delivery Date"
                  details={formattedDeliveryDate}
                />
              ) : null}

              {/* Quantity Block */}
              {/* <DetailsText
              color={color}
              paddingLeft={paddingLeft}
              header="Quantity"
              details={order.quantity}
            /> */}
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
                order={order}
                index={orderIndex}
                color="black"
                paddingLeft={0}
              />
            </View>
          );
        })
      ) : (
        <Text style={{ paddingLeft: 14, fontSize: 18, paddingTop: 12 }}>
          {isFetching ? "Loading..." : "No Orders found."}
        </Text>
      )}
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
