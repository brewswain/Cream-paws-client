import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import {
  Button,
  CheckIcon,
  ScrollView,
  //  Select`
} from "native-base";
import { IndexPath, Layout, Select, SelectItem } from "@ui-kitten/components";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { getAllChow, updateOrder } from "../api";
import { Header } from "../components/details/DetailScreenComponents";
import { RootTabScreenProps } from "../types";
import {
  ChowDetails,
  OrderFromSupabase,
  OrderWithChowDetails,
} from "../models/order";
import { clearCustomerOrders } from "../utils/orderUtils";
import {
  ChosenFlavour,
  ChosenVariety,
  Chow,
  ChowFromSupabase,
} from "../models/chow";

import Dinero from "dinero.js";

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
  const [chow, setChow] = useState<ChowFromSupabase[]>();
  const [chosenVariety, setChosenVariety] = useState<
    ChosenVariety | undefined
  >();
  const [chosenFlavour, setChosenFlavour] = useState<
    ChosenFlavour | undefined
  >();
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(
    new IndexPath(0)
  );

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
        return item.id === orderPayload.flavours.brand_details.id;
      });

    if (filteredChow) {
      return filteredChow[0];
    }
  };

  const selectedFlavour = () => {
    const chow = selectedBrand();
    const filteredFlavour = chow?.flavours.filter((flavour) => {
      return flavour.flavour_id === orderPayload.flavours.details.flavour_id;
    });

    if (filteredFlavour) {
      return filteredFlavour[0] as ChosenFlavour;
    }
  };

  const renderBrandDropdown = () => {
    return chow?.map((brand, index) => {
      // using index for key since our brand information isn't unique-- multiple entities can use the same brand
      return (
        <SelectItem
          key={index}
          title={brand.brand_name}
          onPressIn={() =>
            setOrderPayload({
              ...orderPayload,
              flavours: {
                ...orderPayload.flavours,
                brand_details: {
                  id: brand.id,
                  name: brand.brand_name,
                },
              },
            })
          }
        />
      );
    });
  };

  console.log({ orderPayload });

  const renderFlavourDropdown = () => {
    const chow = selectedBrand();
    return chow?.flavours.map((flavour, index) => (
      <SelectItem
        key={index}
        title={flavour.flavour_name}
        key={flavour.flavour_id}
      />
    ));
  };

  const renderVarieties = () => {
    const flavour = selectedFlavour();
    return flavour?.varieties.map((variety) => {
      return (
        <Select.Item
          label={`${variety.size} ${variety.unit}`}
          value={variety.id ? variety.id : "Variety ID not found"}
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
        label={Dinero({
          amount: Math.round(price * 100 || 0),
        }).toFormat("$0,0.00")}
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

  useEffect(() => {
    console.log({ chosenFlavour, chosenVariety, orderPayload });
  }, [chosenFlavour, chosenVariety, orderPayload]);

  const isPayloadMissingDetails =
    !orderPayload.flavours.brand_details.name ||
    !orderPayload.flavours ||
    !orderPayload.variety ||
    !orderPayload.quantity ||
    orderPayload.quantity < 1 ||
    !orderPayload.delivery_date;

  const formattedDeliveryDate = formatDate(orderPayload.delivery_date);

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
            <Layout>
              <Select
                selectedIndex={selectedIndex}
                value={orderPayload.flavours.brand_details.name}
                onSelect={(index) => setSelectedIndex(index)}
              >
                {chow && renderBrandDropdown()}
              </Select>
            </Layout>
            {/* <Select
              minWidth="200"
              selectedValue={
                orderPayload.flavours.brand_details.id
                  ? orderPayload.flavours.brand_details.id
                  : undefined
              }
              defaultValue=""
              accessibilityLabel="Choose Brand"
              placeholder="Choose Brand *"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              onValueChange={(itemValue) => {
                const filteredChow = chow
                  ?.map((brand) => brand)
                  .filter((item) => {
                    return item.id === Number(itemValue);
                  });

                // let data = orderPayload;
                // data.flavours.brand_details.id = parseInt(itemValue);
                // setOrderPayload({
                //   ...orderPayload,
                //   flavours: {
                //     ...orderPayload.flavours,
                //     brand_details: {
                //       id: parseInt(itemValue),
                //       name: filteredChow[0].brand_name,
                //     },
                //   },
                // });
                setOrderPayload({
                  flavours: {
                    brand_details: {
                      id: parseInt(itemValue),
                      name: filteredChow[0].brand_name,
                    },
                    details: {},
                  },
                });
                setChosenFlavour(undefined);
                setChosenVariety(undefined);
              }}
              key={order.flavours.brand_details.id}
            >
              {chow && renderBrandDropdown()}
            </Select> */}
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => {}}>
            <Select
              minWidth="200"
              selectedValue={chosenFlavour?.flavour_id}
              // selectedValue={
              //   orderPayload.flavours.details.flavour_id
              //     ? orderPayload.flavours.details.flavour_id
              //     : undefined
              // }
              defaultValue=""
              accessibilityLabel="Choose Flavour"
              placeholder="Choose Flavour *"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              onValueChange={(itemValue) => {
                console.log("updating Flavour");
                const filteredChow = selectedBrand();
                const filteredFlavour = filteredChow
                  ? filteredChow.flavours.filter(
                      (flavour) => flavour.flavour_id === parseInt(itemValue)
                    )
                  : [];

                const data = {
                  details: {
                    flavour_id: filteredFlavour[0].flavour_id,
                    flavour_name: filteredFlavour[0].flavour_name,
                  },
                  brand_details: orderPayload.flavours.brand_details,
                };
                setOrderPayload({
                  ...orderPayload,
                  flavours: data,
                  variety: {},
                });
                setChosenFlavour(filteredFlavour[0]);
                setChosenVariety(undefined);
              }}
            >
              {/* {renderFlavourDropdown()} */}
            </Select>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={
              () => {}
              // renderVarieties();
            }
          >
            <Select
              minWidth="200"
              selectedValue={chosenVariety ? chosenVariety.id : null}
              accessibilityLabel="Choose Size"
              placeholder="Choose Size *"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
              // onValueChange={(itemValue) => {
              //   const filteredChow = chow
              //     ?.map((brand) => brand)
              //     .filter((item) => {
              //       return item.id === orderPayload.flavours.brand_details.id;
              //     });

              //   const filteredFlavour = filteredChow?.length
              //     ? filteredChow[0].flavours.filter(
              //         (flavour) => flavour.flavour_id === parseInt(itemValue)
              //       )
              //     : [];
              //   setChosenFlavour(filteredFlavour[0]);

              //   const data = {
              //     details: {
              //       flavour_id: filteredFlavour[0].flavour_id,
              //       flavour_name: filteredFlavour[0].flavour_name,
              //     },
              //     brand_details: orderPayload.flavours.brand_details,
              //   };
              //   setOrderPayload({ ...orderPayload, flavours: data });
              // }}
              onValueChange={(itemValue) => {
                // const flavour = selectedFlavour();
                const chow = selectedBrand();
                const filteredFlavour = chow?.flavours.filter((flavour) => {
                  return (
                    flavour.flavour_id ===
                    orderPayload.flavours.details.flavour_id
                  );
                });

                const filteredVariety = filteredFlavour[0]!.varieties.filter(
                  (variety) => {
                    return variety.id === Number(itemValue);
                  }
                );
                setChosenVariety(filteredVariety[0]);
                setOrderPayload({
                  ...orderPayload,
                  variety: filteredVariety[0]!,
                });
              }}
            >
              {/* {renderVarieties()} */}
            </Select>
          </TouchableWithoutFeedback>

          <Header>Quantity</Header>
          <TextInput
            onChangeText={(value) =>
              setOrderPayload({
                ...orderPayload,
                quantity: parseInt(value) || 0,
              })
            }
            selectTextOnFocus
            style={[
              styles.customInput,
              { maxWidth: "15%", textAlign: "center" },
            ]}
            keyboardType="numeric"
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
                    ...orderPayload,
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

          <Header>Costs</Header>
          <Text>Retail Price</Text>
          <TextInput
            onChangeText={(value) =>
              setOrderPayload({
                ...orderPayload,
                quantity: parseInt(value) || 0,
              })
            }
            selectTextOnFocus
            style={{ fontSize: 20 }}
            keyboardType="numeric"
          >
            {Dinero({
              amount: Math.round(orderPayload.retail_price * 100 || 0),
            }).toFormat("$0,0.00")}
          </TextInput>
          <Text>Total</Text>
          <TextInput
            onChangeText={(value) =>
              setOrderPayload({
                ...orderPayload,
                quantity: parseInt(value) || 0,
              })
            }
            selectTextOnFocus
            style={{ fontSize: 28, paddingBottom: 18 }}
            keyboardType="numeric"
          >
            {Dinero({
              amount: Math.round(
                (orderPayload.retail_price * orderPayload.quantity +
                  orderPayload.delivery_cost) *
                  100 || 0
              ),
            }).toFormat("$0,0.00")}
          </TextInput>
        </View>

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
