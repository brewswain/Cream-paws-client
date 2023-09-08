import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Collapsible from "react-native-collapsible";

import { getAllOrders, findCustomer } from "../../api";
import { getTodaysOrders } from "../../utils";

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
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<Customer[]>();
  const [chowInfo, setChowInfo] = useState<ChowInfo[]>([]);

  const { container, highlight, header, subHeader, deemphasis } = styles;
  const navigation = useNavigation();

  const handleClick = (customer: Customer) => {
    navigation.navigate("CustomerDetails", customer);
  };

  const populateData = async () => {
    const filteredOutstandingOrders = await getTodaysOrders();
    if (filteredOutstandingOrders.length < 1) {
      setOrders([]);
      setCustomers([]);
      setChowInfo([]);
    } else {
      setOrders(filteredOutstandingOrders);

      const customerList = await Promise.all(
        filteredOutstandingOrders.map(
          async (
            order: OrderWithChowDetails | undefined
          ): Promise<Customer | undefined> => {
            if (order) return await findCustomer(order.customer_id);
            return undefined;
          }
        )
      );
      setCustomers(
        customerList.filter((customer) => customer !== undefined) as Customer[]
      );

      const customerChowArray = filteredOutstandingOrders.map((order) => ({
        quantity: order?.quantity ?? 0,
        details: {
          brand: order?.chow_details?.brand ?? "",
          flavour: order?.chow_details?.flavour ?? "",
          size: order?.chow_details?.size ?? 0,
          unit: order?.chow_details?.unit ?? "",
          order_id: order?.id ?? "",
        },
      }));

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

      setChowInfo(cleanedChowArray);
    }
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
      <ScrollView>
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
            {customers &&
              customers.length > 0 &&
              customers.map((customer, index) => (
                <TouchableOpacity
                  key={`${customer.id}, index: ${index}`}
                  onPress={() => handleClick(customer)}
                >
                  <Text style={deemphasis}>{customer.name}</Text>
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
                {chowInfo.reduce((total, chow) => total + chow.quantity, 0)}{" "}
                <Text style={subHeader}>{`${
                  chowInfo.length > 1 ? "bags" : "bag"
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
      </ScrollView>
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
});

export default TodayAtaGlanceCard;
