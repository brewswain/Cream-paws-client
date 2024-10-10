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
import { findCustomer, getAllOrders } from "../../api";
import { getTodaysOrders } from "../../utils";
import { CombinedOrder, OrderWithChowDetails } from "../../models/order";
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
import { test } from "../../api/routes/stock";

const TodayAtaGlanceCard = () => {
  const fetchTestData = async () => {
    const response = await test();

    console.log({ response });
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  const [todaysOrders, dispatch] = useReducer(
    todaysOrdersReducer,
    initialState
  );

  const toggleCollapsed = (target: CollapsibleTargets) => {
    dispatch({
      type: "collapsed",
      target,
    });
  };

  const updateOrders = (target: keyof OrdersMap, orders) => {
    dispatch({ type: "orders", orders, target });
  };

  const updateCustomers = (
    target: keyof CustomersMap,
    customers: Customer[]
  ) => {
    dispatch({ type: "customers", customers, target });
  };

  const updateChow = (target: keyof ChowMap, chow: ChowInfo[]) => {
    dispatch({ type: "chow", chow, target });
  };

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
    navigation.navigate("CustomerDetails", customer);
  };

  const populateData = async () => {
    const response = await getTodaysOrders();

    const filteredOutstandingOrders = response.filter(
      (order: OrderWithChowDetails) => order.payment_made === false
    );
    const filteredCompletedOrders = response.filter(
      (order: OrderWithChowDetails) => order.payment_made === true
    );

    updateOrders("unpaidOrders", filteredOutstandingOrders);
    updateOrders("completedOrders", filteredCompletedOrders);

    const [outstandingCustomerList, completedCustomerList] = await Promise.all([
      Promise.all(
        filteredOutstandingOrders.map((order) =>
          findCustomer(order?.customer_id)
        )
      ),
      Promise.all(
        filteredCompletedOrders.map((order) => findCustomer(order?.customer_id))
      ),
    ]);

    const filterUniqueCustomers = (
      customers: (Customer | undefined)[]
    ): Customer[] => {
      const uniqueCustomerIds: Record<string, boolean> = {};
      return customers.filter((customer) => {
        if (customer && !uniqueCustomerIds[customer.id]) {
          uniqueCustomerIds[customer.id] = true;
          return true;
        }
        return false;
      }) as Customer[];
    };

    const [outstandingFilteredCustomers, completedFilteredCustomers] = [
      filterUniqueCustomers(outstandingCustomerList),
      filterUniqueCustomers(completedCustomerList),
    ];

    updateCustomers("outstandingCustomers", outstandingFilteredCustomers);
    updateCustomers("completedCustomers", completedFilteredCustomers);

    const mapOrderToChowInfo = (orders: OrderWithChowDetails[]): ChowInfo[] => {
      return orders.map((order: OrderWithChowDetails) => ({
        quantity: order?.quantity ?? 0,
        details: {
          brand: order?.chow_details?.brand ?? "",
          flavour: order?.chow_details?.flavours.flavour_name ?? "",
          size: order?.chow_details?.flavours.varieties.size ?? 0,
          unit: order?.chow_details?.flavours.varieties.unit ?? "",
          order_id: order?.order_id ?? "",
        },
      }));
    };

    const customerChowArray = mapOrderToChowInfo(filteredOutstandingOrders);
    const completedOrderCustomerChowArray = mapOrderToChowInfo(
      filteredCompletedOrders
    );

    const deduplicateChowArray = (orders: ChowInfo[]): ChowInfo[] => {
      return orders.reduce((unique: ChowInfo[], chowObject) => {
        const existingIndex = unique.findIndex(
          (obj) => obj.details.order_id === chowObject.details.order_id
        );

        if (existingIndex !== -1) {
          unique[existingIndex].quantity += chowObject.quantity;
        } else {
          unique.push(chowObject);
        }

        return unique;
      }, []);
    };

    const [cleanedChowArray, cleanedCompletedOrderChowArray] = [
      deduplicateChowArray(customerChowArray),
      deduplicateChowArray(completedOrderCustomerChowArray),
    ];

    updateChow("outstandingChow", cleanedChowArray);
    updateChow("completedChow", cleanedCompletedOrderChowArray);
  };

  const totalBagsOfChow = todaysOrders.chow.outstandingChow.reduce(
    (total, chow) => total + chow.quantity,
    0
  );
  const completedOrdersTotalBagOfChow = todaysOrders.chow.completedChow.reduce(
    (total, chow) => total + chow.quantity,
    0
  );

  const mappedCostArray =
    todaysOrders.orders.unpaidOrders.map(
      (order: OrderWithChowDetails | CombinedOrder) =>
        order.chow_details.flavours.varieties.retail_price * order.quantity +
        order.delivery_cost
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
            {todaysOrders.orders.unpaidOrders &&
            todaysOrders.orders.unpaidOrders.length > 0 ? (
              <TouchableOpacity onPress={() => toggleCollapsed("unpaidOrders")}>
                <Text style={highlight}>
                  {todaysOrders.orders.unpaidOrders.length}{" "}
                  <Text style={subHeader}>
                    {todaysOrders.orders.unpaidOrders.length > 1
                      ? "orders"
                      : "order"}
                  </Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={subHeader}>No orders left!</Text>
            )}

            <CustomCollapsible
              todaysOrders={todaysOrders}
              target={"unpaidOrders"}
            >
              {todaysOrders.customers.outstandingCustomers &&
                todaysOrders.customers.outstandingCustomers.length > 0 &&
                todaysOrders.customers.outstandingCustomers.map(
                  (customer, index) => (
                    <TouchableOpacity
                      key={`${customer.id}, index: ${index}`}
                      onPress={() => handleClick(customer)}
                    >
                      <Text style={deemphasis}>
                        {customer.name}
                        {customer.orders && customer.orders?.length > 1
                          ? ` x ${customerOutstandingOrders(customer)}`
                          : null}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
            </CustomCollapsible>
          </View>

          <View>
            {todaysOrders.chow.outstandingChow &&
            todaysOrders.chow.outstandingChow.length > 0 ? (
              <TouchableOpacity onPress={() => toggleCollapsed("unpaidStock")}>
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
            )}

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
