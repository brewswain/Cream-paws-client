import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";

import { useFocusEffect } from "@react-navigation/native";
import { Button, Checkbox } from "native-base";
import { CheckBox } from "@rneui/themed";

import {
  clearCourierFees,
  clearCustomerOrders,
  clearWarehouseOrders,
  combineOrders,
  concatFinanceQuantities,
  getUnpaidCourierFees,
  getUnpaidCustomerOrders,
  getUnpaidWarehouseOrders,
} from "../../utils/orderUtils";
import {
  CombinedOrder,
  OrderFromSupabase,
  OrderWithChowDetails,
} from "../../models/order";

interface ItemizedBreakdownCardProps {
  mode: "warehouse" | "customers" | "courier";
}

interface GroupValue {
  index: number;
  selected: boolean;
  order_id: string | string[];
}

const ItemizedBreakdownCard = ({ mode }: ItemizedBreakdownCardProps) => {
  const [buttonStateSelectedOrders, setButtonStateSelectedOrders] =
    useState("idle");
  const [buttonStateClearAllOrders, setButtonStateClearAllOrders] =
    useState("idle");
  const [groupValues, setGroupValues] = useState<GroupValue[]>([
    {
      index: 0,
      selected: false,
      order_id: "",
    },
  ]);

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [outstandingOrders, setOutstandingOrders] = useState<
    OrderFromSupabase[]
  >([]);
  const [formattedOrders, setFormattedOrders] = useState<CombinedOrder[]>([]);
  const [courierOrders, setCourierOrders] = useState<CombinedOrder[]>([]);

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const isCustomerOrders = mode === "customers";
  const isWarehouseOrders = mode === "warehouse";
  const isCourierFees = mode === "courier";

  // TODO: Put the heavy logic into our backend once this approach is verified

  const getCustomerOrders = async () => {
    try {
      const filteredOutstandingOrders = await getUnpaidCustomerOrders();
      setOutstandingOrders(filteredOutstandingOrders);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.error("Error fetching data:", error);
    }
  };

  const getWarehouseOwedCost = async (): Promise<void> => {
    try {
      setOutstandingOrders([]);
      const outstandingWarehouseOrders = await getUnpaidWarehouseOrders();
      setOutstandingOrders(outstandingWarehouseOrders);

      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.error("Error fetching data:", error);
    }
  };

  const populateData = async () => {
    if (isWarehouseOrders) {
      setIsLoading(true);
      setOutstandingOrders([]);

      getWarehouseOwedCost();
    } else if (isCustomerOrders) {
      setIsLoading(true);
      getCustomerOrders();
    } else if (isCourierFees) {
      setIsLoading(true);
      getDeliveryCosts();
    }
  };

  const {
    container,
    header,
    headerWrapper,
    tableContainer,
    orderContainer,
    tableQuantity,
    deEmphasis,
    tableChowDescription,
    tablePrice,
    buttonContainer,
    payAllOrderButton,
    button,
    totalsContainer,
    totalWrapper,
    priceWrapper,
    subTotalCost,
    statusContainer,
    status,
    vatCost,
    totalCost,
    deliveryCost,
    orderCard,
    textContainer,
    buttonText,
  } = styles;

  const orders: OrderFromSupabase[] = outstandingOrders;
  const mappedCostArray = orders
    .filter((order) => order.payment_made === false)
    .map((order) =>
      isWarehouseOrders
        ? order.wholesale_price * order.quantity
        : order.retail_price * order.quantity
    );

  const mappedVatArray = orders
    .filter((order) => order.payment_made === false)
    .map((order) => order.wholesale_price * 0.125);

  const subTotal = Math.round(
    mappedCostArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * 100
  );

  const formatOrders = async () => {
    const response = await concatFinanceQuantities(orders);
    // const response = await combineOrders(orders);

    //  setFormattedOrders(response);
  };

  const getDeliveryCosts = async () => {
    // TODO: change this entire flow--unpaidCustomerOrders and unpaidWarehouseOrders shouldn't share the same state
    const courierFees = await getUnpaidCourierFees();

    try {
      const response = await combineOrders(courierFees);
      setCourierOrders(response);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.error("Error fetching data:", error);
    }
  };

  const mappedCourierProfits = courierOrders.map((order) =>
    order.orders
      .map(
        (o) =>
          (o.chow_details.flavours.varieties.retail_price -
            o.chow_details.flavours.varieties.wholesale_price) *
          0.5 *
          o.quantity
      )
      .reduce((accumulator, currentValue) => accumulator + currentValue)
  );

  const mappedCourierDeliveryCosts = courierOrders.map((order) => {
    const safeDeliveryCost = order.delivery_cost ? order.delivery_cost : 0;

    return safeDeliveryCost;
  });

  const totalCourierProfits = Math.round(
    mappedCourierProfits.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * 100
  );

  const totalCourierDeliveryFees = Math.round(
    mappedCourierDeliveryCosts.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * 100
  );

  const ordersNestedArray = formattedOrders.flatMap((order) => order.orders);
  const mappedDeliveryCostArray = formattedOrders.map(
    (order) => order.delivery_cost
  );

  const totalDeliveryCost = Math.round(
    mappedDeliveryCostArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * 100
  );

  const totalVat = Math.round(
    mappedVatArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * 100
  );

  const selectedOrdersArray = groupValues
    .flatMap((selectedOrder) => {
      if (selectedOrder.selected === true) {
        if (!isCourierFees) {
          return orders.filter(
            (order) => order.order_id === selectedOrder.order_id
          );
        }

        if (Array.isArray(selectedOrder.order_id)) {
          return selectedOrder.order_id.flatMap((id) =>
            orders.filter((order) => order.order_id === id)
          );
        }
      }
      return []; // Return an empty array for non-selected orders
    })
    .filter(Boolean); // Filter out undefined values

  const handleCheckBoxChange = (
    orderIndex: number,
    order_id: string | string[]
  ) => {
    const data = [...groupValues];
    if (!data[orderIndex]) {
      setGroupValues([
        ...groupValues,
        { orderIndex, order_id, selected: true },
      ]);
    } else {
      data[orderIndex].selected = !data[orderIndex].selected;
      data[orderIndex].order_id = order_id;
      setGroupValues(data);
    }
  };

  const handleClearingSelectedPayments = async () => {
    setButtonStateSelectedOrders("loading"); // Set loading state

    try {
      isCourierFees
        ? await clearCourierFees(selectedOrdersArray)
        : isWarehouseOrders
        ? await clearWarehouseOrders(selectedOrdersArray)
        : await clearCustomerOrders(selectedOrdersArray);
      // On success, set success state
      setButtonStateSelectedOrders("success");
      const data = [...groupValues];
      data.map((order) => (order.selected = false));
      setGroupValues(data);
      setIsFetching(true);

      populateData(); // Revert to idle state after a delay
      setTimeout(() => {
        setButtonStateSelectedOrders("idle");
      }, 1000);
    } catch (error) {
      // On error, set error state
      setButtonStateSelectedOrders("error");

      // Revert to idle state after a delay
      setTimeout(() => {
        setButtonStateSelectedOrders("idle");
      }, 1000);
    }
  };

  const handleClearingAllPayments = async () => {
    setButtonStateClearAllOrders("loading"); // Set loading state

    try {
      isCourierFees
        ? await clearCourierFees(orders)
        : isWarehouseOrders
        ? await clearWarehouseOrders(orders)
        : await clearCustomerOrders(orders);
      // On success, set success state
      setButtonStateClearAllOrders("success");
      setIsFetching(true);

      populateData(); // Revert to idle state after a delay
      setTimeout(() => {
        setButtonStateClearAllOrders("idle");
      }, 1000);
    } catch (error) {
      // On error, set error state
      setButtonStateClearAllOrders("error");

      // Revert to idle state after a delay
      setTimeout(() => {
        setButtonStateClearAllOrders("idle");
      }, 1000);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // This function will be called whenever the screen is focused. Wrapping it in useCallback will prevent it from being called again to force a re-render when the data doesn't change
      populateData();

      return () => {
        setGroupValues([]);
      };
    }, [mode])
  );

  useEffect(() => {
    formatOrders();
  }, [outstandingOrders, setOutstandingOrders]);

  return (
    <View style={container}>
      {orders.length > 0 ? (
        <View style={buttonContainer}>
          <Button
            onPress={async () => {
              if (buttonStateClearAllOrders === "idle") {
                setButtonStateClearAllOrders("loading");
                try {
                  await handleClearingAllPayments();
                  setButtonStateClearAllOrders("success");
                  setTimeout(() => setButtonStateClearAllOrders("idle"), 1000);
                } catch (error) {
                  setButtonStateClearAllOrders("error");
                  setTimeout(() => setButtonStateClearAllOrders("idle"), 1000);
                }
              }
            }}
            style={button}
          >
            {buttonStateClearAllOrders === "loading" ? (
              <ActivityIndicator color="white" />
            ) : buttonStateClearAllOrders === "success" ? (
              <>
                <Text style={buttonText}>Paid!</Text>
              </>
            ) : buttonStateClearAllOrders === "error" ? (
              <>
                <Text style={buttonText}>Error!</Text>
              </>
            ) : !isCourierFees ? (
              "Pay all outstanding orders"
            ) : (
              "Pay all courier fees"
            )}
          </Button>
        </View>
      ) : null}
      <View style={headerWrapper}>
        <Text style={header}>
          {!isCourierFees ? "Itemized Breakdown" : "Calculated Courier Fees"}
        </Text>
      </View>
      {isSuccess ? (
        <View style={tableContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : isCourierFees ? (
            <Checkbox.Group onChange={setGroupValues} value={groupValues}>
              {courierOrders.length > 0
                ? courierOrders.map((order, index) => {
                    const safeDeliveryCost = order.delivery_cost
                      ? order.delivery_cost
                      : 0;

                    const orderIdArray = order.orders.map((o) => o.order_id);

                    const calculatedFees = order.orders
                      .map(
                        (o) =>
                          (o.chow_details.flavours.varieties.retail_price -
                            o.chow_details.flavours.varieties.wholesale_price) *
                          0.5 *
                          o.quantity
                      )
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue
                      );

                    return !order.driver_paid ? (
                      <View
                        key={`${order.name}-${order.delivery_date}-${index}`}
                        style={orderContainer}
                      >
                        <View style={orderCard}>
                          <CheckBox
                            containerStyle={{
                              backgroundColor: "transparent",
                              paddingLeft: 0,
                              marginLeft: 0,
                            }}
                            checked={
                              groupValues[index]
                                ? groupValues[index].selected
                                : false
                            }
                            onPress={() =>
                              handleCheckBoxChange(index, orderIdArray)
                            }
                          />
                          <View style={textContainer}>
                            <Text style={tableChowDescription}>
                              {`Delivery to: ${order.name} - ${new Date(
                                order.delivery_date
                              ).toDateString()}`}
                              :
                            </Text>
                            <Text
                              style={[
                                tableQuantity,
                                {
                                  paddingLeft: 0,

                                  flexDirection: "row",
                                  justifyContent: "flex-end",
                                },
                              ]}
                            >
                              <Text>
                                {Dinero({
                                  amount: Math.round(
                                    (calculatedFees + safeDeliveryCost) * 100
                                  ),
                                }).toFormat("$0,0.00")}
                              </Text>
                            </Text>
                          </View>
                        </View>
                      </View>
                    ) : null;
                  })
                : null}
            </Checkbox.Group>
          ) : isWarehouseOrders ? (
            <Checkbox.Group onChange={setGroupValues} value={groupValues}>
              {formattedOrders.length > 0 ? (
                formattedOrders.map((order, index) => {
                  const chosenPrice = isWarehouseOrders
                    ? order.chow_details.flavours.varieties.wholesale_price
                    : order.chow_details.flavours.varieties.retail_price;
                  const vatExclusivePrice: string = Dinero({
                    amount: Math.round(chosenPrice * order.quantity * 100),
                  }).toFormat("$0,0.00");

                  const description = (() => {
                    const fullDescription = `${order.chow_details.brand} - ${order.chow_details.flavours.flavour_name} ${order.chow_details.flavours.varieties.size}${order.chow_details.flavours.varieties.unit}`;
                    const index = fullDescription.indexOf("(");
                    const shortenedDescription =
                      index !== -1
                        ? fullDescription.substring(0, index).trim() +
                          ` ${order.chow_details.flavours.varieties.size}${order.chow_details.flavours.varieties.unit}`
                        : fullDescription;

                    return shortenedDescription;
                  })();

                  return (
                    <View key={order.order_id} style={orderContainer}>
                      <View style={orderCard}>
                        <CheckBox
                          containerStyle={{
                            backgroundColor: "transparent",
                            paddingLeft: 0,
                            marginLeft: 0,
                          }}
                          checked={
                            groupValues[index]
                              ? groupValues[index].selected
                              : false
                          }
                          onPress={() =>
                            handleCheckBoxChange(index, order.order_id!)
                          }
                        />
                        <View style={textContainer}>
                          <Text style={tableChowDescription}>
                            {description} :
                          </Text>
                          <Text style={tableQuantity}>
                            {order.quantity}
                            <Text style={deEmphasis}>x </Text>
                            <Text>
                              {isWarehouseOrders
                                ? order.chow_details.flavours.varieties
                                    .wholesale_price
                                : order.chow_details.flavours.varieties
                                    .retail_price}
                            </Text>
                          </Text>
                        </View>
                        <Text style={tablePrice}>{vatExclusivePrice}</Text>
                        {/* </Checkbox> */}
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={orderContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={tableQuantity}>No unpaid orders!</Text>
                  </View>
                </View>
              )}
            </Checkbox.Group>
          ) : (
            <>
              {formattedOrders.length > 0 ? (
                formattedOrders.map((order, index) => {
                  const chosenPrice = isWarehouseOrders
                    ? order.chow_details.flavours.varieties.wholesale_price
                    : order.chow_details.flavours.varieties.retail_price;

                  const profit =
                    (order.chow_details.flavours.varieties.retail_price -
                      order.chow_details.flavours.varieties.wholesale_price) /
                    2;
                  const calculatedProfit = order.delivery_cost
                    ? profit + order.delivery_cost
                    : profit;

                  const parsedProfit = Dinero({
                    amount: Math.round(profit * 100),
                  }).toFormat("$0,0.00");

                  const description = (() => {
                    const fullDescription = `${order.chow_details.brand} - ${order.chow_details.flavours.flavour_name} ${order.chow_details.flavours.varieties.size}${order.chow_details.flavours.varieties.unit}`;
                    const index = fullDescription.indexOf("(");
                    const shortenedDescription =
                      index !== -1
                        ? fullDescription.substring(0, index).trim() +
                          ` ${order.chow_details.flavours.varieties.size}${order.chow_details.flavours.varieties.unit}`
                        : fullDescription;

                    return shortenedDescription;
                  })();

                  return (
                    <View key={order.order_id} style={orderContainer}>
                      <View style={orderCard}>
                        <CheckBox
                          containerStyle={{
                            backgroundColor: "transparent",
                            paddingLeft: 0,
                            marginLeft: 0,
                          }}
                          checked={
                            groupValues[index]
                              ? groupValues[index].selected
                              : false
                          }
                          onPress={() =>
                            handleCheckBoxChange(index, order.order_id!)
                          }
                        />
                        <View style={textContainer}>
                          <Text style={tableChowDescription}>
                            {description} :
                          </Text>
                          <View style={textContainer}>
                            <Text style={tableQuantity}>
                              {order.quantity}
                              <Text style={deEmphasis}>x </Text>
                              <Text>{chosenPrice}</Text>
                            </Text>
                          </View>
                        </View>
                        <Text style={tablePrice}>
                          {Dinero({
                            amount:
                              Math.round(chosenPrice * 100) * order.quantity,
                          }).toFormat("$0,0.00")}
                        </Text>
                        {/* </Checkbox> */}
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={orderContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={tableQuantity}>No unpaid orders!</Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      ) : isError ? (
        <View style={statusContainer}>
          <Text style={status}>Error loading data. Please try again.</Text>
        </View>
      ) : (
        <View style={statusContainer}>
          <Text style={status}>Loading data...</Text>
        </View>
      )}
      {orders.length > 0 ? (
        <View style={buttonContainer}>
          <Button
            onPress={async () => {
              if (
                buttonStateSelectedOrders === "idle" &&
                groupValues.length >= 1
              ) {
                setButtonStateSelectedOrders("loading");
                try {
                  //handle method
                  await handleClearingSelectedPayments();

                  setButtonStateSelectedOrders("success");
                  setTimeout(() => setButtonStateSelectedOrders("idle"), 1000);
                } catch (error) {
                  setButtonStateSelectedOrders("error");
                  setTimeout(() => setButtonStateSelectedOrders("idle"), 1000);
                }
              }
            }}
            isDisabled={groupValues.length < 1}
            style={button}
          >
            {buttonStateSelectedOrders === "loading" ? (
              <ActivityIndicator color="white" />
            ) : buttonStateSelectedOrders === "success" ? (
              <>
                <Text style={buttonText}>Paid!</Text>
              </>
            ) : buttonStateSelectedOrders === "error" ? (
              <>
                <Text style={buttonText}>Error!</Text>
              </>
            ) : !isCourierFees ? (
              "Pay selected orders"
            ) : (
              "Pay selected deliveries"
            )}
          </Button>
        </View>
      ) : null}
      <View style={totalsContainer}>
        {isWarehouseOrders ? (
          <View style={totalWrapper}>
            <View style={priceWrapper}>
              <Text style={subTotalCost}>Subtotal:</Text>
              <Text style={subTotalCost}>
                {subTotal
                  ? Dinero({ amount: subTotal || 0 }).toFormat("$0,0.00")
                  : null}
              </Text>
            </View>
            <View style={priceWrapper}>
              <Text style={vatCost}>VAT:</Text>
              <Text style={vatCost}>
                {totalVat
                  ? Dinero({ amount: totalVat || 0 }).toFormat("$0,0.00")
                  : null}
              </Text>
            </View>
            <View style={priceWrapper}>
              <Text style={totalCost}>Total:</Text>
              <Text style={totalCost}>
                {subTotal && totalVat
                  ? Dinero({
                      amount: subTotal + totalVat || 0,
                      precision: 2,
                    }).toFormat("$0,0.00")
                  : null}
              </Text>
            </View>
          </View>
        ) : null}
        {isCustomerOrders ? (
          <View style={totalWrapper}>
            <View style={priceWrapper}>
              <Text style={subTotalCost}>
                {totalDeliveryCost ? "Subtotal" : "Total"}:
              </Text>
              <Text style={subTotalCost}>
                {subTotal
                  ? Dinero({ amount: subTotal || 0 }).toFormat("$0,0.00")
                  : null}
              </Text>
            </View>
            {totalDeliveryCost ? (
              <View style={priceWrapper}>
                <Text style={subTotalCost}>Delivery costs:</Text>
                <Text style={subTotalCost}>
                  {Dinero({ amount: totalDeliveryCost || 0 }).toFormat(
                    "$0,0.00"
                  )}
                </Text>
              </View>
            ) : null}
            {totalDeliveryCost ? (
              <View style={priceWrapper}>
                <Text style={subTotalCost}>Total:</Text>
                <Text style={subTotalCost}>
                  {Dinero({
                    amount: totalDeliveryCost + subTotal || 0,
                  }).toFormat("$0,0.00")}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
        {isCourierFees ? (
          <View style={totalWrapper}>
            {totalCourierProfits ? (
              <View style={priceWrapper}>
                <Text style={deliveryCost}>Total Commission:</Text>
                <Text style={deliveryCost}>
                  {Dinero({
                    amount: totalCourierProfits || 0,
                  }).toFormat("$0,0.00")}
                </Text>
              </View>
            ) : null}
            {totalCourierDeliveryFees ? (
              <View style={priceWrapper}>
                <Text style={deliveryCost}>Total Delivery Fees:</Text>
                <Text style={deliveryCost}>
                  {Dinero({
                    amount: totalCourierDeliveryFees || 0,
                  }).toFormat("$0,0.00")}
                </Text>
              </View>
            ) : null}
            {totalCourierDeliveryFees || totalCourierProfits ? (
              <View style={priceWrapper}>
                <Text style={deliveryCost}>Total:</Text>
                <Text style={deliveryCost}>
                  {Dinero({
                    amount: totalCourierDeliveryFees + totalCourierProfits,
                  }).toFormat("$0,0.00")}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  headerWrapper: {
    display: "flex",
    tex: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    borderBottomColor: "rgba(255,94,94, 1)",
    borderBottomWidth: 3,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: 6,
  },

  // Fix naming  convention
  orderContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: 14,
    paddingRight: 14,
  },
  tableQuantity: {
    color: "white",
    fontSize: 18,
    paddingLeft: 24,
  },
  deEmphasis: {
    fontSize: 12,
  },
  tableChowDescription: {
    color: "white",
  },
  tablePrice: {
    color: "white",
    alignItems: "flex-end",
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 12,
  },
  // Button Block
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: "60%",
  },

  payAllOrderButton: {
    backgroundColor: "green",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },

  // Orders Block
  totalsContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: 40,
    marginTop: 30,
  },
  totalWrapper: {
    display: "flex",
    alignItems: "center",
    paddingTop: 4,
    justifyContent: "space-between",
    borderTopColor: "rgba(255,94,94, 0.8)",
    borderTopWidth: 1,
  },
  priceWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  status: {
    color: "white",
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 24,
  },
  // Keeping this separate for now just in case we want to use different styles--remove if we centralize them
  subTotalCost: {
    color: "white",
    fontSize: 20,
  },
  vatCost: {
    color: "white",
    fontSize: 20,
  },
  totalCost: {
    color: "white",
    fontSize: 20,
  },
  deliveryCost: {
    color: "white",
    fontSize: 20,
  },
  orderCard: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flexDirection: "column",
    flexWrap: "wrap", // Wrap text if it exceeds the width
    justifyContent: "center",

    width: "65%", // Set a maximum width for the text
    maxWidth: "65%",
  },
});

export default ItemizedBreakdownCard;
