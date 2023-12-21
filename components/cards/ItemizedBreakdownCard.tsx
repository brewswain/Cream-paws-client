import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";

import { useFocusEffect } from "@react-navigation/native";
import { Button, Checkbox } from "native-base";
import {
  clearCustomerOrders,
  clearWarehouseOrders,
  combineOrders,
  getUnpaidCustomerOrders,
  getUnpaidWarehouseOrders,
} from "../../utils/orderUtils";
import { CombinedOrder, OrderWithChowDetails } from "../../models/order";

interface ItemizedBreakdownCardProps {
  mode: "suppliers" | "customers";
}

const ItemizedBreakdownCard = ({ mode }: ItemizedBreakdownCardProps) => {
  const [buttonStateSelectedOrders, setButtonStateSelectedOrders] =
    useState("idle");
  const [buttonStateClearAllOrders, setButtonStateClearAllOrders] =
    useState("idle");
  const [groupValues, setGroupValues] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [outstandingOrders, setOutstandingOrders] = useState<
    OrderWithChowDetails[]
  >([]);
  const [formattedOrders, setFormattedOrders] = useState<CombinedOrder[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const isWarehouseOrders = mode === "suppliers";

  // TODO: Put the heavy logic into our backend once this approach is verified

  const getCustomerOrders = async () => {
    try {
      const filteredOutstandingOrders = await getUnpaidCustomerOrders();
      formatOrders();
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

  const populateData = () => {
    if (mode === "customers") {
      getCustomerOrders();
    } else {
      getWarehouseOwedCost();
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
    orderCard,
    textContainer,
    buttonText,
  } = styles;

  const orders: OrderWithChowDetails[] = outstandingOrders;
  const mappedCostArray = orders
    .filter((order) => order.payment_made === false)
    .map((order) =>
      isWarehouseOrders
        ? order.chow_details.flavours.varieties.wholesale_price * order.quantity
        : order.chow_details.flavours.varieties.retail_price * order.quantity
    );

  const mappedVatArray = orders
    .filter((order) => order.payment_made === false)
    .map(
      (order) => order.chow_details.flavours.varieties.wholesale_price * 0.125
    );

  const subTotal = Math.round(
    mappedCostArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * 100
  );

  const formatOrders = async () => {
    const response = await combineOrders(orders);
    setFormattedOrders(response);
  };
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

  const selectedOrdersArray = groupValues.flatMap((orderId) =>
    orders.filter((order) => order.order_id === orderId)
  );

  const handleClearingSelectedOrders = async () => {
    setButtonStateSelectedOrders("loading"); // Set loading state

    try {
      isWarehouseOrders
        ? await clearWarehouseOrders(selectedOrdersArray)
        : await clearCustomerOrders(selectedOrdersArray);
      // On success, set success state
      setButtonStateSelectedOrders("success");
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

  const handleClearingAllOrders = async () => {
    setButtonStateClearAllOrders("loading"); // Set loading state

    try {
      isWarehouseOrders
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
    }, [mode])
  );

  return (
    <View style={container}>
      {orders.length > 0 ? (
        <View style={buttonContainer}>
          <Button
            onPress={async () => {
              if (buttonStateClearAllOrders === "idle") {
                setButtonStateClearAllOrders("loading");
                try {
                  await handleClearingAllOrders();
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
            ) : (
              "Pay all outstanding orders"
            )}
          </Button>
        </View>
      ) : null}

      <View style={headerWrapper}>
        <Text style={header}>Itemized Breakdown</Text>
      </View>
      {isSuccess ? (
        <View style={tableContainer}>
          {isLoading && <ActivityIndicator size="large" color="blue" />}

          <Checkbox.Group onChange={setGroupValues} value={groupValues}>
            {outstandingOrders.length > 0 ? (
              outstandingOrders.map((order) => {
                const chosenPrice = isWarehouseOrders
                  ? order.chow_details.flavours.varieties.wholesale_price
                  : order.chow_details.flavours.varieties.retail_price;
                const vatExclusivePrice: string = Dinero({
                  amount: Math.round(chosenPrice * order.quantity * 100),
                }).toFormat("$0,0.00");
                const description = `${order.chow_details.brand} - ${order.chow_details.flavours.flavour_name} ${order.chow_details.flavours.varieties.size}${order.chow_details.flavours.varieties.unit}`;
                const shortenedDescription = description
                  .substring(0, description.indexOf("("))
                  .trim();

                return (
                  <View key={order.order_id} style={orderContainer}>
                    <View style={orderCard}>
                      <Checkbox
                        value={`${order._id}`}
                        accessibilityLabel="Checkbox for identifying individual orders to pay"
                      >
                        <View style={textContainer}>
                          <Text style={tableChowDescription}>
                            {shortenedDescription || description} :
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
                      </Checkbox>
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
                  await handleClearingSelectedOrders();
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
            ) : (
              "Set orders to 'Paid'"
            )}
          </Button>
        </View>
      ) : null}

      {/* Problem detected here */}
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
        ) : (
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
              <Text style={subTotalCost}>Delivery costs:</Text>
              <Text style={subTotalCost}>
                {totalDeliveryCost
                  ? Dinero({ amount: totalDeliveryCost || 0 }).toFormat(
                      "$0,0.00"
                    )
                  : null}
              </Text>
            </View>
            <View style={priceWrapper}>
              <Text style={subTotalCost}>Total:</Text>
              <Text style={subTotalCost}>
                {totalDeliveryCost
                  ? Dinero({
                      amount: totalDeliveryCost + subTotal || 0,
                    }).toFormat("$0,0.00")
                  : null}
              </Text>
            </View>
          </View>
        )}
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
    width: "80%",
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
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default ItemizedBreakdownCard;
