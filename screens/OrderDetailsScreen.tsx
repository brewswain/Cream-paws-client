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
import {
  ChowDetails,
  OrderFromSupabase,
  OrderWithChowDetails,
} from "../models/order";
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
      order: OrderFromSupabase;
    };
  };
}

const OrderDetailsScreen = ({ navigation, route }: OrderDetailsProps) => {
  const { order } = route.params;
  const [orderPayload, setOrderPayload] = useState<OrderFromSupabase>(order);
  const [chow, setChow] = useState<Chow[]>();

  const [datePickerIsVisible, setDatePickerIsVisible] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const navigate = useNavigation();
  const populateChowList = async () => {
    const response = await getAllChow();
    setChow(response);
  };
  // TODO: sanitize our inputs

  const selectedBrand = () => {
    const filteredChow = chow
      ?.map((brand) => brand)
      .filter((item) => {
        return parseInt(item.id) === orderPayload.flavours.brand_details.id;
      });

    if (filteredChow) {
      return filteredChow[0];
    }
  };

  const selectedFlavour = () => {
    const chow = selectedBrand();
    const filteredFlavour = chow?.flavours.filter((flavour) => {
      return (
        parseInt(flavour.details.flavour_id) ===
        orderPayload.flavours.details.flavour_id
      );
    });

    if (filteredFlavour) {
      return filteredFlavour[0];
    }
  };

  const renderBrandDropdown = () => {
    return chow?.map((item) => {
      return (
        <Select.Item
          label={`${item.brand_name}`}
          value={item.id}
          key={item.brand_id}
        />
      );
    });
  };

  const renderFlavourDropdown = () => {
    const chow = selectedBrand();

    return chow?.flavours.map((flavour) => (
      <Select.Item
        label={flavour.details.flavour_name}
        value={flavour.details.flavour_id}
        key={flavour.details.flavour_id}
      />
    ));
  };

  const renderVarieties = () => {
    const flavour = selectedFlavour();

    console.log({ flavour });
    return flavour?.details.varieties.map((variety) => {
      return (
        <Select.Item
          label={`${variety.size} ${variety.unit}`}
          value={variety.id}
          key={variety.id}
        />
      );
    });
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

  const toggleDatePickerVisibility = () => {
    setDatePickerIsVisible(!datePickerIsVisible);
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);

    let data = orderPayload;
    data.delivery_date = date.toString();
    setOrderPayload(data);
  };

  //TODO: This needs a **MASSIVE** Refactor. If i'm going this far with excessive specificity
  // in mind, then i should just split these into separate change handlers, as the bloat is
  // crazy rn

  // That being said i'll treat this as a monolith for now, as bad as it feels.
  // const handleChange = async (
  //   name: string,
  //   value: string | number,
  //   selectedIndex: number
  // ) => {
  //   if (name.includes("brand")) {
  //     const response = await findChow(value as string);

  //     setOrderPayload((prevState) => ({
  //       ...prevState,
  //       orders: prevState.orders.map((order, index) => {
  //         if (index === selectedIndex) {
  //           return {
  //             ...order,
  //             chow_details: response as ChowDetails,
  //           };
  //         }
  //         return order;
  //       }),
  //     }));
  //   } else if (name.includes("flavour_name")) {
  //     const foundFlavour = await findChowFlavour(value as string);
  //     if (foundFlavour) {
  //       setOrderPayload((prevState) => ({
  //         ...prevState,
  //         orders: prevState.orders.map((order, index) => {
  //           if (index === selectedIndex) {
  //             return {
  //               ...order,
  //               chow_details: {
  //                 ...order.chow_details,
  //                 flavours: {
  //                   ...foundFlavour,
  //                   varieties: foundFlavour.varieties[0],
  //                 },
  //               },
  //             };
  //           }
  //           return order;
  //         }),
  //       }));
  //     }
  //   } else if (name.includes("chow_id")) {
  //     const foundVariety = await findChowVariety(value as string);

  //     setOrderPayload((prevState) => ({
  //       ...prevState,
  //       orders: prevState.orders.map((order, index) => {
  //         if (index === selectedIndex) {
  //           return {
  //             ...order,
  //             chow_details: {
  //               ...order.chow_details,
  //               flavours: {
  //                 ...order.chow_details.flavours,
  //                 varieties: foundVariety,
  //               },
  //             },
  //           };
  //         }
  //         return order;
  //       }),
  //     }));
  //   } else if (name.includes("retail_price")) {
  //     setOrderPayload((prevState) => ({
  //       ...prevState,
  //       orders: prevState.orders.map((order, index) => {
  //         if (index === selectedIndex) {
  //           return {
  //             ...order,
  //             chow_details: {
  //               ...order.chow_details,
  //               flavours: {
  //                 ...order.chow_details.flavours,
  //                 varieties: {
  //                   ...order.chow_details.flavours.varieties,
  //                   retail_price: parseInt(value),
  //                 },
  //               },
  //             },
  //           };
  //         }
  //         return order;
  //       }),
  //     }));
  //   } else {
  //     setOrderPayload((prevState) => ({
  //       ...prevState,
  //       orders: prevState.orders.map((order, index) => {
  //         if (index === selectedIndex) {
  //           return {
  //             ...order,
  //             [name]: value,
  //           };
  //         }
  //         return order;
  //       }),
  //     }));
  //   }
  // };

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

  useEffect(() => {
    populateChowList();
  }, []);

  const isPayloadMissingDetails =
    !order.flavours.brand_details.name ||
    !order.flavours ||
    !order.flavours.details.varieties ||
    !order.quantity ||
    order.quantity < 1 ||
    !orderPayload.delivery_date;

  const formattedDeliveryDate = formatDate(orderPayload.delivery_date);

  const chowFields = (index: number) => [
    {
      title: "Quantity",
      content: order.quantity,
      name: "quantity",
    },
  ];

  // const costsFields: SubFields[] = [
  //   {
  //     title: "Retail Price",
  //     content: currentOrder.chow_details.flavours.varieties.retail_price,
  //     name: "currentOrder.chow_details.flavours.varieties.retail_price",
  //     type: "numeric",
  //   },
  // ];
  return (
    <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
      <View key={order.id}>
        <View style={styles.container}>
          {/* Checkmarks like Driver Paid, etc */}
          <Text
            style={{ fontSize: 26, textAlign: "center", fontWeight: "600" }}
          >
            {order.customers.name}
          </Text>
          <TouchableWithoutFeedback onPress={renderBrandDropdown}>
            <Select
              minWidth="200"
              selectedValue={orderPayload.flavours.brand_details.id}
              accessibilityLabel="Choose Brand"
              placeholder="Choose Brand *"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              onValueChange={(itemValue) => {
                let data = orderPayload;
                data.flavours.brand_details.id = parseInt(itemValue);

                setOrderPayload(data);
              }}
              key={order.flavours.brand_details.id}
            >
              {chow && renderBrandDropdown()}
            </Select>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => renderFlavourDropdown()}>
            <Select
              minWidth="200"
              selectedValue={orderPayload.flavours.details.flavour_id}
              accessibilityLabel="Choose Flavour"
              placeholder="Choose Flavour *"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              onValueChange={(itemValue) => {
                let data = orderPayload;
                data.flavours.details.flavour_id = parseInt(itemValue);
                setOrderPayload(data);
              }}
            >
              {selectedBrand() && renderFlavourDropdown()}
            </Select>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              renderVarieties();
            }}
          >
            <Select
              minWidth="200"
              selectedValue={orderPayload.flavours.details.varieties[0].id}
              accessibilityLabel="Choose Size"
              placeholder="Choose Size *"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              onValueChange={(itemValue) => {
                let data = orderPayload;
                data.flavours.details.varieties[0].id = parseInt(itemValue);

                setOrderPayload(data);
              }}
            >
              {selectedFlavour() && renderVarieties()}
            </Select>
          </TouchableWithoutFeedback>
          {/* {renderDetailInputs(chowFields(index), handleChange, index)} */}

          <Header>Quantity</Header>
          <TextInput
            onChangeText={(value) =>
              setOrderPayload({ ...order, quantity: parseInt(value) })
            }
            selectTextOnFocus
            style={[
              styles.customInput,
              { maxWidth: "15%", textAlign: "center" },
            ]}
            keyboardType="numeric"
            selectTextOnFocus
          >
            {orderPayload.quantity}
          </TextInput>

          <View style={{ marginVertical: 6 }}>
            <Header>Delivery Cost</Header>
            <TouchableWithoutFeedback onPress={() => renderDeliveryCost()}>
              <Select
                minWidth="200"
                selectedValue={orderPayload.delivery_cost}
                accessibilityLabel="Delivery Cost"
                placeholder="Delivery Cost"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />,
                }}
                mt="1"
                onValueChange={(itemValue) =>
                  setOrderPayload({
                    ...order,
                    delivery_cost: parseInt(itemValue),
                  })
                }
                key={orderPayload.id}
              >
                {renderDeliveryCost()}
              </Select>
            </TouchableWithoutFeedback>
          </View>

          <Header>Delivery Date</Header>

          <Pressable onPress={() => toggleDatePickerVisibility()}>
            <Text style={styles.deliveryText}>
              {selectedDate ? (
                <Text>{new Date(selectedDate).toDateString()}</Text>
              ) : orderPayload.delivery_date ? (
                <Text>{formattedDeliveryDate}</Text>
              ) : (
                "Choose Delivery Date *"
              )}
            </Text>
          </Pressable>

          <DateTimePickerModal
            isVisible={datePickerIsVisible}
            onConfirm={(date) => {
              handleDateConfirm(date);
            }}
            onCancel={toggleDatePickerVisibility}
          />
          {/* TODO:  Add driver fees here: remember that we want a dropdown of 4 different delivery fees */}
        </View>
        <Header>Costs</Header>
        {/* {renderDetailInputs(costsFields, handleChange)} */}
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
            // onPress={() => handleUpdate(index)}
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
            // onPress={() => handleDelete(index)}
          >
            Delete Order
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
  deliveryText: {
    backgroundColor: "hsl(213,74%,54%)",
    padding: 10,
    fontSize: 16,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
    borderRadius: 4,
  },
});

export default OrderDetailsScreen;
