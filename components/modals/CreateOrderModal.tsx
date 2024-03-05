import { useEffect, useState } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { CheckBox } from "@rneui/themed";
import { Button, CheckIcon, FormControl, Modal, Select } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import { createOrder } from "../../api";
import { Chow } from "../../models/chow";
import { findChowVariety } from "../../api/routes/stock";

interface CreateOrderModalProps {
  isOpen: boolean;
  setShowModal(booleanStatus: boolean): void;
  populateCustomersList(): void;
  chow?: Chow[];
  customers?: Customer[];
}

interface ChowDetails {
  chow_id: string;
  brand: string;
  flavour_name: string;
  flavour_id: string;
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
      brand: "",
      flavour_name: "",
      quantity: 1,
      retail_price: null,
    },
  ]);
  const [orderInputs, setOrderInputs] = useState<any>({
    customer_id: "",
    delivery_date: "",
    payment_made: false,
    delivery_cost: 0,
    payment_date: "",
    is_delivery: false,
    driver_paid: false,
    warehouse_paid: false,
  });
  const [selectedChow, setSelectedChow] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [datePickerIsVisible, setDatePickerIsVisible] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const orderInputsPaymentMade = orderInputs.payment_made;
  const orderInputDriverPaid = orderInputs.driver_paid;
  const orderInputIsDelivery = orderInputs.is_delivery;
  const orderInputWarehousePaid = orderInputs.warehouse_paid;

  const closeModal = () => {
    setShowModal(false);
    resetState();
  };

  const resetState = () => {
    setOrderInputs({
      customer_id: "",
      delivery_date: "",
      payment_made: false,
      delivery_cost: 0,
      payment_date: "",
      is_delivery: false,
      driver_paid: false,
      warehouse_paid: false,
    });

    setChowInputs([
      {
        chow_id: "",
        brand: "",
        flavour_name: "",
        quantity: 1,
        retail_price: null,
      },
    ]);

    setSelectedChow("");
    setSelectedCustomer("");
    setSelectedDate(undefined);
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

  const selectedBrand = (chowInputIndex: number) => {
    const filteredChow = chow
      ?.map((brand) => brand)
      .filter((item) => item.brand === chowInputs[chowInputIndex].brand);

    if (filteredChow) {
      return filteredChow[0];
    }
  };

  const selectedFlavour = (chowInputIndex: number, flavour_id: string) => {
    const chow = selectedBrand(chowInputIndex);
    const filteredFlavour = chow?.flavours.filter(
      (flavour) => flavour.flavour_id === flavour_id
    );

    if (filteredFlavour) {
      return filteredFlavour[0];
    }
  };

  const addField = () => {
    const newField = {
      brand: "",
      flavour_id: "",
      chow_id: "",
      quantity: "1",
    };
    setChowInputs([...chowInputs, newField]);
  };

  const removeField = (index: number) => {
    const data = [...chowInputs];
    data.splice(index, 1);

    setChowInputs(data);
  };

  const renderBrandDropdown = () => {
    return chow?.map((item) => {
      return (
        <Select.Item
          label={`${item.brand}`}
          value={`${item.brand}`}
          key={item.brand_id}
        />
      );
    });
  };

  const renderFlavourDropdown = (chowInputIndex: number) => {
    const chow = selectedBrand(chowInputIndex);

    return chow?.flavours.map((flavour) => (
      <Select.Item
        label={flavour.flavour_name}
        value={flavour.flavour_id}
        key={flavour.flavour_id}
      />
    ));
  };

  const renderVarieties = (chowInputIndex: number, flavour_id: string) => {
    const flavour = selectedFlavour(chowInputIndex, flavour_id);

    return flavour?.varieties.map((variety) => (
      <Select.Item
        label={`${variety.size} ${variety.unit}`}
        value={variety.chow_id}
        key={variety.chow_id}
      />
    ));
  };

  const renderDeliveryCost = () => {
    const TEST_DELIVERY_COSTS = [0, 20, 45, 60, 100];

    return TEST_DELIVERY_COSTS.map((price, index) => (
      <Select.Item
        key={`${price}+${index}`}
        value={price}
        label={price.toString()}
      />
    ));
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

  // TODO: fix 'any' typing here, expect this to give problems--The problem is that if i were to pass an interface here, it'd need to iterate through each [value] and have its own unique type
  // Perhaps a for in loop?🤔

  const orderPayload: { [value: string]: any } = {
    // For now. Let's use our state directly to make an API call, but constructing this
    // payload to act like a pseudo-singleton would be really nice.
    customer_id: selectedCustomer,
    chow_array: chowInputs,
    payment_made: orderInputs.payment_made,
    payment_date: orderInputs.payment_made ? new Date() : "Payment Not Made",
    delivery_date: orderInputs.delivery_date,
    is_delivery: orderInputs.is_delivery,
    delivery_cost: orderInputs.delivery_cost,
    driver_paid: orderInputs.driver_paid,
    warehouse_paid: orderInputs.warehouse_paid,
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

  const handleCheckBoxChange = (name: string) => {
    const data = { ...orderInputs };

    data[name] = !data[name];

    setOrderInputs(data);
  };

  const handleDateChange = (date: Date) => {
    const data = { ...orderInputs };
    data["delivery_date"] = date;
    setOrderInputs(data);
  };
  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    handleDateChange(date);
    toggleDatePickerVisibility();
  };

  const handleQuantityChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    index: number,
    name: string
  ) => {
    const data = [...chowInputs];
    const inputValue = event.nativeEvent.text.trim(); // Trim whitespace from input value
    const convertedText = parseInt(inputValue);
    if (!isNaN(convertedText)) {
      data[index][name] = convertedText; // Only update quantity if input is a valid number
    }

    setChowInputs(data);
  };

  const handleChowSelected = async (
    itemValue: string,
    index: number,
    name: string
  ) => {
    setSelectedChow(itemValue);
    const data = [...chowInputs];
    data[index][name] = itemValue;

    if (name === "chow_id") {
      const response = await findChowVariety(itemValue);
      data[index].retail_price = response.retail_price;
      setChowInputs(data);
    }

    setChowInputs(data);
  };

  const handlePriceChange = async (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    index: number,
    name: string
  ) => {
    const data = [...chowInputs];
    data[index][name] = parseInt(event.nativeEvent.text);
    setChowInputs(data);
  };

  const handleCustomerSelected = (itemValue: string) => {
    // setSelectedCustomer(itemValue);
    setSelectedCustomer(itemValue);
    const data = { ...orderInputs };
    data.customer_id = itemValue;
    setOrderInputs(data);
  };

  const handleDeliverySelected = (itemValue: string) => {
    const data = { ...orderInputs };
    data.delivery_cost = parseInt(itemValue);

    setOrderInputs(data);
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
        const { chow_id, quantity, flavour_id, brand, retail_price } =
          chowDetails;
        const { customer_id, delivery_date, payment_date, delivery_cost } =
          orderPayload;

        const newOrderPayload = {
          delivery_date,
          brand,
          payment_date,
          quantity,
          delivery_cost,
          retail_price,
          flavour_id,
          payment_made: orderInputs.payment_made,
          is_delivery: orderInputs.is_delivery,
          driver_paid: orderInputs.driver_paid,
          warehouse_paid: orderInputs.warehouse_paid,
          customer_id,
          chow_id,
        };

        await createOrder(newOrderPayload);
        populateCustomersList();
      })
    ).then(() => {
      closeModal();
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      avoidKeyboard
      _overlay={{ useRNModal: false, useRNModalOnAndroid: false }}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Create Order</Modal.Header>
        <Modal.Body>
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
              pl="4"
              onValueChange={(nextValue) => handleCustomerSelected(nextValue)}
            >
              {chow && renderCustomersDropdown()}
            </Select>
          </View>
          {/* </TouchableWithoutFeedback> */}
          <FormControl.Label>Order Information</FormControl.Label>
          <Pressable onPress={() => toggleDatePickerVisibility()}>
            <Text style={deliveryText}>
              {selectedDate ? (
                <Text>{new Date(selectedDate).toDateString()}</Text>
              ) : (
                "Choose Delivery Date *"
              )}
            </Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={datePickerIsVisible}
            onConfirm={handleDateConfirm}
            onCancel={toggleDatePickerVisibility}
          />

          {/* TODO: fix all the jank. in this case, we need to make our types better */}

          {/* <CheckBox
            title="Is this a delivery?"
            checked={orderInputIsDelivery}
            onPress={() => handleCheckBoxChange("is_delivery")}
          /> */}
          <FormControl.Label>Delivery Cost</FormControl.Label>

          <TouchableWithoutFeedback onPress={() => renderDeliveryCost()}>
            <Select
              minWidth="200"
              selectedValue={orderInputs.delivery_cost}
              accessibilityLabel="Delivery Cost"
              placeholder="Delivery Cost *"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              pl="4"
              onValueChange={(itemValue) => handleDeliverySelected(itemValue)}
            >
              {chow && renderDeliveryCost()}
            </Select>
          </TouchableWithoutFeedback>

          <CheckBox
            title="Has Client Paid for order?"
            checked={orderInputsPaymentMade}
            onPress={() => handleCheckBoxChange("payment_made")}
          />
          <CheckBox
            title="Has the warehouse been paid?"
            checked={orderInputWarehousePaid}
            onPress={() => handleCheckBoxChange("warehouse_paid")}
          />
          <FormControl.Label>Chow Details</FormControl.Label>
          {chowInputs.map((field, index) => {
            return (
              <View key={`${field} + ${index}`}>
                <TouchableWithoutFeedback onPress={renderBrandDropdown}>
                  <Select
                    minWidth="200"
                    selectedValue={chowInputs[index].brand}
                    accessibilityLabel="Choose Brand"
                    placeholder="Choose Brand *"
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size={5} />,
                    }}
                    mt="1"
                    pl="4"
                    onValueChange={(itemValue) =>
                      handleChowSelected(itemValue, index, "brand")
                    }
                    key={field.chow_id}
                  >
                    {chow && renderBrandDropdown()}
                  </Select>
                </TouchableWithoutFeedback>
                {field.brand && (
                  <TouchableWithoutFeedback
                    onPress={() => renderFlavourDropdown(index)}
                  >
                    <Select
                      minWidth="200"
                      selectedValue={chowInputs[index].flavour_id}
                      accessibilityLabel="Choose Flavour"
                      placeholder="Choose Flavour *"
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={5} />,
                      }}
                      mt="1"
                      pl="4"
                      onValueChange={(itemValue) =>
                        handleChowSelected(itemValue, index, "flavour_id")
                      }
                      key={field.chow_id}
                    >
                      {chow && renderFlavourDropdown(index)}
                    </Select>
                  </TouchableWithoutFeedback>
                )}
                {field.flavour_id && (
                  <TouchableWithoutFeedback
                    onPress={() => renderVarieties(index, field.flavour_id)}
                  >
                    <Select
                      minWidth="200"
                      selectedValue={chowInputs[index].chow_id}
                      accessibilityLabel="Choose Size"
                      placeholder="Choose Size *"
                      _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size={5} />,
                      }}
                      mt="1"
                      pl="4"
                      onValueChange={(itemValue) =>
                        handleChowSelected(itemValue, index, "chow_id")
                      }
                      key={field.chow_id}
                    >
                      {chow && renderVarieties(index, field.flavour_id)}
                    </Select>
                  </TouchableWithoutFeedback>
                )}

                <FormControl.Label>Quantity</FormControl.Label>
                <TextInput
                  selectTextOnFocus
                  style={input}
                  placeholder="Quantity *"
                  keyboardType="numeric"
                  onChange={(event) =>
                    handleQuantityChange(event, index, "quantity")
                  }
                  defaultValue={chowInputs[index].quantity.toString()}
                  key={`index: ${index} Quantity `}
                />
                {chowInputs[index].retail_price ? (
                  <>
                    <FormControl.Label>Retail Price</FormControl.Label>
                    <TextInput
                      selectTextOnFocus
                      style={input}
                      placeholder="Retail Price"
                      keyboardType="numeric"
                      onChange={(event) =>
                        handlePriceChange(event, index, "retail_price")
                      }
                      defaultValue={chowInputs[index].retail_price.toString()}
                      key={`index: ${index} retail_price `}
                    />
                  </>
                ) : null}
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
    paddingLeft: 16,
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
