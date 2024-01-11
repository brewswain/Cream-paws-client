import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Button, CheckIcon, Divider, ScrollView, Select } from "native-base";
import { getAllChow, updateOrder } from "../api";
import {
  CustomInput,
  Header,
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
  const navigate = useNavigation();
  const [chosenBrand, setChosenBrand] = useState([]);
  const [chow, setChow] = useState<Chow[]>();
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
          // value={item}
          // value={`${item}`}
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
    }
    // else if (name.includes("chow_details")) {
    //   const [nestedKey, propertyName] = name.split(".");
    //   setOrderPayload((prevState) => ({
    //     ...prevState,
    //     orders: prevState.orders.map((order, index) => {
    //       if (index === selectedIndex) {
    //         return {
    //           ...order,
    //           chow_details: {
    //             ...order.chow_details,
    //             [propertyName]: value,
    //           },
    //         };
    //       }
    //       return order;
    //     }),
    //   }));
    // }
    else {
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
    navigate.navigate("Orders");
  };

  const handleDelete = async (index: number) => {
    const deleteCustomerOrderPayload = [
      {
        order_id: orderPayload.orders[index].order_id,
        customer_id: orderPayload.customer_id,
      },
    ];

    await clearCustomerOrders(deleteCustomerOrderPayload);
    navigate.navigate("Orders");
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toDateString();

    return formattedDate;
  };

  const formattedDeliveryDate = formatDate(orderPayload.delivery_date);

  const costsFields = (index: number) => [
    // {
    //   title: "Wholesale Price",
    //   content:
    //     orderPayload.orders[index].chow_details.flavours.varieties
    //       .wholesale_price,
    //   name: "chow_details.wholesale_price",
    // },
    // {
    //   title: "Retail Price",
    //   content:
    //     orderPayload.orders[index].chow_details.flavours.varieties.retail_price,
    //   name: "chow_details.retail_price",
    // },
    {
      title: "Delivery Fee",
      content: "Add delivery fee dropdown here",
      name: "REPLACE_WHEN_WE_WORK_OUT_DATASHAPE",
    },
    // {
    //   title: "Total Cost",
    //   content: "Calculate all costs in our API",
    //   name: "REPLACE_WHEN_WE_WORK_OUT_DATASHAPE",
    // },
  ];

  const chowFields = (index: number) => [
    // {
    //   title: "Brand",
    //   content: orderPayload.orders[index].chow_details.brand,
    //   name: "chow_details.brand",
    // },
    // {
    //   title: "Flavour",
    //   content: orderPayload.orders[index].chow_details.flavours.flavour_name,
    //   name: "chow_details.flavours.flavour_name",
    // },
    // {
    //   title: "Size",
    //   content: orderPayload.orders[index].chow_details.flavours.varieties.size,
    //   name: "chow_details.size",
    // },
    // {
    //   title: "Unit",
    //   content: orderPayload.orders[index].chow_details.flavours.varieties.unit,
    //   name: "chow_details.unit",
    // },
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

        return (
          <>
            <View style={{ width: "90%" }}>
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
              {renderDetailInputs(chowFields(index), handleChange, index)}

              <Header>Delivery Date</Header>
              {/*  ignore this error till we implement the date-selector */}
              {/* @ts-ignore */}
              <CustomInput handleChange={handleChange}>
                {formattedDeliveryDate}
              </CustomInput>

              {/* TODO:  Add driver fees here: remember that we want a dropdown of 4 different delivery fees */}
              {currentOrder.delivery_cost ? (
                <View>
                  <TouchableWithoutFeedback
                    onPress={() => renderDeliveryCost()}
                  >
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
              ) : null}
            </View>
            <Button
              colorScheme="danger"
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
          </>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    paddingLeft: 12,
    marginHorizontal: 8,
    marginTop: 4,
  },
});

export default OrderDetailsScreen;
