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
import { IndexPath, Layout, Select, SelectItem } from "@ui-kitten/components";

import { CheckBox } from "@rneui/themed";
import { Button, CheckIcon, FormControl, Modal } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import { createOrder } from "../../api";
import { ChowFromSupabase } from "../../models/chow";
import { findChowVariety } from "../../api/routes/stock";
import { Customer } from "../../models/customer";
import { OrderFromSupabasePayload, OrderPayload } from "../../models/order";

interface CreateOrderModalProps {
  isOpen: boolean;
  setShowModal(booleanStatus: boolean): void;
  populateCustomersList(): void;
  chow?: ChowFromSupabase[];
  customers?: Customer[];
}

interface ChowDetails {
  brand_id: number;
  flavour_id: number;
  variety_id: number;
  quantity: number;
}

interface ChowInput {
  brand_id: number;
  flavour_id: number;
  variety_id: number;
  quantity: number;
  brand_name: string;
  flavour_name: string;
  size: number;
  unit: "lb" | "kg" | "oz";
  retail_price?: number;
}

interface OrderInput {
  customer_id: number;
  delivery_cost: number;
  customer_name: string;
  delivery_date: string;
  payment_made: boolean;
  payment_date: string;
  is_delivery: boolean;
  driver_paid: boolean;
  warehouse_paid: boolean;
}

