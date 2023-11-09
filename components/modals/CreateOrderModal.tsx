import { useState, useEffect } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInput,
  Text,
  TextInputChangeEventData,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import {
  Button,
  CheckIcon,
  Checkbox,
  FormControl,
  Modal,
  Select,
} from "native-base";
import Icon from "react-native-vector-icons/AntDesign";

import { createOrder } from "../../api";

interface CreateOrderModalProps {
  isOpen: boolean;
  setShowModal(booleanStatus: boolean): void;
  populateCustomersList(): void;
  chow?: Chow[];
  customers?: Customer[];
}

interface ChowDetails {
  chow_id: string;
  quantity: number;
}

const CreateOrderModal = ({
  isOpen,
  setShowModal,
  populateCustomersList,
  chow,
  customers,
}: CreateOrderModalProps) => {
  const [chowInputs, setChowInputs] = useState<any[]>([
    {
      chow_id: "",
      quantity: 1,
    },
  ]);
  const [orderInputs, setOrderInputs] = useState<any>({
    customer_id: "",
    delivery_date: "",
    payment_made: false,
    payment_date: "",
    is_delivery: false,
    driver_paid: false,
    warehouse_paid: false,
  });
  const [selectedChow, setSelectedChow] = useState("");
  const [groupValues, setGroupValues] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [datePickerIsVisible, setDatePickerIsVisible] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  // Loose typing on purpose for now, type SHOULD be Order.
  const [orders, setOrders] = useState<any[]>([{}]);

  const closeModal = () => {
    setShowModal(false);
  };

  const {
    input,
    button,
    buttonContainer,
    confirmationButton,
    confirmationButtonContainer,
    deliveryText,
    required,
    dropdown,
    dropdownContainer,
  } = styles;

  const toggleDatePickerVisibility = () => {
    setDatePickerIsVisible(!datePickerIsVisible);
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    handleDateChange(date);
    toggleDatePickerVisibility();
  };

  const addField = () => {
    let newField = { chow_id: "", quantity: "1" };
    setChowInputs([...chowInputs, newField]);
  };

  const removeField = (index: number) => {
    let data = [...chowInputs];
    data.splice(index, 1);

    setChowInputs(data);
  };

  const renderChowDropdown = () => {
    return chow?.map((item) => {
      return (
        <Select.Item
          label={`${item.brand}: ${item.flavour} - ${item.size}${item.unit}`}
          value={`${item.id}`}
          key={item.id}
        />
      );
    });
  };

  // TODO: fix 'any' typing here, expect this to give problems--The problem is that if i were to pass an interface here, it'd need to iterate through each [value] and have its own unique type
  // Perhaps a for in loop?🤔

  const orderPayload: { [value: string]: any } = {
    // For now. Let's use our state directly to make an API call, but constructing this
    // payload to act like a pseudo-singleton would be really nice.
    customer_id: selectedCustomer,
    chow_array: chowInputs,
    payment_made: false,
    payment_date: "Payment not Made",
    delivery_date: orderInputs.delivery_date,
    is_delivery: false,
    driver_paid: false,
    warehouse_paid: false,
    // add chow object
    // Make it work when making multiple calls. Maybe a loop, or something like Promise.all()
    // This is so that we can make multiple orders of separate chow for one client.
    //TODO: plot out this pseudocode properly:
    // const createOrder = () => {
    //    chow_array.map(chow => {
    //       createOrder({
    //          customer_id: selectedCustomer,
    //          chow_id: chow.chow_id,
    //          quantity: chow.quantity,
    //          ...rest of form details
    //       }
    //    })
    // }
  };

  const renderCustomersDropdown = () => {
    return customers?.map((customer) => {
      return (
        <Select.Item
          key={customer.id}
          label={customer.name}
          value={customer.id}
        />
      );
    });
  };

  const handleCheckboxChange = (values: any) => {
    setGroupValues(values);
  };

  const handleOrderChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    name: string
  ) => {
    let data = { ...orderInputs };
    if (data[name] === "true") {
      data[name] = true;
    } else if (data[name] === "false") {
      data[name] = false;
    } else {
      data[name] = event.nativeEvent.text;
    }

    // console.log({ event: event.nativeEvent.text, data_name: name });
    setOrderInputs(data);
  };

  const handleDateChange = (date: Date) => {
    let data = { ...orderInputs };
    data["delivery_date"] = date;
    setOrderInputs(data);
  };

  // const handleChowChange = (
  //    event: NativeSyntheticEvent<TextInputChangeEventData>,
  //    index: number,
  //    name: string
  // ) => {
  //    let data = [...chowInputs];
  //    // TODO: clean up elifs

  //    data[index][name] = event.nativeEvent.text;

  //    setChowInputs(data);
  // };

  const handleQuantityChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    index: number,
    name: string
  ) => {
    let data = [...chowInputs];
    const inputValue = event.nativeEvent.text.trim(); // Trim whitespace from input value

    if (inputValue === "") {
      data[index][name] = 1; // Set quantity to 1 if input is blank
    } else {
      const convertedText = parseInt(inputValue);
      if (!isNaN(convertedText)) {
        data[index][name] = convertedText; // Only update quantity if input is a valid number
      }
    }

    setChowInputs(data);
  };

  const handleChowSelected = (
    itemValue: string,
    index: number,
    name: string
  ) => {
    setSelectedChow(itemValue);
    let data = [...chowInputs];
    data[index][name] = itemValue;

    setChowInputs(data);
  };

  const handleCustomerSelected = (itemValue: string) => {
    // setSelectedCustomer(itemValue);
    setSelectedCustomer(itemValue);
    const data = { ...orderInputs };
    data.customer_id = itemValue;
    setOrderInputs(data);
    // console.log({ location: "handleCustomerSelected", data });
  };

  const handleOrderCreation = async () => {
    // TODO: Keep as last function before return statement, should take a payload and
    // do stuff™️.
    // Goals: use form inputs to construct a payload which is sent to our api. should lessen
    // code sprawl. Check <CreateCustomerModal /> -- handlePetsChange() (line 56) for
    // reference

    const chowArray = orderPayload.chow_array;

    Promise.all(
      chowArray.map(async (chowDetails: ChowDetails) => {
        const { chow_id, quantity } = chowDetails;
        const {
          customer_id,
          delivery_date,
          payment_made,
          payment_date,
          is_delivery,
          driver_paid,
          warehouse_paid,
        } = orderPayload;

        const newOrderPayload = {
          delivery_date,
          payment_made,
          payment_date,
          is_delivery,
          quantity,
          driver_paid,
          warehouse_paid,
          customer_id,
          chow_id,
        };

        await createOrder(newOrderPayload);
      })
    ).then(() => {
      populateCustomersList();
      closeModal();
    });
  };

  useEffect(() => {
    groupValues.map((value: string) => {
      orderPayload[value] = true;
    });
  }, [groupValues]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} avoidKeyboard>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Create Order</Modal.Header>
        <Modal.Body>
          {/* TODO: Add in differentiation for order-type later */}

          {/* <FormControl isRequired>
                  <FormControl.Label>Order Type</FormControl.Label>
                  <Input
                     onChange={(event) =>
                        handleOrderChange(event, index, "name")
                     }
                  />
               </FormControl>
             */}
          {/* <TouchableWithoutFeedback onPress={renderCustomersDropdown}> */}
          <View>
            <Select
              minWidth="200"
              selectedValue={orderInputs.customer_id}
              accessibilityLabel="Choose Customer"
              placeholder="Choose Customer *"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              onValueChange={(nextValue) => handleCustomerSelected(nextValue)}
            >
              {chow && renderCustomersDropdown()}
            </Select>
          </View>
          {/* </TouchableWithoutFeedback> */}
          <FormControl.Label>Order Information</FormControl.Label>
          <Pressable onPress={() => toggleDatePickerVisibility()}>
            <Text style={deliveryText}>
              Choose Delivery Date <Text>*</Text>
            </Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={datePickerIsVisible}
            onConfirm={handleDateConfirm}
            onCancel={toggleDatePickerVisibility}
          />

          <Checkbox.Group
            onChange={setGroupValues}
            value={groupValues}
            accessibilityLabel="Choose order options"
          >
            <Checkbox value="payment_made">Has client Paid for order?</Checkbox>
            <Checkbox value="driver_paid">Driver Paid?</Checkbox>
            <Checkbox value="warehouse_paid">Warehouse Paid?</Checkbox>
            <Checkbox value="is_delivery">Is This a delivery</Checkbox>
          </Checkbox.Group>

          <FormControl.Label>Chow Details</FormControl.Label>
          {chowInputs.map((field, index) => {
            return (
              <View key={index}>
                <TouchableWithoutFeedback onPress={renderChowDropdown}>
                  <Select
                    minWidth="200"
                    selectedValue={chowInputs[index].chow_id}
                    accessibilityLabel="Choose Chow"
                    placeholder="Choose Chow *"
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size={5} />,
                    }}
                    mt="1"
                    onValueChange={(itemValue) =>
                      handleChowSelected(itemValue, index, "chow_id")
                    }
                    key={field.chow_id}
                  >
                    {chow && renderChowDropdown()}
                  </Select>
                </TouchableWithoutFeedback>

                <TextInput
                  style={input}
                  placeholder="Quantity (Set to 1 by default)"
                  keyboardType="numeric"
                  onChange={(event) =>
                    handleQuantityChange(event, index, "quantity")
                  }
                  defaultValue={chowInputs[index].quantity.toString()}
                  value={field.quantity.toString()}
                  key={`index: ${index} Quantity `}
                />
                <View style={buttonContainer}>
                  <Button
                    style={button}
                    onPress={() => addField()}
                    key={`index: ${index} AddField `}
                  >
                    <Icon
                      name="plus"
                      size={10}
                      key={`index: ${index} PlusIcon `}
                    />
                  </Button>
                  <Button
                    style={button}
                    isDisabled={chowInputs.length <= 1}
                    onPress={() => removeField(index)}
                    key={`index: ${index} RemoveField `}
                  >
                    <Icon
                      name="minus"
                      size={10}
                      key={`index: ${index} MinusIcon `}
                    />
                  </Button>
                </View>
              </View>
            );
          })}
        </Modal.Body>
        <Button.Group space={2} style={confirmationButtonContainer}>
          <Button variant="ghost" onPress={closeModal}>
            Cancel
          </Button>
          <Button
            style={confirmationButton}
            onPress={() => handleOrderCreation()}
            isDisabled={
              !orderInputs.customer_id ||
              !orderInputs.delivery_date ||
              chowInputs.some(
                (chowInput) =>
                  chowInput.chow_id === "" || chowInput.quantity === 0
              )
            }
          >
            Save
          </Button>
        </Button.Group>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
    marginTop: 10,
    paddingLeft: 10,
    width: 270,
    borderRadius: 4,
    backgroundColor: "hsl(240,57%,97%)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
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
  required: {
    color: "red",
  },
  button: {
    width: 40,
    height: 30,
    marginRight: 4,
    backgroundColor: "hsl(213,74%,54%)",
  },
  confirmationButtonContainer: {
    marginBottom: 4,
  },
  confirmationButton: {
    backgroundColor: "hsl(213,74%,54%)",
  },
  dropdown: {
    height: 30,
    paddingLeft: 10,
  },
  dropdownContainer: {
    margin: 5,
    marginBottom: 8,
    marginTop: 0,
    width: 270,
    borderRadius: 4,
  },
});

export default CreateOrderModal;
