import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { IndexPath, Select, SelectItem } from "@ui-kitten/components";
import { CheckBox } from "@rneui/themed";
import { Button, FormControl, Modal } from "native-base";
import Toast from "react-native-toast-message";

import { createOrder } from "../../api";
import { Customer } from "../../models/customer";
import { OrderCreateInput } from "../../models/order";

interface CreateOrderModalProps {
  isOpen: boolean;
  setShowModal(booleanStatus: boolean): void;
  populateCustomersList(): void;
  customers?: Customer[];
}

const defaultServiceLine = { description: "Service" };

const CreateOrderModal = ({
  isOpen,
  setShowModal,
  populateCustomersList,
  customers = [],
}: CreateOrderModalProps) => {
  const [customerIndex, setCustomerIndex] = useState<IndexPath | IndexPath[]>(
    new IndexPath(0)
  );
  const [deliveryDate, setDeliveryDate] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [retailPrice, setRetailPrice] = useState("0");
  const [deliveryCost, setDeliveryCost] = useState("0");
  const [paymentMade, setPaymentMade] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [isDelivery, setIsDelivery] = useState(false);
  const [driverPaid, setDriverPaid] = useState(false);
  const [warehousePaid, setWarehousePaid] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDeliveryDate("");
      setQuantity("1");
      setRetailPrice("0");
      setDeliveryCost("0");
      setPaymentMade(false);
      setPaymentDate("");
      setIsDelivery(false);
      setDriverPaid(false);
      setWarehousePaid(false);
      setCustomerIndex(new IndexPath(0));
    }
  }, [isOpen]);

  const selectedCustomer = (): Customer | undefined => {
    const idx = Array.isArray(customerIndex)
      ? (customerIndex[0] as IndexPath).row
      : (customerIndex as IndexPath).row;
    return customers[idx];
  };

  const submit = async () => {
    const cust = selectedCustomer();
    if (!cust?.id || !deliveryDate) {
      return;
    }

    const payload: OrderCreateInput = {
      customer_id: String(cust.id),
      delivery_date: deliveryDate,
      delivery_cost: parseFloat(deliveryCost) || 0,
      payment_made: paymentMade,
      payment_date: paymentDate || new Date().toISOString().split("T")[0],
      is_delivery: isDelivery,
      quantity: parseInt(quantity, 10) || 1,
      driver_paid: driverPaid,
      warehouse_paid: warehousePaid,
      retail_price: parseFloat(retailPrice) || 0,
      services: [defaultServiceLine],
    };

    try {
      await createOrder(payload);
      populateCustomersList();
      setShowModal(false);
      Toast.show({ type: "success", text1: "Order created" });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Could not create order",
        text2: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const canSubmit =
    customers.length > 0 && !!deliveryDate && !!selectedCustomer();

  return (
    <Modal isOpen={isOpen} onClose={() => setShowModal(false)}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>New order</Modal.Header>
        <Modal.Body>
          <FormControl isDisabled={customers.length === 0}>
            <FormControl.Label>Customer</FormControl.Label>
            <Select
              selectedIndex={customerIndex}
              value={selectedCustomer()?.name ?? "Select customer"}
              onSelect={(index) => setCustomerIndex(index)}
            >
              {customers.map((c, i) => (
                <SelectItem key={String(c.id ?? i)} title={c.name ?? "Unnamed"} />
              ))}
            </Select>
          </FormControl>

          <FormControl mt={3}>
            <FormControl.Label>Delivery date</FormControl.Label>
            <Pressable onPress={() => setDatePickerVisible(true)}>
              <Text style={styles.dateHint}>
                {deliveryDate || "Choose date"}
              </Text>
            </Pressable>
            <DateTimePickerModal
              isVisible={datePickerVisible}
              onConfirm={(d) => {
                setDeliveryDate(d.toISOString().split("T")[0]);
                setDatePickerVisible(false);
              }}
              onCancel={() => setDatePickerVisible(false)}
            />
          </FormControl>

          <FormControl mt={3}>
            <FormControl.Label>Quantity</FormControl.Label>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
              style={styles.input}
            />
          </FormControl>

          <FormControl mt={3}>
            <FormControl.Label>Retail price</FormControl.Label>
            <TextInput
              value={retailPrice}
              onChangeText={setRetailPrice}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </FormControl>

          <FormControl mt={3}>
            <FormControl.Label>Delivery cost</FormControl.Label>
            <TextInput
              value={deliveryCost}
              onChangeText={setDeliveryCost}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </FormControl>

          <CheckBox
            checked={paymentMade}
            onPress={() => setPaymentMade(!paymentMade)}
          >
            Payment made
          </CheckBox>
          <CheckBox
            checked={isDelivery}
            onPress={() => setIsDelivery(!isDelivery)}
          >
            Delivery
          </CheckBox>
          <CheckBox
            checked={driverPaid}
            onPress={() => setDriverPaid(!driverPaid)}
          >
            Driver paid
          </CheckBox>
          <CheckBox
            checked={warehousePaid}
            onPress={() => setWarehousePaid(!warehousePaid)}
          >
            Warehouse paid
          </CheckBox>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onPress={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button isDisabled={!canSubmit} onPress={submit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dateHint: {
    padding: 10,
    backgroundColor: "#e8eef5",
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
  },
});

export default CreateOrderModal;
