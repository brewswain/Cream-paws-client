import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";

import { useFocusEffect } from "@react-navigation/native";

import { concatFinanceQuantities } from "../../utils/orderUtils";
import { OrderFromSupabase } from "../../models/order";
import { useFinanceStore } from "../../store/financeStore";
import { payDeliveryFees, payWarehouseOrders } from "../../api/routes/orders";
import ItemizedList from "../TodayAtAGlance/atom/ItemizedList";
import ConfirmMassPaymentModal from "../modals/ConfirmMassPaymentModal";

interface ItemizedBreakdownCardProps {
  mode: "warehouse" | "customers" | "courier";
}

interface GroupValue {
  index: number;
  selected: boolean;
  order_id: string | string[];
}

export interface CheckBoxState {
  isChecked: boolean;
  id: number;
}

const ItemizedBreakdownCard = ({ mode }: ItemizedBreakdownCardProps) => {
  const [isError, setIsError] = useState(false);

  const isWarehouseOrders = mode === "warehouse";
  const isCourierFees = mode === "courier";

  const {
    fetchFinanceData,
    warehouseOrders,
    courierOrders,
    isFetching,
    showModal,
    error,
  } = useFinanceStore();

  const [courierChecked, setCourierChecked] = useState<CheckBoxState[]>(
    courierOrders.map((order) => ({ isChecked: false, id: order.id }))
  );
  const [warehouseOrdersChecked, setWarehouseOrdersChecked] = useState<
    CheckBoxState[]
  >(warehouseOrders.map((order) => ({ isChecked: false, id: order.id })));

  const {
    container,
    header,
    headerWrapper,
    tableContainer,
    totalsContainer,
    totalWrapper,
    priceWrapper,
    subTotalCost,
    statusContainer,
    status,
    vatCost,
    totalCost,
    deliveryCost,
  } = styles;

  const mappedWarehouseCosts = warehouseOrders
    .map((order) => order.wholesale_price)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const mappedVatArray = warehouseOrders.map(
    (order) => order.wholesale_price * 0.125
  );

  const mappedCourierProfits = courierOrders
    .map(
      (order) =>
        (order.retail_price - order.wholesale_price) * 0.5 * order.quantity
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

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

  const totalVat = Math.round(
    mappedVatArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * 100
  );

  useFocusEffect(
    useCallback(() => {
      // This function will be called whenever the screen is focused. Wrapping it in useCallback will prevent it from being called again to force a re-render when the data doesn't change
      fetchFinanceData();
    }, [mode])
  );

  return (
    <View style={container}>
      <View style={headerWrapper}>
        <Text style={header}>
          {!isCourierFees ? "Itemized Breakdown" : "Calculated Courier Fees"}
        </Text>
      </View>
      {!isFetching ? (
        <View style={tableContainer}>
          {isCourierFees && courierOrders && courierChecked.length ? (
            <ItemizedList
              targetOrders={courierOrders}
              checkBoxState={courierChecked}
              setCheckBoxState={setCourierChecked}
              fetchData={fetchFinanceData}
              isCourierFees={isCourierFees}
              handlePayment={payDeliveryFees}
            />
          ) : isWarehouseOrders &&
            warehouseOrders &&
            warehouseOrdersChecked.length ? (
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
                {mappedWarehouseCosts
                  ? Dinero({
                      amount: mappedWarehouseCosts * 100 || 0,
                    }).toFormat("$0,0.00")
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
                {mappedWarehouseCosts && totalVat
                  ? Dinero({
                      amount: mappedWarehouseCosts * 100 + totalVat || 0,
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

      <ConfirmMassPaymentModal
        showModal={showModal}
        handlePress={isCourierFees ? payDeliveryFees : payWarehouseOrders}
        isCourierFees={isCourierFees}
      />
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

  tableQuantity: {
    color: "white",
    fontSize: 18,
    paddingLeft: 24,
  },
  deEmphasis: {
    fontSize: 12,
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
});

export default ItemizedBreakdownCard;
