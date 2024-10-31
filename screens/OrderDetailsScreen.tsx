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
import { Button, ScrollView } from "native-base";
import { IndexPath, Layout, Select, SelectItem } from "@ui-kitten/components";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { deleteOrder, getAllChow, updateOrder } from "../api";
import { Header } from "../components/details/DetailScreenComponents";
import { RootTabScreenProps } from "../types";
import {
  OrderFromSupabase,
  OrderFromSupabasePayload,
  OrderWithChowDetails,
} from "../models/order";
import { clearCustomerOrders } from "../utils/orderUtils";
import { ChosenFlavour, ChowFromSupabase } from "../models/chow";

import Dinero from "dinero.js";
import { useOrderStore } from "../store/orderStore";

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
  const [orderPayload, setOrderPayload] =
    useState<OrderFromSupabasePayload>(order);
  const [chow, setChow] = useState<ChowFromSupabase[]>();
  const [selectedBrandIndex, setSelectedBrandIndex] = useState<
    IndexPath | IndexPath[]
  >(new IndexPath(0));
  const [selectedFlavourIndex, setSelectedFlavourIndex] = useState<
    IndexPath | IndexPath[]
  >(new IndexPath(0));
  const [selectedVarietyIndex, setSelectedVarietyIndex] = useState<
    IndexPath | IndexPath[]
  >(new IndexPath(0));
  const [selectedDeliveryCostIndex, setSelectedDeliveryCostIndex] = useState<
    IndexPath | IndexPath[]
  >(new IndexPath(0));

  const [datePickerIsVisible, setDatePickerIsVisible] =
    useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { fetchOrders } = useOrderStore();

  const navigate = useNavigation();
  const populateChowList = async () => {
    const response = await getAllChow();
    setChow(response);
  };

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
      return orderPayload.flavours.details
        ? flavour.flavour_id === orderPayload.flavours.details.flavour_id
        : [];
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
                brand_details: {
                  id: brand.id,
                  name: brand.brand_name,
                },
              },
              variety: undefined,
            })
          }
        />
      );
    });
  };

  const renderFlavourDropdown = () => {
    const chow = selectedBrand();
    return chow?.flavours.map((flavour, index) => (
      <SelectItem
        key={index}
        title={flavour.flavour_name}
        onPressIn={() =>
          setOrderPayload({
            ...orderPayload,
            flavours: {
              ...orderPayload.flavours,
              details: {
                flavour_id: flavour.flavour_id,
                flavour_name: flavour.flavour_name,
              },
            },
            variety: undefined,
          })
        }
      />
    ));
  };

  const renderVarietyDropdown = () => {
    const flavour = selectedFlavour();
    return flavour?.varieties.map((variety, index) => {
      return (
        <SelectItem
          key={index}
          title={`${variety.size} ${variety.unit}`}
          onPressIn={() =>
            setOrderPayload({
              ...orderPayload,
              variety: {
                id: variety.id,
                size: variety.size,
                unit: variety.unit,
                chow_id: variety.chow_id,
                retail_price: variety.retail_price,
                wholesale_price: variety.wholesale_price,
              },
            })
          }
        />
      );
    });
  };

  const renderDeliveryCost = () => {
    const DELIVERY_COSTS = [0, 20, 45, 60, 100];

    return DELIVERY_COSTS.map((delivery_cost, index) => (
      <SelectItem
        key={index}
        title={Dinero({
          amount: Math.round(delivery_cost * 100 || 0),
        }).toFormat("$0,0.00")}
        onPressIn={() => {
          setOrderPayload({
            ...orderPayload,
            delivery_cost: delivery_cost,
          });
        }}
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

  const handleUpdate = async () => {
    await updateOrder(orderPayload);
    fetchOrders();
    navigate.goBack();
  };

  const handleDelete = async (id: number) => {
    await deleteOrder(id);
    fetchOrders();

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
          <Text
            style={{ fontSize: 26, textAlign: "center", fontWeight: "600" }}
          >
            {order.customers.name}
          </Text>
          <Layout>
            <Select
              selectedIndex={selectedBrandIndex}
              value={orderPayload.flavours.brand_details.name}
              onSelect={(index) => setSelectedBrandIndex(index)}
            >
              {chow && renderBrandDropdown()}
            </Select>
          </Layout>

          <TouchableWithoutFeedback>
            <Select
              selectedIndex={selectedFlavourIndex}
              value={
                orderPayload.flavours.details?.flavour_name
                  ? orderPayload.flavours.details.flavour_name
                  : "Choose Flavour"
              }
              onSelect={(index) => setSelectedFlavourIndex(index)} //
              accessibilityLabel="Choose Flavour"
              placeholder="Choose Flavour *"
            >
              {selectedBrand() && renderFlavourDropdown()}
            </Select>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={
              () => {}
              // renderVarieties();
            }
          >
            <Select
              selectedIndex={selectedVarietyIndex}
              value={
                orderPayload.variety
                  ? `${orderPayload.variety.size} ${orderPayload.variety.unit}`
                  : "Choose Variety"
              }
              onSelect={(index) => setSelectedVarietyIndex(index)} //
              accessibilityLabel="Choose Variety"
              placeholder="Choose Variety *"
            >
              {renderVarietyDropdown()}
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
                selectedIndex={selectedVarietyIndex}
                value={orderPayload.delivery_cost}
                onSelect={(index) => setSelectedDeliveryCostIndex(index)} //
                accessibilityLabel="Delivery Cost"
                placeholder="Delivery Cost *"
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
            style={[styles.customInput, { fontSize: 18 }]}
            onChangeText={(value) =>
              setOrderPayload({
                ...orderPayload,
                quantity: parseInt(value) || 0,
              })
            }
            selectTextOnFocus
            keyboardType="numeric"
          >
            {Dinero({
              amount: Math.round(orderPayload.retail_price * 100 || 0),
            }).toFormat("$0,0.00")}
          </TextInput>
          <Text>Total</Text>
          <TextInput
            style={{ fontSize: 20, paddingBottom: 18 }}
            onChangeText={(value) =>
              setOrderPayload({
                ...orderPayload,
                quantity: parseInt(value) || 0,
              })
            }
            selectTextOnFocus
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
            onPress={() => handleUpdate()}
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
            onPress={() => handleDelete(order.id)}
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
