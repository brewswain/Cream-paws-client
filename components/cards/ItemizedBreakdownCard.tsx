import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";

import { useFocusEffect } from "@react-navigation/native";
import { Button, Checkbox } from "native-base";
import { CheckBox } from "@ui-kitten/components";

import {
  clearCourierFees,
  clearCustomerOrders,
  clearWarehouseOrders,
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
import { useFinanceStore } from "../../store/financeStore";
import { payDeliveryFees, payWarehouseOrders } from "../../api/routes/orders";

interface ItemizedBreakdownCardProps {
  mode: "warehouse" | "customers" | "courier";
}

interface GroupValue {
  index: number;
  selected: boolean;
  order_id: string | string[];
}

interface CheckBoxState {
  isChecked: boolean;
  id: number;
}
interface ItemizedListProps {
  targetOrders: OrderFromSupabase[];
  checkBoxState: CheckBoxState[];
  setCheckBoxState: (checkBoxes: CheckBoxState[]) => void;
  fetchData: () => void;
  handlePayment: (orderIds: number[]) => void;
  isCourierFees: boolean;
}
const ItemizedList = ({
  targetOrders,
  checkBoxState,
  setCheckBoxState,
  fetchData,
  isCourierFees,
  handlePayment,
}: ItemizedListProps) => {
  const [buttonStateSelectedOrders, setButtonStateSelectedOrders] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const checkedOrderIds = checkBoxState
    .filter((order) => order.isChecked)
    .map((order) => order.id);

  const resetCheckboxes = () => {
    setCheckBoxState(
      targetOrders.map((order) => ({ isChecked: false, id: order.id }))
    );
  };

  return (
    <View>
      {targetOrders.length
        ? targetOrders.map((order, index) => {
            return (
              <View key={index} style={styles.orderContainer}>
                <View style={styles.orderCard}>
                  <CheckBox
                    checked={checkBoxState[index].isChecked}
                    onChange={(nextChecked) => {
                      let data = [...checkBoxState];
                      data[index].isChecked = nextChecked;

                      setCheckBoxState(data);
                    }}
                  />
                  <View style={styles.textContainer}>
                    <Text
                      style={styles.tableChowDescription}
                    >{`${order.flavours.details.flavour_name} - ${order.variety.size} ${order.variety.unit}`}</Text>
                  </View>
                </View>
              </View>
            );
          })
        : null}

      {targetOrders.length ? (
        <View style={styles.buttonContainer}>
          <Button
            onPress={async () => {
              await handlePayment(checkedOrderIds);
              fetchData();
              resetCheckboxes();
            }}
            isDisabled={checkedOrderIds.length < 1}
            style={styles.button}
          >
            {buttonStateSelectedOrders === "loading" ? (
              <ActivityIndicator color="white" />
            ) : buttonStateSelectedOrders === "success" ? (
              <>
                <Text style={styles.buttonText}>Paid!</Text>
              </>
            ) : buttonStateSelectedOrders === "error" ? (
              <>
                <Text style={styles.buttonText}>Error!</Text>
              </>
            ) : !isCourierFees ? (
              "Pay selected orders"
            ) : (
              "Pay selected deliveries"
            )}
          </Button>
        </View>
      ) : null}
    </View>
  );
};

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

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const isCustomerOrders = mode === "customers";
  const isWarehouseOrders = mode === "warehouse";
  const isCourierFees = mode === "courier";

  const {
    fetchFinanceData,
    warehouseOrders,
    courierOrders,
    isFetching,
    error,
  } = useFinanceStore();

  const [courierChecked, setCourierChecked] = useState<CheckBoxState[]>(
    courierOrders.map((order) => ({ isChecked: false, id: order.id }))
  );
  const [warehouseOrdersChecked, setWarehouseOrdersChecked] = useState<
    CheckBoxState[]
  >(warehouseOrders.map((order) => ({ isChecked: false, id: order.id })));

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

  // const getDeliveryCosts = async () => {
  //   // TODO: change this entire flow--unpaidCustomerOrders and unpaidWarehouseOrders shouldn't share the same state
  //   const courierFees = await getUnpaidCourierFees();

  //   try {
  //     const response = await combineOrders(courierFees);
  //     setCourierOrders(response);
  //     setIsLoading(false);
  //     setIsSuccess(true);
  //   } catch (error) {
  //     setIsLoading(false);
  //     setIsError(true);
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const mappedCourierProfits = courierOrders
    .map(
      (order) =>
        (order.retail_price - order.wholesale_price) * 0.5 * order.quantity
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue);

  const mappedCourierDeliveryCosts = courierOrders.map((order) => {
    const safeDeliveryCost = order.delivery_cost ? order.delivery_cost : 0;

    return safeDeliveryCost;
  });

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

      fetchFinanceData(); // Revert to idle state after a delay
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

      fetchFinanceData(); // Revert to idle state after a delay
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
      fetchFinanceData();

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
      {!isFetching ? (
        <View style={tableContainer}>
          {isCourierFees ? (
            <ItemizedList
              targetOrders={courierOrders}
              checkBoxState={courierChecked}
              setCheckBoxState={setCourierChecked}
              fetchData={fetchFinanceData}
              isCourierFees={isCourierFees}
              handlePayment={payDeliveryFees}
            />
          ) : isWarehouseOrders ? (
            <ItemizedList
              targetOrders={warehouseOrders}
              checkBoxState={warehouseOrdersChecked}
              setCheckBoxState={setWarehouseOrdersChecked}
              fetchData={fetchFinanceData}
              isCourierFees={isCourierFees}
              handlePayment={payWarehouseOrders}
            />
          ) : null}
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

        {isCourierFees ? (
          <View style={totalWrapper}>
            {mappedCourierProfits ? (
              <View style={priceWrapper}>
                <Text style={deliveryCost}>Total Commission:</Text>
                <Text style={deliveryCost}>
                  {Dinero({
                    amount: mappedCourierProfits * 100 || 0,
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
            {totalCourierDeliveryFees || mappedCourierProfits ? (
              <View style={priceWrapper}>
                <Text style={deliveryCost}>Total:</Text>
                <Text style={deliveryCost}>
                  {Dinero({
                    amount:
                      totalCourierDeliveryFees + mappedCourierProfits * 100,
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
    marginVertical: 8,
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
