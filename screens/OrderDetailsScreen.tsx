import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Button, ScrollView } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";

import { deleteOrder, updateOrder } from "../api";
import { Header } from "../components/details/DetailScreenComponents";
import { RootStackScreenProps } from "../types";
import {
  OrderFromSupabase,
  OrderUpdatePayload,
  formatOrderSummaryLine,
  toOrderUpdatePayload,
} from "../models/order";
import Dinero from "dinero.js";
import { isOrderConflictError } from "../lib/orders/isOrderConflictError";
import { refetchCanonicalOrderAfterConflict } from "../lib/orders/refetchCanonicalOrderAfterConflict";
import { getUserVisibleHttpMessage } from "../lib/api/normalizedHttpError";

interface OrderDetailsProps {
  navigation: RootStackScreenProps<"OrderDetails">["navigation"];
  route: RootStackScreenProps<"OrderDetails">["route"];
}

function buildPayload(order: OrderFromSupabase): OrderUpdatePayload {
  return toOrderUpdatePayload(order);
}

const OrderDetailsScreen = ({ navigation, route }: OrderDetailsProps) => {
  const { order } = route.params;
  const [orderPayload, setOrderPayload] = useState<OrderUpdatePayload>(
    buildPayload(order)
  );
  const [datePickerIsVisible, setDatePickerIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const navigate = useNavigation();

  useEffect(() => {
    setOrderPayload(buildPayload(order));
  }, [order]);

  const toggleDatePickerVisibility = () => {
    setDatePickerIsVisible(!datePickerIsVisible);
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    setOrderPayload((prev) => ({
      ...prev,
      delivery_date: date.toISOString().split("T")[0],
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateOrder(orderPayload);
      Toast.show({ type: "success", text1: "Order updated" });
      navigate.goBack();
    } catch (err) {
      if (isOrderConflictError(err)) {
        const fresh = await refetchCanonicalOrderAfterConflict(order.id);
        if (fresh) {
          setOrderPayload(toOrderUpdatePayload(fresh));
          setSelectedDate(undefined);
        }
        Toast.show({
          type: "error",
          text1: "Order changed elsewhere",
          text2: "This form was reset to the latest server version.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Could not update order",
          text2: getUserVisibleHttpMessage(err),
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      Toast.show({ type: "success", text1: "Order marked paid" });
      navigate.goBack();
    } catch (err) {
      if (isOrderConflictError(err)) {
        const fresh = await refetchCanonicalOrderAfterConflict(id);
        if (fresh) {
          setOrderPayload(toOrderUpdatePayload(fresh));
        }
        Toast.show({
          type: "error",
          text1: "Order changed elsewhere",
          text2: "Refresh the form and try again.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Could not update order",
          text2: getUserVisibleHttpMessage(err),
        });
      }
    }
  };

  const formatDate = (date: string) => new Date(date).toDateString();
  const formattedDeliveryDate = formatDate(orderPayload.delivery_date);
  const retail = orderPayload.retail_price ?? 0;
  const total =
    retail * orderPayload.quantity + (orderPayload.delivery_cost ?? 0);

  return (
    <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>{order.customers.name}</Text>

        <Header>Summary</Header>
        <Text style={styles.subtle}>{formatOrderSummaryLine(order)}</Text>

        <Header>Services (read-only)</Header>
        <Text style={styles.subtle}>
          {JSON.stringify(orderPayload.services)}
        </Text>

        <Header>Quantity</Header>
        <TextInput
          value={String(orderPayload.quantity)}
          onChangeText={(value) =>
            setOrderPayload((prev) => ({
              ...prev,
              quantity: parseInt(value, 10) || 0,
            }))
          }
          keyboardType="numeric"
          style={styles.input}
        />

        <Header>Retail price</Header>
        <TextInput
          value={String(orderPayload.retail_price ?? 0)}
          onChangeText={(value) =>
            setOrderPayload((prev) => ({
              ...prev,
              retail_price: parseFloat(value) || 0,
            }))
          }
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <Header>Delivery cost</Header>
        <TextInput
          value={String(orderPayload.delivery_cost ?? 0)}
          onChangeText={(value) =>
            setOrderPayload((prev) => ({
              ...prev,
              delivery_cost: parseFloat(value) || 0,
            }))
          }
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <Header>Delivery date</Header>
        <Pressable onPress={toggleDatePickerVisibility}>
          <Text style={styles.deliveryText}>
            {selectedDate
              ? selectedDate.toDateString()
              : formattedDeliveryDate}
          </Text>
        </Pressable>

        <DateTimePickerModal
          isVisible={datePickerIsVisible}
          onConfirm={handleDateConfirm}
          onCancel={toggleDatePickerVisibility}
        />

        <View style={styles.moneyBanner}>
          <Text style={styles.moneyBannerLabel}>Order total</Text>
          <Text style={styles.moneyBannerValue} accessibilityRole="text">
            {Dinero({ amount: Math.round(total * 100) }).toFormat("$0,0.00")}
          </Text>
          <Text style={styles.moneyBannerHint}>
            Retail × quantity + delivery (outdoor-friendly contrast)
          </Text>
        </View>

        <View style={styles.actions}>
          <Button colorScheme="teal" onPress={() => void handleUpdate()} marginBottom={3}>
            Update order
          </Button>
          <Button colorScheme="danger" onPress={() => void handleDelete(order.id)}>
            Mark paid (delete flow)
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "600",
    marginVertical: 12,
  },
  subtle: {
    color: "#555",
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    marginBottom: 12,
    fontSize: 16,
  },
  deliveryText: {
    backgroundColor: "hsl(213,74%,54%)",
    padding: 10,
    fontSize: 16,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
    borderRadius: 4,
  },
  moneyBanner: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  moneyBannerLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  moneyBannerValue: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  moneyBannerHint: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
});

export default OrderDetailsScreen;
