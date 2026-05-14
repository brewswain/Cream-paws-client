import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";

import { useFocusEffect } from "@react-navigation/native";

import { OrderFromSupabase } from "../../models/order";
import { useFinanceStore } from "../../store/financeStore";
import { payDeliveryFees, payWarehouseOrders } from "../../api/routes/orders";
import ItemizedList from "../TodayAtAGlance/atom/ItemizedList";
import ConfirmMassPaymentModal from "../modals/ConfirmMassPaymentModal";
import { useCustomersWithOrdersQuery } from "../../hooks/useCustomersWithOrdersQuery";
import { flattenOrdersFromCustomers } from "../../lib/orders/flattenOrdersFromCustomers";

interface ItemizedBreakdownCardProps {
  mode: "warehouse" | "customers" | "courier";
}

export interface CheckBoxState {
  isChecked: boolean;
  id: string;
}

const ItemizedBreakdownCard = ({ mode }: ItemizedBreakdownCardProps) => {
  const isWarehouseOrders = mode === "warehouse";
  const isCourierFees = mode === "courier";

  const { data: customers = [], isPending, isError, error, refetch } =
    useCustomersWithOrdersQuery();

  const { showModal } = useFinanceStore();

  const flatOrders = useMemo(
    () => flattenOrdersFromCustomers(customers),
    [customers]
  );

  const warehouseOrders = useMemo(
    () => flatOrders.filter((o) => o.warehouse_paid === false),
    [flatOrders]
  );

  const courierOrders = useMemo(
    () => flatOrders.filter((o) => o.driver_paid === false),
    [flatOrders]
  );

  const [courierChecked, setCourierChecked] = useState<CheckBoxState[]>([]);
  const [warehouseOrdersChecked, setWarehouseOrdersChecked] = useState<
    CheckBoxState[]
  >([]);

  useEffect(() => {
    setCourierChecked(
      courierOrders.map((order) => ({ isChecked: false, id: String(order.id) }))
    );
  }, [courierOrders]);

  useEffect(() => {
    setWarehouseOrdersChecked(
      warehouseOrders.map((order) => ({ isChecked: false, id: String(order.id) }))
    );
  }, [warehouseOrders]);

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
    .map(
      (order) =>
        (order.retail_price ?? 0) * (order.quantity ?? 1)
    )
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const mappedVatArray = warehouseOrders.map(
    (order) => (order.retail_price ?? 0) * (order.quantity ?? 1) * 0.125
  );

  const mappedCourierProfits = courierOrders
    .map(
      (order) =>
        (order.retail_price ?? 0) * 0.25 * (order.quantity ?? 1)
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

  const refetchLists = useCallback(() => {
    void refetch();
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch])
  );

  const showInitialLoad = isPending && customers.length === 0;

  return (
    <View style={container}>
      <View style={headerWrapper}>
        <Text style={header}>
          {!isCourierFees ? "Itemized Breakdown" : "Calculated Courier Fees"}
        </Text>
      </View>
      {isError ? (
        <View style={statusContainer}>
          <Text style={status}>
            {error instanceof Error ? error.message : "Error loading data. Please try again."}
          </Text>
        </View>
      ) : showInitialLoad ? (
        <View style={statusContainer}>
          <Text style={status}>Loading data...</Text>
        </View>
      ) : (
        <View style={tableContainer}>
          {isCourierFees && courierOrders.length > 0 && courierChecked.length > 0 ? (
            <ItemizedList
              targetOrders={courierOrders}
              checkBoxState={courierChecked}
              setCheckBoxState={setCourierChecked}
              fetchData={refetchLists}
              isCourierFees={isCourierFees}
              handlePayment={payDeliveryFees}
            />
          ) : isWarehouseOrders &&
            warehouseOrders.length > 0 &&
            warehouseOrdersChecked.length > 0 ? (
            <ItemizedList
              targetOrders={warehouseOrders}
              checkBoxState={warehouseOrdersChecked}
              setCheckBoxState={setWarehouseOrdersChecked}
              fetchData={refetchLists}
              isCourierFees={isCourierFees}
              handlePayment={payWarehouseOrders}
            />
          ) : null}
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
        onAfterPayment={refetchLists}
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
    alignItems: "center",
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
