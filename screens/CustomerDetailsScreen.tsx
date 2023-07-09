import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import Collapsible from "react-native-collapsible";
import Dinero from "dinero.js";

import { RootTabScreenProps } from "../types";

import { testCustomerDetails } from "../data/test_data";
import {
  CollapsibleOrder,
  DetailsText,
  FilteredOrderDetails,
} from "../components";

import { updateOrder } from "../api";
interface CustomerDetailProps {
  navigation: RootTabScreenProps<"CustomerDetails">;
  route: any;
}

const CustomerDetailsScreen = ({ navigation, route }: CustomerDetailProps) => {
  // False by default to ensure Outstanding orders are displayed
  const [outstandingCollapsible, setOutstandingCollapsible] =
    useState<boolean>(false);
  const [completedCollapsible, setCompletedCollapsible] =
    useState<boolean>(true);

  const { pets, orders, name, id } = route.params;
  // const { pets, orders, name, id } = testCustomerDetails;
  const { container, header, subHeader, deEmphasis, outstandingCosts } = styles;

  const { height, width } = useWindowDimensions();

  // const TEST_PETS_EXIST =
  //    testCustomerDetails.pets && testCustomerDetails.pets.length > 0;
  // const TEST_ORDERS_EXIST =
  //    testCustomerDetails.orders && testCustomerDetails.orders.length > 0;
  const petsExist = pets && pets.length > 0;
  const ordersExist = orders && orders.length > 0;
  const outstandingOrders = orders.filter(
    (order: Order) => order.payment_made === false
  );
  // console.log({ outstandingOrders });
  const completedOrders = orders.filter(
    (order: Order) => order.payment_made === true
  );

  const mappedCostArray = orders
    .filter((order: Order) => order.payment_made === false)
    .map(
      (order: OrderWithChowDetails) =>
        order.chow_details.retail_price * order.quantity
    );

  //TODO: remove test payload

  const capitalizedName = (name: string) => {
    return name[0].toUpperCase() + name.substring(1);
  };

  const handleMassOrderPayment = () => {
    outstandingOrders.map(async (order: OrderWithChowDetails) => {
      const paidOrder = {
        ...order,
        payment_made: true,
        payment_date: new Date().toString(),
      };

      // await updateOrder(order.id, paidOrder);
    });
  };

  const renderPets = () => (
    <View>
      <Text style={[subHeader]}>{pets!.length > 1 ? "Pets" : "Pet"}</Text>

      {pets?.map((pet: { name: string; breed: string }, index: number) => (
        <View key={`${index} Pet Container`}>
          <DetailsText header={"Name"} details={pet.name} />
          <DetailsText header={"Breed"} details={pet.breed} />
        </View>
      ))}
    </View>
  );

  const renderOrders = () => {
    // Using explicit boolean verification here for DX purposes

    return (
      <View style={container}>
        <Text style={subHeader}>{orders!.length > 1 ? "Orders" : "Order"}</Text>

        <CollapsibleOrder
          outstandingCollapsible={outstandingCollapsible}
          setOutstandingCollapsible={setOutstandingCollapsible}
          outstandingOrders={outstandingOrders}
        >
          Outstanding Orders
        </CollapsibleOrder>
        <CollapsibleOrder
          outstandingCollapsible={completedCollapsible}
          setOutstandingCollapsible={setCompletedCollapsible}
          outstandingOrders={completedOrders}
        >
          Completed Orders
        </CollapsibleOrder>
      </View>
    );
  };

  return (
    <ScrollView style={[container, { height: height, width: width }]}>
      <Text style={header}>{capitalizedName(name)}</Text>
      {outstandingOrders.length > 0 ? (
        <Text style={outstandingCosts}>
          Total Outstanding Cost:{" "}
          {Dinero({
            amount: Math.round(
              mappedCostArray.reduce(
                (accumulator: number, currentValue: number) =>
                  accumulator + currentValue,
                0
              ) * 100
            ),
            precision: 2,
          }).toFormat("$0,0.00")}
        </Text>
      ) : (
        <Text style={[outstandingCosts, { color: "green" }]}>
          No outstanding Orders!
        </Text>
      )}
      <View>
        {petsExist && renderPets()}
        {ordersExist && renderOrders()}
        {/* {TEST_PETS_EXIST && renderPets()}
            {TEST_ORDERS_EXIST && renderOrders()} */}
      </View>
      <Text style={deEmphasis}>Customer ID: {id}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "hsl(225,6%,13%)",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    margin: 8,
    color: "rgb(148, 163, 184)",
  },
  collapsibleHeader: {
    paddingLeft: 20,
  },
  subHeader: {
    fontSize: 20,
    color: "hsl(186, 52%, 61%)",
    // color: "hsl(186,63%,30%)",
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 20,
  },
  outstandingCosts: {
    fontSize: 16,
    color: "red",
    marginBottom: 4,
    paddingLeft: 20,
  },
  deEmphasis: {
    color: "hsla(222,31%,66%, 0.7)",
    marginTop: 12,
    marginBottom: 12,
  },
  bold: {
    fontWeight: "600",
  },
  regular: {
    fontWeight: "400",
  },
});

export default CustomerDetailsScreen;
