import { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import Dinero from "dinero.js";
import { Divider } from "native-base";
import { TodaysOrder } from "../../models/order";
import { Customer } from "../../models/customer";
import moment from "moment";

import CustomCollapsible from "./atom/CustomCollapsible";

import { useTodaysOrdersStore } from "../../store/todaysOrdersStore";

const TodayAtaGlanceCard = () => {
  const {
    fetchTodaysOrders,
    completedOrders,
    outstandingOrders,
    todaysOrders,
    ordersCollapsed,
    toggleOrdersCollapsed,
    customersCollapsed,
    toggleCustomersCollapsed,
  } = useTodaysOrdersStore();

  const {
    container,
    highlight,
    header,
    subHeader,
    deemphasis,
    totalCostContainer,
  } = styles;

  const navigation = useNavigation();

  const handleClick = (customer: Customer) => {
    navigation.navigate("CustomerDetails", { customer });
  };

  const populateData = async () => {
    fetchTodaysOrders();
  };

  const totalOutstandingStock = () => {
    return Object.values(todaysOrders).reduce(
      (accumulator, customerOrders) =>
        accumulator +
        customerOrders.reduce((acc, order) => acc + order.quantity, 0),
      0
    );
  };

  // Remove fdrom here once we confirm it works

  const totalStock = totalOutstandingStock();
  const todaysOrderArray = Object.values(todaysOrders).flat(); //can also spread like this: [...Object.values(todaysOrders)]

  // Used any[] cause lazy and reduce is weird and gives us type never, probably due to reduce's accumulator and callback params by default.
  const combinedOrderQuantityArray: TodaysOrder[] = todaysOrderArray.reduce(
    (acc: any[], current) => {
      const existingOrder = acc.find(
        (order) => order.variety.id === current.variety.id
      );

      if (existingOrder) {
        existingOrder.quantity += current.quantity;
        return acc;
      } else {
        acc.push({ ...current });
        return acc;
      }
    },
    []
  );

  const mappedCostArray =
    combinedOrderQuantityArray.map(
      (order) => order.retail_price * order.quantity + order.delivery_cost
    ) || undefined;

  const subTotal = Math.round(
    mappedCostArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * 100
  );

  const customerOutstandingOrders = (customer: Customer) => {
    const totalOrders = customer.orders?.filter(
      (order) => order.payment_made === false
    );
    return totalOrders?.length;
  };
  const customerCompletedOrdersLength = (customer: Customer) => {
    const totalOrders = customer.orders?.filter((order) => {
      const parsedPaymentDate = moment(order.delivery_date).format(
        "YYYY-MM-DD"
      );
      const today = moment().format("YYYY-MM-DD");

      return order.payment_made === true && parsedPaymentDate === today;
    });
    return totalOrders?.length;
  };

  useFocusEffect(
    useCallback(() => {
      let isFetching = true;

      const getPageData = async () => {
        try {
          if (isFetching) {
            await populateData();
            isFetching = false;
          }
        } catch (error) {
          console.error(error);
        }
      };

      getPageData();

      return () => {
        isFetching = false;
      };
    }, [])
  );

  return (
    <View style={container}>
      <ScrollView style={{ flex: 1 }}>
        <View>
          <Text style={header}>Today at a Glance</Text>
          <View>
            {outstandingOrders && outstandingOrders.length > 0 ? (
              <TouchableOpacity onPress={() => toggleOrdersCollapsed()}>
                <Text style={highlight}>
                  {outstandingOrders.length}{" "}
                  <Text style={subHeader}>
                    {outstandingOrders.length > 1 ? "orders" : "order"}
                  </Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={subHeader}>No orders left!</Text>
            )}

            <CustomCollapsible isCollapsed={ordersCollapsed}>
              {todaysOrders
                ? Object.values(todaysOrders).map((customerOrders, index) => {
                    const customerData = customerOrders[0].customers;
                    const mappedRetailPriceTotal = customerOrders.map(
                      (order) => order.retail_price * order.quantity
                    );
                    const mappedDeliveryCost = customerOrders.map(
                      (order) => order.delivery_cost
                    );

                    const mappedSubtotal = Math.round(
                      mappedRetailPriceTotal.reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      ) * 100
                    );
                    return (
                      <TouchableOpacity
                        onPress={() => handleClick(customerData)}
                        key={index}
                      >
                        <Text
                          style={deemphasis}
                        >{`${customerData.name} x ${customerOrders.length}`}</Text>
                        <Text>{`Retail Price: ${Dinero({
                          amount: mappedSubtotal || 0,
                          precision: 2,
                        }).toFormat("$0,0.00")}, Delivery: $${Math.max(
                          ...mappedDeliveryCost
                        )}.00`}</Text>
                      </TouchableOpacity>
                    );
                  })
                : null}
            </CustomCollapsible>
          </View>

          <View>
            {totalStock && totalStock > 0 ? (
              <TouchableOpacity onPress={() => toggleCustomersCollapsed()}>
                <Text style={highlight}>
                  {totalStock}{" "}
                  <Text style={subHeader}>{`${
                    totalStock > 1 ? "bags" : "bag"
                  } of Chow`}</Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={subHeader}>No chow to be delivered</Text>
            )}
            <CustomCollapsible isCollapsed={customersCollapsed}>
              {combinedOrderQuantityArray.map((chow, index) => (
                <View key={index}>
                  {chow && (
                    <View key={`${chow.variety.id} - ${index}`}>
                      <Text style={deemphasis}>
                        {`${chow.flavours.brand_details.name} ${chow.flavours.details.flavour_name} - ${chow.variety.size}${chow.variety.unit} x ${chow.quantity}`}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </CustomCollapsible>
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingBottom: 10, alignItems: "center" }}>
        <Divider style={{ marginTop: 10, marginBottom: 20 }} />
        <View style={totalCostContainer}>
          <Text style={subHeader}>Total Cost:</Text>
          <Text style={subHeader}>
            {subTotal
              ? Dinero({
                  amount: subTotal || 0,
                  precision: 2,
                }).toFormat("$0,0.00")
              : null}
          </Text>
        </View>
        <Text
          style={[deemphasis, { alignSelf: "flex-start", paddingLeft: 20 }]}
        >
          Vat + Delivery Fee inclusive
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#434949",
    width: "90%",
    height: "90%",
    marginTop: 24,
    padding: 12,
  },
  highlight: {
    color: "#B438FF",
    fontSize: 30,
  },
  completedHighlight: {
    color: "#588ca8",
    fontSize: 30,
  },
  header: {
    color: "white",
    fontSize: 24,
  },
  subHeader: {
    color: "white",
    fontSize: 20,
  },
  deemphasis: {
    color: "#BCBCBC",
    fontSize: 16,
    paddingLeft: 26,
  },
  totalCostContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
});

export default TodayAtaGlanceCard;
