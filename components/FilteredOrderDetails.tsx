import { StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";
import { CheckBox } from "@rneui/themed";

import DetailsText from "./DetailsText";
import { OrderFromSupabase, formatOrderSummaryLine } from "../models/order";
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
  const { orderContainer, divider } = styles;
  const {
    isFetching,
    completedOrders,
    outstandingOrders,
    selectedOrderIds,
    setSelectedOrderIds,
  } = useOrderStore();
  const orders = isCompleted ? completedOrders : outstandingOrders;

  const formatDate = (date: string) => new Date(date).toDateString();

  return (
    <View>
      {orders.length ? (
        orders?.map((order: OrderFromSupabase, orderIndex: number) => {
          const formattedDeliveryDate = formatDate(order.delivery_date);
          const retail = order.retail_price ?? 0;
          const totalCost =
            order.delivery_cost != null
              ? retail * order.quantity + order.delivery_cost
              : retail * order.quantity;

          return (
            <View key={`${orderIndex}-${order.id}`} style={orderContainer}>
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
              <DetailsText
                color={color}
                paddingLeft={paddingLeft}
                header="Summary"
                details={formatOrderSummaryLine(order)}
              />

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

              {order.delivery_cost != null ? (
                <DetailsText
                  color={color}
                  paddingLeft={paddingLeft}
                  header="Total"
                  details={Dinero({
                    amount: Math.round(totalCost * 100),
                  }).toFormat("$0,0.00")}
                />
              ) : null}

              {order.is_delivery ? (
                <DetailsText
                  color={color}
                  paddingLeft={paddingLeft}
                  header="Delivery Date"
                  details={formattedDeliveryDate}
                />
              ) : null}

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
