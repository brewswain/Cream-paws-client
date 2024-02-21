import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Collapsible from "react-native-collapsible";

import Dinero from "dinero.js";
import { Divider } from "native-base";
import { findCustomer, getAllOrders } from "../../api";
import { getTodaysOrders } from "../../utils";
import { OrderWithChowDetails } from "../../models/order";
import { Customer } from "../../models/customer";
import moment from "moment";

interface ChowInfo {
  quantity: number;
  details: {
    brand: string;
    flavour: string;
    size: number;
    unit: string;
    order_id: string;
  };
}

const TodayAtaGlanceCard = () => {
  const [orderCollapsed, setOrderCollapsed] = useState<boolean>(true);
  const [stockCollapsed, setStockCollapsed] = useState<boolean>(true);
  const [completedorderCollapsed, setCompletedOrderCollapsed] =
    useState<boolean>(true);
  const [completedstockCollapsed, setCompletedStockCollapsed] =
    useState<boolean>(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [customersWithOutstandingOrders, setCustomersWithOutstandingOrders] =
    useState<Customer[]>();
  const [customersWithCompletedOrders, setCustomersWithCompletedOrders] =
    useState<Customer[]>();
  const [chowInfo, setChowInfo] = useState<ChowInfo[]>([]);
  const [completedOrderChowInfo, setCompletedOrderChowInfo] = useState<
    ChowInfo[]
  >([]);

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
    const filteredOutstandingOrders = await getTodaysOrders(false);
    const filteredCompletedOrders = await getTodaysOrders(true);

    if (filteredOutstandingOrders.length < 1) {
      setOrders([]);
      setCustomersWithOutstandingOrders([]);
      setChowInfo([]);
    } else {
      filteredOutstandingOrders && setOrders(filteredOutstandingOrders);
      filteredCompletedOrders && setCompletedOrders(filteredCompletedOrders);

      const outstandingCustomerList = await Promise.all(
        filteredOutstandingOrders.map(
          async (
            order: OrderWithChowDetails | undefined
          ): Promise<Customer | undefined> => {
            if (order) return await findCustomer(order.customer_id);
            return undefined;
          }
        )
      );
      const completedCustomerList = await Promise.all(
        filteredCompletedOrders.map(
          async (
            order: OrderWithChowDetails | undefined
          ): Promise<Customer | undefined> => {
            if (order) return await findCustomer(order.customer_id);
            return undefined;
          }
        )
      );

      const uniqueCustomerIds: Record<string, boolean> = {}; // Type the object as Record<string, boolean>

      const outstandingFilteredCustomers = outstandingCustomerList.filter(
        (customer) => {
          if (customer && !uniqueCustomerIds[customer.id]) {
            uniqueCustomerIds[customer.id] = true; // Mark the customer ID as seen
            return true; // Include the customer in the filtered list
          }
          return false; // Exclude duplicate customers
        }
      ) as Customer[];

      const completedFilteredCustomers = completedCustomerList.filter(
        (customer) => {
          if (customer && !uniqueCustomerIds[customer.id]) {
            uniqueCustomerIds[customer.id] = true; // Mark the customer ID as seen
            return true; // Include the customer in the filtered list
          }
          return false; // Exclude duplicate customers
        }
      ) as Customer[];

      setCustomersWithOutstandingOrders(outstandingFilteredCustomers);
      setCustomersWithCompletedOrders(completedFilteredCustomers);

      const customerChowArray = filteredOutstandingOrders.map(
        (order: OrderWithChowDetails) => ({
          quantity: order?.quantity ?? 0,
          details: {
            brand: order?.chow_details?.brand ?? "",
            flavour: order?.chow_details?.flavours.flavour_name ?? "",
            size: order?.chow_details?.flavours.varieties.size ?? 0,
            unit: order?.chow_details?.flavours.varieties.unit ?? "",
            order_id: order?.order_id ?? "",
          },
        })
      );
      const completedOrderCustomerChowArray = filteredCompletedOrders.map(
        (order: OrderWithChowDetails) => ({
          quantity: order?.quantity ?? 0,
          details: {
            brand: order?.chow_details?.brand ?? "",
            flavour: order?.chow_details?.flavours.flavour_name ?? "",
            size: order?.chow_details?.flavours.varieties.size ?? 0,
            unit: order?.chow_details?.flavours.varieties.unit ?? "",
            order_id: order?.order_id ?? "",
          },
        })
      );

      const cleanedChowArray: ChowInfo[] = customerChowArray.reduce(
        (unique: ChowInfo[], chowObject) => {
          const existingIndex = unique.findIndex(
            (obj) => obj.details.order_id === chowObject.details.order_id
          );

          if (existingIndex !== -1) {
            unique[existingIndex].quantity += chowObject.quantity;
          } else {
            unique.push(chowObject);
          }

          return unique;
        },
        []
      );
      const cleanedCompletedOrderChowArray: ChowInfo[] =
        completedOrderCustomerChowArray.reduce(
          (unique: ChowInfo[], chowObject) => {
            const existingIndex = unique.findIndex(
              (obj) => obj.details.order_id === chowObject.details.order_id
            );

            if (existingIndex !== -1) {
              unique[existingIndex].quantity += chowObject.quantity;
            } else {
              unique.push(chowObject);
            }

            return unique;
          },
          []
        );

      setChowInfo(cleanedChowArray);
      setCompletedOrderChowInfo(cleanedCompletedOrderChowArray);
    }
  };

  const totalBagsOfChow = chowInfo.reduce(
    (total, chow) => total + chow.quantity,
    0
  );
  const completedOrdersTotalBagOfChow = completedOrderChowInfo.reduce(
    (total, chow) => total + chow.quantity,
    0
  );

  const mappedCostArray =
    orders
      .filter((order: OrderWithChowDetails) => order.payment_made === false)
      .map(
        (order: OrderWithChowDetails) =>
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
            {orders && orders.length > 0 ? (
              <TouchableOpacity
                onPress={() => setOrderCollapsed(!orderCollapsed)}
              >
                <Text style={highlight}>
                  {orders.length}{" "}
                  <Text style={subHeader}>
                    {orders.length > 1 ? "orders" : "order"}
                  </Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={subHeader}>No orders left!</Text>
            )}
            <Collapsible collapsed={orderCollapsed}>
              {customersWithOutstandingOrders &&
                customersWithOutstandingOrders.length > 0 &&
                customersWithOutstandingOrders.map((customer, index) => (
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
                ))}
            </Collapsible>
          </View>

          <View>
            {chowInfo && chowInfo.length > 0 ? (
              <TouchableOpacity
                onPress={() => setStockCollapsed(!stockCollapsed)}
              >
                <Text style={highlight}>
                  {totalBagsOfChow} 
                  <Text style={subHeader}>{`${
                    chowInfo.length > 1 || totalBagsOfChow > 1 ? "bags" : "bag"
                  } of Chow`}</Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={subHeader}>No chow to be delivered</Text>
            )}

            <Collapsible
              collapsed={stockCollapsed}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {chowInfo.map((chow, index) => (
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
            </Collapsible>
          </View>
        </View>
      </ScrollView>

      <View>
        <Text style={subHeader}>Today's completed orders</Text>

        <View>
          {completedOrders && completedOrders.length > 0 ? (
            <TouchableOpacity
              onPress={() =>
                setCompletedOrderCollapsed(!completedorderCollapsed)
              }
            >
              <Text style={completedHighlight}>
                {completedOrders.length}{" "}
                <Text style={subHeader}>
                  {completedOrders.length > 1 ? "orders" : "order"}
                </Text>
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={subHeader}>No orders left!</Text>
          )}
          <Collapsible collapsed={completedorderCollapsed}>
            {customersWithCompletedOrders &&
              customersWithCompletedOrders.length > 0 &&
              customersWithCompletedOrders.map((customer, index) => (
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
              ))}
          </Collapsible>
        </View>

        <View>
          {completedOrderChowInfo && completedOrderChowInfo.length > 0 ? (
            <TouchableOpacity
              onPress={() =>
                setCompletedStockCollapsed(!completedstockCollapsed)
              }
            >
              <Text style={completedHighlight}>
                {completedOrdersTotalBagOfChow} 
                <Text style={subHeader}>{`${
                  completedOrderChowInfo.length > 1 ||
                  completedOrdersTotalBagOfChow > 1
                    ? "bags"
                    : "bag"
                } of Chow`}</Text>
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={subHeader}>No chow to be delivered</Text>
          )}

          <Collapsible
            collapsed={completedstockCollapsed}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {completedOrderChowInfo.map((chow, index) => (
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
          </Collapsible>
        </View>
      </View>
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
