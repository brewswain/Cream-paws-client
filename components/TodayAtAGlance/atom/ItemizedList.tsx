import { useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Button } from "native-base";
import { CheckBox } from "@ui-kitten/components";

import { OrderFromSupabase } from "../../../models/order";
import { CheckBoxState } from "../../cards/ItemizedBreakdownCard";

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
const styles = StyleSheet.create({
  orderContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: 14,
    paddingRight: 14,
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

  tableChowDescription: {
    color: "white",
  },

  buttonContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },

  button: {
    width: "60%",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default ItemizedList;
