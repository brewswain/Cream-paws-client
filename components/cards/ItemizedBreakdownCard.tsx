import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";

import { Button, Checkbox } from "native-base";
import { clearOrders, getTodaysOrders } from "../../utils/orderUtils";

const ItemizedBreakdownCard = () => {
  const [groupValues, setGroupValues] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [outstandingOrders, setOutstandingOrders] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  // TODO: Put the heavy logic into our backend once this approach is verified
  const getWarehouseOwedCost = async () => {
    // TODO: stopgap for development speed--Instead of extracting our prices
    // here, do this in API
    // const orderCostArray = response.map(order => order.)
    // Okay. We need to get our orders here. The problem is, they're attached to our customers. This means that we'll need to make a call to our Customers route while looking for orders. Some logic routes i can see include:
    // - Make a call to our getAllOrders() route. from there, we can iterate through and extract every customerId, and pull a list of those orders. From there, we extract warehouse_price from each customer and then run our reduce.
    //   This approach is obviously incredibly expensive and incredibly naive. However, it IS a solution and should be seen as nothing more than a framework for getting our mindMap under control.
    /* - Make a call to getAllCustomers(). From here, we filter those that have an orders[] length of 1 or higher, while extracting  our wholesale_price x quantity. This method still isn't good but it's better than the above.
     */

    const filteredOutstandingOrders = await getTodaysOrders();
    // TODO: change order object so that it includes chow_details by default, since passing a customer down to get chow info is inefficient
    setOutstandingOrders(filteredOutstandingOrders);
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
    vatCost,
    totalCost,
  } = styles;

  const orders = outstandingOrders;
  const mappedCostArray = orders
    .filter((order) => order.payment_made === false)
    .map((order) => order.chow_details.wholesale_price * order.quantity);

  const mappedVatArray = orders
    .filter((order) => order.payment_made === false)
    .map((order) => order.chow_details.wholesale_price * 0.125);

  const subTotal = Math.round(
    mappedCostArray.reduce(
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
    .map((orderId) => orders.filter((order) => order._id === orderId))
    .flat();

  const handleClearingSelectedOrders = async () => {
    await clearOrders(selectedOrdersArray);

    setIsFetching(true);
  };

  const handleClearingAllOrders = async () => {
    await clearOrders(orders);
    setIsFetching(true);
  };

  useEffect(() => {
    if (isFetching === true) {
      getWarehouseOwedCost();
      setIsFetching(false);
    }
  }, [isFetching]);

  return (
    <View style={container}>
      {orders.length > 0 ? (
        <Button
          style={payAllOrderButton}
          onPress={() => handleClearingAllOrders()}
        >
          Pay all outstanding orders
        </Button>
      ) : null}
      <View style={headerWrapper}>
        <Text style={header}>Itemized Breakdown</Text>
      </View>
      <View style={tableContainer}>
        <Checkbox.Group onChange={setGroupValues} value={groupValues}>
          {outstandingOrders.length > 0 ? (
            outstandingOrders.map((order) => {
              const vatExclusivePrice: string = Dinero({
                amount: Math.round(
                  order.chow_details.wholesale_price * order.quantity * 100
                ),
              }).toFormat("$0,0.00");

              return (
                <View key={order._id} style={orderContainer}>
                  <View>
                    <Checkbox
                      value={`${order._id}`}
                      accessibilityLabel="Checkbox for identifying individual orders to pay"
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "wrap",
                          width: "90%",
                        }}
                      >
                        <Text style={tableQuantity}>
                          {order.quantity}
                          <Text style={deEmphasis}>x </Text>
                        </Text>
                        <Text style={tableChowDescription}>
                          {`${order.chow_details.brand} - ${order.chow_details.flavour}`}
                          :
                        </Text>
                        <Text style={tablePrice}> {vatExclusivePrice}</Text>
                      </View>
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
      {orders.length > 0 ? (
        <View style={buttonContainer}>
          <Button
            onPress={() => handleClearingSelectedOrders()}
            isDisabled={groupValues.length < 1}
            style={button}
          >
            Set orders to "Paid"
          </Button>
        </View>
      ) : null}
      {/* Problem detected here */}
      <View style={totalsContainer}>
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
});

export default ItemizedBreakdownCard;
