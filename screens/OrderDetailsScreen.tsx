import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Button, CheckIcon, Divider, ScrollView, Select } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { getAllChow, updateOrder } from "../api";
import {
  CustomInput,
  Header,
  SubFields,
  SubHeader,
  renderDetailInputs,
} from "../components/details/DetailScreenComponents";
import { RootTabScreenProps } from "../types";
import { ChowDetails, OrderWithChowDetails } from "../models/order";
import { clearCustomerOrders } from "../utils/orderUtils";
import { Chow } from "../models/chow";
import {
  findChow,
  findChowFlavour,
  findChowVariety,
} from "../api/routes/stock";

interface CustomerOrderDetails extends OrderWithChowDetails {
  client_name: string;
  chow_id: string;
  delivery_date: string;
}
interface OrderDetailsProps {
  navigation: RootTabScreenProps<"OrderDetails">;
  route: {
    params: {
      client_name: string;
      delivery_date: string;
      customer_id: string;
      orders: CustomerOrderDetails[];
    };
  };
}

const OrderDetailsScreen = ({ navigation, route }: OrderDetailsProps) => {
  const [orderPayload, setOrderPayload] = useState({
    ...route.params,
    // id: route.params._id || "unknown id",
  });
  const [chow, setChow] = useState<Chow[]>();

  const [datePickerIsVisible, setDatePickerIsVisible] =
    useState<boolean>(false);

  const navigate = useNavigation();
  const populateChowList = async () => {
    const response = await getAllChow();
    setChow(response);
  };
  // TODO: sanitize our inputs

  const selectedBrand = (chowInputIndex: number) => {
    const filteredChow = chow
      ?.map((brand) => brand)
      .filter(
        (item) =>
          item.brand === orderPayload.orders[chowInputIndex].chow_details.brand
      );

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

  const renderBrandDropdown = () => {
    return chow?.map((item) => {
      return (
        <Select.Item
          label={`${item.brand}`}
          value={item.brand_id}
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

    return flavour?.varieties.map((variety) => {
      return (
        <Select.Item
          label={`${variety.size} ${variety.unit}`}
          value={variety.chow_id || "not found"}
          key={variety.chow_id || "not found"}
        />
      );
    });
  };

  const renderDeliveryCost = () => {
    const TEST_DELIVERY_COSTS = [1, 2, 3, 4];

    return TEST_DELIVERY_COSTS.map((price, index) => (
      <Select.Item
        key={`${price}+${index}`}
        value={price}
        label={price.toString()}
      />
    ));
  };

  const toggleDatePickerVisibility = () => {
    setDatePickerIsVisible(!datePickerIsVisible);
  };

  const handleDateConfirm = (date: Date, selectedIndex: number) => {
    setOrderPayload((prevState) => ({
      ...prevState,
      orders: prevState.orders.map((order, index) => {
        if (index === selectedIndex) {
          return {
            ...order,
            delivery_date: date.toString(),
          };
        }
        return order;
      }),
    }));
    toggleDatePickerVisibility();
  };

  //TODO: This needs a **MASSIVE** Refactor. If i'm going this far with excessive specificity
  // in mind, then i should just split these into separate change handlers, as the bloat is
  // crazy rn

  // That being said i'll treat this as a monolith for now, as bad as it feels.
  const handleChange = async (
    name: string,
    value: string | number,
    selectedIndex: number
  ) => {
    if (name.includes("brand")) {
      const response = await findChow(value as string);

      setOrderPayload((prevState) => ({
        ...prevState,
        orders: prevState.orders.map((order, index) => {
          if (index === selectedIndex) {
            return {
              ...order,
              chow_details: response as ChowDetails,
            };
          }
          return order;
        }),
      }));
    } else if (name.includes("flavour_name")) {
      const foundFlavour = await findChowFlavour(value as string);
      if (foundFlavour) {
        setOrderPayload((prevState) => ({
          ...prevState,
          orders: prevState.orders.map((order, index) => {
            if (index === selectedIndex) {
              return {
                ...order,
                chow_details: {
                  ...order.chow_details,
                  flavours: {
                    ...foundFlavour,
                    varieties: foundFlavour.varieties[0],
                  },
                },
              };
            }
            return order;
          }),
        }));
      }
    } else if (name.includes("chow_id")) {
      const foundVariety = await findChowVariety(value as string);

      setOrderPayload((prevState) => ({
        ...prevState,
        orders: prevState.orders.map((order, index) => {
          if (index === selectedIndex) {
            return {
              ...order,
              chow_details: {
                ...order.chow_details,
                flavours: {
                  ...order.chow_details.flavours,
                  varieties: foundVariety,
                },
              },
            };
          }
          return order;
        }),
      }));
    } else if (name.includes("retail_price")) {
      setOrderPayload((prevState) => ({
        ...prevState,
        orders: prevState.orders.map((order, index) => {
          if (index === selectedIndex) {
            return {
              ...order,
              chow_details: {
                ...order.chow_details,
                flavours: {
                  ...order.chow_details.flavours,
                  varieties: {
                    ...order.chow_details.flavours.varieties,
                    retail_price: parseInt(value),
                  },
                },
              },
            };
          }
          return order;
        }),
      }));
    } else {
      setOrderPayload((prevState) => ({
        ...prevState,
        orders: prevState.orders.map((order, index) => {
          if (index === selectedIndex) {
            return {
              ...order,
              [name]: value,
            };
          }
          return order;
        }),
      }));
    }
  };

  const handleUpdate = async (index: number) => {
    const selectedOrder = {
      ...orderPayload,
      ...orderPayload.orders[index],
    };
    delete selectedOrder.orders;

    await updateOrder(selectedOrder);
    navigate.goBack();
  };

  const handleDelete = async (index: number) => {
    const deleteCustomerOrderPayload = [
      {
        order_id: orderPayload.orders[index].order_id,
        customer_id: orderPayload.customer_id,
      },
    ];

    await clearCustomerOrders(deleteCustomerOrderPayload);
    navigate.goBack();
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toDateString();

    return formattedDate;
  };

  const chowFields = (index: number) => [
    {
      title: "Quantity",
      content: orderPayload.orders[index].quantity,
      name: "quantity",
    },
  ];

  useEffect(() => {
    populateChowList();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
      {orderPayload.orders.map((order, index: number) => {
        const currentOrder = orderPayload.orders[index];
        const isPayloadMissingDetails =
          !currentOrder.chow_details.brand ||
          !currentOrder.chow_details.flavours ||
          !currentOrder.chow_details.flavours.varieties ||
          !currentOrder.quantity ||
          currentOrder.quantity < 1 ||
          !orderPayload.delivery_date;

        const formattedDeliveryDate = formatDate(currentOrder.delivery_date);

        // Check if `currentOrder.chow_details.flavours` is an array
        const availableChowId = Array.isArray(
          currentOrder.chow_details.flavours
        )
          ? // If it's an array, access the first element's `varieties` property
            currentOrder.chow_details.flavours[0].varieties[0].chow_id
          : // If it's not an array, check if `currentOrder.chow_details.flavours.varieties` is an array
          Array.isArray(currentOrder.chow_details.flavours.varieties)
          ? // If `varieties` is an array, access the first element's `chow_id` property
            currentOrder.chow_details.flavours.varieties[0].chow_id
          : // If neither `flavours` nor `varieties` is an array, directly access the `chow_id` property
            currentOrder.chow_details.flavours.varieties.chow_id;

        const costsFields: SubFields[] = [
          {
            title: "Retail Price",
            content: currentOrder.chow_details.flavours.varieties.retail_price,
            name: "currentOrder.chow_details.flavours.varieties.retail_price",
            type: "numeric",
          },
        ];

        return (
          <>
            <View style={styles.container}>
              {/* Checkmarks like Driver Paid, etc */}
              <Text
                style={{ fontSize: 26, textAlign: "center", fontWeight: "600" }}
              >
                {index === 0 ? orderPayload.client_name : <Divider />}
              </Text>
              <TouchableWithoutFeedback onPress={renderBrandDropdown}>
                <Select
                  minWidth="200"
                  selectedValue={currentOrder.chow_details.brand_id}
                  accessibilityLabel="Choose Brand"
                  placeholder="Choose Brand *"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(itemValue) =>
                    // handleChowSelected(itemValue, index, "brand")
                    handleChange("chow_details.brand", itemValue, index)
                  }
                  key={`${currentOrder.chow_id} - brand`}
                >
                  {chow && renderBrandDropdown()}
                </Select>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => renderFlavourDropdown(index)}
              >
                <Select
                  minWidth="200"
                  selectedValue={currentOrder.chow_details.flavours.flavour_id}
                  accessibilityLabel="Choose Flavour"
                  placeholder="Choose Flavour *"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(itemValue) =>
                    handleChange(
                      "chow_details.flavours.flavour_name",
                      itemValue,
                      index
                    )
                  }
                  key={`${currentOrder.chow_id} - flavour`}
                >
                  {renderFlavourDropdown(index)}
                </Select>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  renderVarieties(
                    index,
                    currentOrder.chow_details.flavours.flavour_id
                  )
                }
              >
                <Select
                  minWidth="200"
                  selectedValue={availableChowId}
                  accessibilityLabel="Choose Size"
                  placeholder="Choose Size *"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt="1"
                  onValueChange={(itemValue) =>
                    handleChange(
                      "chow_details.flavours.varieties.chow_id",
                      itemValue,
                      index
                    )
                  }
                  key={`${currentOrder.chow_id} - variety`}
                >
                  {!!currentOrder.chow_details.flavours.flavour_id &&
                    renderVarieties(
                      index,
                      currentOrder.chow_details.flavours.flavour_id
                    )}
                </Select>
              </TouchableWithoutFeedback>
              {/* {renderDetailInputs(chowFields(index), handleChange, index)} */}

              <Header>Quantity</Header>
              <TextInput
                onChangeText={(value) => handleChange("quantity", value, index)}
                style={[
                  styles.customInput,
                  { maxWidth: "15%", textAlign: "center" },
                ]}
                keyboardType="numeric"
                selectTextOnFocus
              >
                {orderPayload.orders[index].quantity}
              </TextInput>

              <View style={{ marginVertical: 6 }}>
                <Header>Delivery Cost</Header>
                <TouchableWithoutFeedback onPress={() => renderDeliveryCost()}>
                  <Select
                    minWidth="200"
                    selectedValue={currentOrder.delivery_cost}
                    accessibilityLabel="Delivery Cost"
                    placeholder="Delivery Cost"
                    _selectedItem={{
                      bg: "teal.600",
                      endIcon: <CheckIcon size={5} />,
                    }}
                    mt="1"
                    onValueChange={(itemValue) =>
                      handleChange("delivery_cost", itemValue, index)
                    }
                    key={`${currentOrder.order_id} - delivery_cost - ${index}`}
                  >
                    {renderDeliveryCost()}
                  </Select>
                </TouchableWithoutFeedback>
              </View>

              <Header>Delivery Date</Header>
              {/*  ignore this error till we implement the date-selector */}
              {/* @ts-ignore */}

              <Pressable onPress={() => toggleDatePickerVisibility()}>
                <CustomInput
                  name="delivery_date"
                  customStyle={styles.customInput}
                >
                  {formattedDeliveryDate}
                </CustomInput>
                {/* <Text>
                  Choose Delivery Date <Text>*</Text>
                </Text> */}
              </Pressable>

              <DateTimePickerModal
                isVisible={datePickerIsVisible}
                onConfirm={(date) => handleDateConfirm(date, index)}
                onCancel={toggleDatePickerVisibility}
              />
              {/* TODO:  Add driver fees here: remember that we want a dropdown of 4 different delivery fees */}
            </View>
            <Header>Costs</Header>
            {renderDetailInputs(costsFields, handleChange)}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Button
                disabled={isPayloadMissingDetails}
                colorScheme={isPayloadMissingDetails ? "trueGray" : "teal"}
                style={{
                  marginTop: 20,
                  width: 150,
                  alignSelf: "center",
                }}
                onPress={() => handleUpdate(index)}
              >
                Update Order
              </Button>
              <Button
                colorScheme="danger"
                style={{
                  marginTop: 20,
                  width: 150,
                  alignSelf: "center",
                }}
                onPress={() => handleDelete(index)}
              >
                Delete Order
              </Button>
            </View>
          </>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    paddingLeft: 12,
    marginHorizontal: 8,
    marginTop: 4,
  },
  customInput: {
    color: "black",
    borderWidth: 0,
    width: "40%",
    borderBottomWidth: 1,
    borderRadius: 0,
    marginHorizontal: 0,
    marginBottom: 10,
  },
});

export default OrderDetailsScreen;
