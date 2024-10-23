import { useCallback, useEffect, useReducer, useState } from "react";
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
import { findCustomer } from "../../api";
import { OrderFromSupabase } from "../../models/order";
import { Customer } from "../../models/customer";
import moment from "moment";
import {
  initialState,
  todaysOrdersReducer,
} from "./TodayAtaGlanceCard.reducer";
import CustomCollapsible from "./atom/CustomCollapsible";
import {
  ChowInfo,
  ChowMap,
  CollapsibleTargets,
  CustomersMap,
  OrdersMap,
} from "./TodayAtAGlanceCard.model";
import { getTodaysOrders } from "../../api/routes/orders";
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

  const [outstandingCustomers, setOutstandingCustomers] = useState();

  const {
    container,
    highlight,
    completedHighlight,
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

    const todaysOutstandingCustomers = new Set(
      outstandingOrders.map((order) => order.customers.name)
    );

    const todaysCompletedCustomers = new Set(
      completedOrders.map((order) => order.customers.name)
    );
  };

  // const totalBagsOfChow = todaysOrders.chow.outstandingChow.reduce(
  //   (total, chow) => total + chow.quantity,
  //   0
  // );
  // const completedOrdersTotalBagOfChow = todaysOrders.chow.completedChow.reduce(
  //   (total, chow) => total + chow.quantity,
  //   0
  // );

  const mappedCostArray =
    outstandingOrders.map(
      (order: OrderFromSupabase) =>
        order.retail_price * order.quantity + order.delivery_cost
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
    <>
      <View>
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
                    ? Object.values(todaysOrders).map((customerOrders) => {
                        const customerData = customerOrders[0].customers;
                        return (
                          <TouchableOpacity
                            onPress={() => handleClick(customerData)}
                          >
                            <Text
                              style={styles.deemphasis}
                            >{`${customerData.name} x ${customerOrders.length}`}</Text>
                          </TouchableOpacity>
                        );
                      })
                    : null}
                </CustomCollapsible>
              </View>

              <View>
                {/* {todaysOrders.chow.outstandingChow &&
                todaysOrders.chow.outstandingChow.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => toggleCollapsed("unpaidStock")}
                  >
                    <Text style={highlight}>
                      {totalBagsOfChow} 
                      <Text style={subHeader}>{`${
                        todaysOrders.chow.outstandingChow.length > 1 ||
                        totalBagsOfChow > 1
                          ? "bags"
                          : "bag"
                      } of Chow`}</Text>
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={subHeader}>No chow to be delivered</Text>
                )} */}

                <CustomCollapsible
                  target={"unpaidStock"}
                  todaysOrders={todaysOrders}
                  // style={{ display: "flex", flexDirection: "column" }}
                >
                  {todaysOrders.chow.outstandingChow.map((chow, index) => (
                    <View key={index}>
                      {chow && (
                        <View>
                          <Text style={deemphasis}>
                            {`${chow.details.brand} ${chow.details.flavour} - ${chow.details.size}${chow.details.unit} x ${chow.quantity}`}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </CustomCollapsible>
              </View>
            </View>
          </ScrollView>

          {todaysOrders.orders.completedOrders &&
          todaysOrders.orders.completedOrders.length > 0 ? (
            <View>
              <Text style={subHeader}>Today's completed orders</Text>

              <View>
                {todaysOrders.orders.completedOrders &&
                todaysOrders.orders.completedOrders.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => toggleCollapsed("completedOrders")}
                  >
                    <Text style={completedHighlight}>
                      {todaysOrders.orders.completedOrders.length}{" "}
                      <Text style={subHeader}>
                        {todaysOrders.orders.completedOrders.length > 1
                          ? "orders"
                          : "order"}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={subHeader}>No orders left!</Text>
                )}
                <CustomCollapsible
                  target={"completedOrders"}
                  todaysOrders={todaysOrders}
                >
                  {todaysOrders.customers.completedCustomers &&
                    todaysOrders.customers.completedCustomers.length > 0 &&
                    todaysOrders.customers.completedCustomers.map(
                      (customer, index) => (
                        <TouchableOpacity
                          key={`${customer.id}, index: ${index}`}
                          onPress={() => handleClick(customer)}
                        >
                          <Text style={deemphasis}>
                            {customer.name}
                            {customer.orders && customer.orders?.length > 1
                              ? ` x ${customerCompletedOrdersLength(customer)}`
                              : null}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                </CustomCollapsible>
              </View>

              <View>
                {todaysOrders.chow.completedChow &&
                todaysOrders.chow.completedChow.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => toggleCollapsed("completedStock")}
                  >
                    <Text style={completedHighlight}>
                      {completedOrdersTotalBagOfChow} 
                      <Text style={subHeader}>{`${
                        todaysOrders.chow.completedChow.length > 1 ||
                        completedOrdersTotalBagOfChow > 1
                          ? "bags"
                          : "bag"
                      } of Chow`}</Text>
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={subHeader}>No chow to be delivered</Text>
                )}

                <CustomCollapsible
                  target={"completedStock"}
                  todaysOrders={todaysOrders}
                  // style={{ display: "flex", flexDirection: "column" }}
                >
                  {todaysOrders.chow.completedChow.map((chow, index) => (
                    <View key={index}>
                      {chow && (
                        <View>
                          <Text style={deemphasis}>
                            {`${chow.details.brand} ${chow.details.flavour} - ${chow.details.size}${chow.details.unit} x ${chow.quantity}`}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </CustomCollapsible>
              </View>
            </View>
          ) : null}

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
      </View>
    </>
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
