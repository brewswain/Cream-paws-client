import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import Dinero from "dinero.js";

import { RootTabScreenProps } from "../types";

import { CollapsibleOrder, DetailsText } from "../components";
import { OrderWithChowDetails } from "../models/order";

interface CustomerDetailProps {
  navigation: RootTabScreenProps<"CustomerDetails">;
  route: any;
}

const CustomerDetailsScreen = ({ navigation, route }: CustomerDetailProps) => {
  //   False by default to ensure Outstanding orders are displayed
  const [outstandingCollapsible, setOutstandingCollapsible] =
    useState<boolean>(false);
  const [completedCollapsible, setCompletedCollapsible] =
    useState<boolean>(true);

  const { pets, orders, name, id, contactNumber, location } = route.params;
  // const { pets, orders, name, id } = testCustomerDetails;
  const { container, header, subHeader, deEmphasis, outstandingCosts } = styles;

  const { height, width } = useWindowDimensions();

  const petsExist = pets.length > 0;
  const ordersExist = orders && orders.length > 0;
  const locationExist = location !== undefined;
  const contactNumberExist = contactNumber !== undefined;
  const outstandingOrders = orders.filter(
    (order: OrderWithChowDetails) => order.payment_made === false
  );
  const completedOrders = orders.filter(
    (order: OrderWithChowDetails) => order.payment_made === true
  );

  const mappedCostArray = orders
    .filter((order: OrderWithChowDetails) => order.payment_made === false)
    .map(
      (order: OrderWithChowDetails) =>
        order.chow_details.flavours.varieties.retail_price * order.quantity
    );

  const subTotal = Math.round(
    mappedCostArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * 100
  );

  const capitalizedName = (name: string) => {
    return name[0].toUpperCase() + name.substring(1);
  };

  const renderContactNumber = () => {
    return (
      <>
        <Text style={subHeader}>Contact Number</Text>
        <Text style={{ color: "white", paddingLeft: 20, fontSize: 16 }}>
          {contactNumber}
        </Text>
      </>
    );
  };
  const renderLocation = () => {
    return (
      <>
        <Text style={subHeader}>Location</Text>
        <Text style={{ color: "white", paddingLeft: 20, fontSize: 16 }}>
          {location}
        </Text>
      </>
    );
  };
  const renderPets = () => (
    <View>
      <Text style={[subHeader]}>{pets?.length > 1 ? "Pets" : "Pet"}</Text>

      {pets?.map((pet: { name: string; breed: string }, index: number) => (
        <View key={`${index} Pet Container`}>
          <DetailsText header={"Name"} details={pet.name} />
          <DetailsText header={"Breed"} details={pet.breed} />
        </View>
      ))}
    </View>
  );

  const renderOrders = () => {
    return (
      <View style={container}>
        <Text style={subHeader}>{orders?.length > 1 ? "Orders" : "Order"}</Text>

        <CollapsibleOrder
          outstandingCollapsible={outstandingCollapsible}
          setOutstandingCollapsible={setOutstandingCollapsible}
          outstandingOrders={outstandingOrders}
        >
          Outstanding Orders
        </CollapsibleOrder>
        {/* <CollapsibleOrder
              outstandingCollapsible={completedCollapsible}
              setOutstandingCollapsible={setCompletedCollapsible}
              outstandingOrders={completedOrders}
            >
              Completed Orders
            </CollapsibleOrder> */}
      </View>
    );
  };

  return (
    <ScrollView style={[container, { height: height, width: width }]}>
      <Text style={header}>{capitalizedName(name)}</Text>
      {outstandingOrders.length > 0 ? (
        <Text style={outstandingCosts}>
          Total Outstanding Cost:{" "}
          {subTotal
            ? Dinero({
                amount: subTotal || 0,
                precision: 2,
              }).toFormat("$0,0.00")
            : null}
        </Text>
      ) : (
        <Text style={[outstandingCosts, { color: "green" }]}>
          No outstanding Orders!
        </Text>
      )}
      <View>
        {locationExist && renderLocation()}
        {contactNumberExist && renderContactNumber()}
        {petsExist && renderPets()}
        {ordersExist && renderOrders()}
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