const CreateOrderModal = ({
  isOpen,
  setShowModal,
  populateCustomersList,
  chow,
  customers,
}: CreateOrderModalProps) => {
  const [chowInputs, setChowInputs] = useState<ChowInput[]>([
    {
      brand_id: 0,
      flavour_id: 0,
      variety_id: 0,
      quantity: 1,
      brand_name: "",
      flavour_name: "",
      size: 0,
      unit: "lb",
    },
  ]);
  const [orderInputs, setOrderInputs] = useState<OrderInput>({
    customer_id: 0,
    customer_name: "",
    delivery_date: "",
    payment_made: false,
    delivery_cost: 0,
    payment_date: "",
    is_delivery: false,
    driver_paid: false,
    warehouse_paid: false,
  });
  const [selectedChow, setSelectedChow] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<number>();
  const [datePickerIsVisible, setDatePickerIsVisible] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState<
    IndexPath | IndexPath[]
  >(new IndexPath(0));
  const [selectedDeliveryCostIndex, setSelectedDeliveryCostIndex] = useState<
    IndexPath | IndexPath[]
  >(new IndexPath(0));
  const [selectedBrandIndex, setSelectedBrandIndex] = useState<
    IndexPath | IndexPath[]
  >(new IndexPath(0));
  const [selectedFlavourIndex, setSelectedFlavourIndex] = useState<
    IndexPath | IndexPath[]
  >(new IndexPath(0));
  const [selectedVarietyIndex, setSelectedVarietyIndex] = useState<
    IndexPath | IndexPath[]
  >(new IndexPath(0));

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
      customer_id: 0,
      customer_name: "",
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
        brand_id: 0,
        flavour_id: 0,
        variety_id: 0,
        quantity: 1,
        brand_name: "",
        flavour_name: "",
        size: 0,
        unit: "lb",
      },
    ]);

    setSelectedChow("");
    setSelectedCustomer(0);
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
      ?.map((brand_name) => brand_name)
      .filter((item) => item.id === chowInputs[chowInputIndex].brand_id);

    if (filteredChow) {
      return filteredChow[0];
    }
  };

  const selectedFlavour = (chowInputIndex: number, flavour_id: number) => {
    const chow = selectedBrand(chowInputIndex);

    const filteredFlavour = chow?.flavours.filter(
      (flavour) => flavour.flavour_id === flavour_id
    );

    if (filteredFlavour) {
      return filteredFlavour[0];
    }
  };

  const addField = () => {
    const newField: ChowInput = {
      brand_id: 0,
      flavour_id: 0,
      variety_id: 0,
      quantity: 1,
      brand_name: "",
      flavour_name: "",
      size: 0,
      unit: "lb",
    };
    setChowInputs([...chowInputs, newField]);
  };

  const removeField = (index: number) => {
    const data = [...chowInputs];
    data.splice(index, 1);

    setChowInputs(data);
  };

  const renderBrandDropdown = (fieldIndex: number) => {
    if (!chow) {
      return;
    }
    return chow.map((brand, index) => {
      return (
        <SelectItem
          key={index}
          title={brand.brand_name}
          onPressIn={() => {
            let data = [...chowInputs];
            const currentBrand = data[fieldIndex];
            currentBrand.brand_id = brand.id;
            currentBrand.brand_name = brand.brand_name;

            setChowInputs(data);
          }}
        />
      );
    });
  };

  const renderFlavourDropdown = (fieldIndex: number) => {
    const chow = selectedBrand(fieldIndex);

    return chow?.flavours.map((flavour, index) => (
      <SelectItem
        key={index}
        title={flavour.flavour_name}
        onPressIn={() => {
          let data = [...chowInputs];
          const currentFlavour = data[fieldIndex];
          currentFlavour.flavour_id = flavour.flavour_id;
          currentFlavour.flavour_name = flavour.flavour_name;

          setChowInputs(data);
        }}
      />
    ));
  };

  const renderVarieties = (fieldIndex: number, flavour_id: number) => {
    const flavour = selectedFlavour(fieldIndex, flavour_id);

    return flavour?.varieties.map((variety, index) => {
      return (
        <SelectItem
          key={index}
          title={`${variety.size} ${variety.unit}`}
          onPressIn={() => {
            let data = [...chowInputs];
            const currentVariety = data[fieldIndex];
            currentVariety.variety_id = variety.id!;
            currentVariety.size = variety.size;
            currentVariety.unit = variety.unit;

            setChowInputs(data);
          }}
        />
      );
    });
  };

  const renderDeliveryCost = () => {
    const TEST_DELIVERY_COSTS = ["0", 20, 45, 60, 100];

    return TEST_DELIVERY_COSTS.map((price, index) => (
      <SelectItem key={index} title={price} onPressIn={() => {}} />
    ));
  };

  const renderCustomersDropdown = () => {
    return customers?.map((customer, index) => {
      return (
        <SelectItem
          key={index}
          title={customer.name ? customer.name : "N/A"}
          onPressIn={() => {
            handleCustomerSelected(customer.id, customer.name || "N/A");
          }}
        />
      );
    });
  };

  // TODO: fix 'any' typing here, expect this to give problems--The problem is that if i were to pass an interface here, it'd need to iterate through each [value] and have its own unique type
  // Perhaps a for in loop?🤔

  // const orderPayload: OrderFromSupabasePayload = {
  const orderPayload: { [value: string]: any } = {
    // For now. Let's use our state directly to make an API call, but constructing this
    // payload to act like a pseudo-singleton would be really nice.
    customer_id: Number(selectedCustomer),
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

  const handleCheckBoxChange = (field: string) => {
    switch (field) {
      case "payment_made":
        setOrderInputs((prevInput) => ({
          ...prevInput,
          payment_made: !prevInput.payment_made,
        }));
        break;
      case "is_delivery":
        setOrderInputs((prevInput) => ({
          ...prevInput,
          is_delivery: !prevInput.is_delivery,
        }));
        break;
      case "driver_paid":
        setOrderInputs((prevInput) => ({
          ...prevInput,
          driver_paid: !prevInput.driver_paid,
        }));
        break;
      case "warehouse_paid":
        setOrderInputs((prevInput) => ({
          ...prevInput,
          warehouse_paid: !prevInput.warehouse_paid,
        }));
        break;
      default:
        console.error("Invalid field parameter");
    }
  };

  const handleDateChange = (date: Date) => {
    const data = { ...orderInputs };
    data.delivery_date = date.toString();
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
      data[index].quantity = convertedText; // Only update quantity if input is a valid number
    }

    setChowInputs(data);
  };

  const handlePriceChange = async (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    index: number,
    name: string
  ) => {
    const data = [...chowInputs];
    data[index].retail_price = parseInt(event.nativeEvent.text);
    setChowInputs(data);
  };

  const handleCustomerSelected = (customerId: number, customerName: string) => {
    setSelectedCustomer(customerId);

    setOrderInputs({
      ...orderInputs,
      customer_id: customerId,
      customer_name: customerName,
    });
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
        const newOrderPayload: OrderPayload = {
          brand_id: chowDetails.brand_id,
          flavour_id: chowDetails.flavour_id,
          variety_id: chowDetails.variety_id,
          quantity: chowDetails.quantity,

          customer_id: orderPayload.customer_id,
          delivery_date: orderPayload.delivery_date,
          delivery_cost: orderPayload.delivery_cost,
          payment_date: orderPayload.payment_date,

          payment_made: orderInputs.payment_made,
          is_delivery: orderInputs.is_delivery,
          driver_paid: orderInputs.driver_paid,
          warehouse_paid: orderInputs.warehouse_paid,
        };

        await createOrder(newOrderPayload);
        closeModal();
        populateCustomersList();
      })
    );
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
              selectedIndex={selectedCustomerIndex}
              value={
                orderInputs.customer_name
                  ? orderInputs.customer_name
                  : "Choose Customer *"
              }
              accessibilityLabel="Choose Customer"
              onSelect={(index) => setSelectedCustomerIndex(index)}
            >
              {renderCustomersDropdown()}
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
              selectedIndex={selectedDeliveryCostIndex}
              value={
                orderInputs.delivery_cost
                  ? orderInputs.delivery_cost
                  : "Choose Delivery Cost *"
              }
              accessibilityLabel="Choose Delivery Cost"
              onSelect={(index) => setSelectedDeliveryCostIndex(index)}
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
              <View key={index}>
                <TouchableWithoutFeedback>
                  <Select
                    selectedIndex={selectedBrandIndex}
                    value={
                      chowInputs[index].brand_name
                        ? chowInputs[index].brand_name
                        : "Choose Brand *"
                    }
                    accessibilityLabel="Choose Brand"
                    onSelect={(index) => setSelectedBrandIndex(index)}
                  >
                    {chow && renderBrandDropdown(index)}
                  </Select>
                </TouchableWithoutFeedback>

                {field.brand_id ? (
                  <TouchableWithoutFeedback>
                    <Select
                      selectedIndex={selectedFlavourIndex}
                      value={
                        chowInputs[index].flavour_name
                          ? chowInputs[index].flavour_name
                          : "Choose Flavour *"
                      }
                      accessibilityLabel="Choose Flavour"
                      onSelect={(index) => setSelectedFlavourIndex(index)}
                    >
                      {renderFlavourDropdown(index)}
                    </Select>
                  </TouchableWithoutFeedback>
                ) : null}
                {field.flavour_id ? (
                  <TouchableWithoutFeedback
                    onPress={() => renderVarieties(index, field.flavour_id)}
                  >
                    <Select
                      selectedIndex={selectedVarietyIndex}
                      value={
                        chowInputs[index].size && chowInputs[index].unit
                          ? `${chowInputs[index].size} ${chowInputs[index].unit}`
                          : "Choose Variety"
                      }
                      accessibilityLabel="Choose Variety"
                      onSelect={(index) => setSelectedVarietyIndex(index)}
                    >
                      {chow && renderVarieties(index, field.flavour_id)}
                    </Select>
                  </TouchableWithoutFeedback>
                ) : null}

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
                />
                {/* {chowInputs[index].retail_price ? (
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
                    />
                  </>
                ) : null} */}
                <View style={buttonContainer}>
                  <Button style={button} onPress={() => addField()}>
                    <Icon name="plus" size={10} />
                  </Button>
                  <Button
                    style={button}
                    isDisabled={chowInputs.length <= 1}
                    onPress={() => removeField(index)}
                  >
                    <Icon name="minus" size={10} />
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
              !orderPayload.customer_id ||
              !orderPayload.delivery_date ||
              !orderPayload.chow_array
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
