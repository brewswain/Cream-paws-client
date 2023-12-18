import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { clearCustomerOrders, clearOrders } from "../utils/orderUtils";
import { Button } from "native-base";
import { deleteCustomersOrder } from "../api/routes/orders";

interface CustomerDetailProps {
  navigation: RootTabScreenProps<"CustomerDetails">;
  route: any;
}

export interface SelectedOrder {
  index: number;
  selected: boolean;
}

const CustomerDetailsScreen = ({ navigation, route }: CustomerDetailProps) => {
  //   False by default to ensure Outstanding orders are displayed
  const [outstandingCollapsible, setOutstandingCollapsible] =
    useState<boolean>(false);
  const [completedCollapsible, setCompletedCollapsible] =
    useState<boolean>(true);
  const [groupValues, setGroupValues] = useState([]);
  const [buttonStateSelectedOrders, setButtonStateSelectedOrders] =
    useState("idle");
  const [buttonStateClearAllOrders, setButtonStateClearAllOrders] =
    useState("idle");
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [selectedOrders, setSelectedOrders] = useState<SelectedOrder[]>([
    {
      index: 0,
      selected: false,
    },
  ]);

  const { pets, orders, name, id, contactNumber, location, city } =
    route.params;
  // const { pets, orders, name, id } = testCustomerDetails;
  const {
    container,
    header,
    subHeader,
    deEmphasis,
    outstandingCosts,
    buttonText,
    buttonContainer,
    button,
    payAllOrderButton,
  } = styles;

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
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      0
    ) * 100
  );

  const capitalizedName = (name: string) => {
    return name[0].toUpperCase() + name.substring(1);
  };

  // TODO: make this more elegant, this is a pretty clumsy solution. filter on a map that's then used to do a separate map...
  const selectedIndicesArray = selectedOrders
    .filter((order) => order.selected === true)
    .map((order) => order.index);

  const ordersChosenForClearing = selectedIndicesArray.map(
    (selectedIndex) => orders[selectedIndex]
  );

  const handleClearingSelectedOrders = async () => {
    setButtonStateSelectedOrders("loading"); // Set loading state

    try {
      // await clearOrders(ordersChosenForClearing);
      clearCustomerOrders(ordersChosenForClearing);

      // On success, set success state
      setButtonStateSelectedOrders("success");
      setIsFetching(true);

      // Revert to idle state after a delay
      setTimeout(() => {
        setButtonStateSelectedOrders("idle");
      }, 1000);
    } catch (error) {
      // On error, set error state
      setButtonStateSelectedOrders("error");

      // Revert to idle state after a delay
      setTimeout(() => {
        setButtonStateSelectedOrders("idle");
      }, 1000);
    }
  };

  const handleClearingAllOrders = async () => {
    setButtonStateClearAllOrders("loading"); // Set loading state

    try {
      clearCustomerOrders(orders);
      // On success, set success state
      setButtonStateClearAllOrders("success");
      setIsFetching(true);

      // Revert to idle state after a delay
      setTimeout(() => {
        setButtonStateClearAllOrders("idle");
      }, 1000);
    } catch (error) {
      // On error, set error state
      setButtonStateClearAllOrders("error");

      // Revert to idle state after a delay
      setTimeout(() => {
        setButtonStateClearAllOrders("idle");
      }, 1000);
    }
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
        <Text style={subHeader}>City</Text>
        <Text style={{ color: "white", paddingLeft: 20, fontSize: 16 }}>
          {city}
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
          selectedOrders={selectedOrders}
          setSelectedOrders={setSelectedOrders}
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

        <View style={buttonContainer}>
          <Button
            onPress={async () => {
              if (
                buttonStateSelectedOrders === "idle" &&
                selectedIndicesArray.length >= 1
              ) {
                setButtonStateSelectedOrders("loading");
                try {
                  await handleClearingSelectedOrders();
                  setButtonStateSelectedOrders("success");
                  setTimeout(() => setButtonStateSelectedOrders("idle"), 1000);
                } catch (error) {
                  setButtonStateSelectedOrders("error");
                  setTimeout(() => setButtonStateSelectedOrders("idle"), 1000);
                }
              }
            }}
            isDisabled={selectedIndicesArray.length < 1}
            style={button}
          >
            {buttonStateSelectedOrders === "loading" ? (
              <ActivityIndicator color="white" />
            ) : buttonStateSelectedOrders === "success" ? (
              <>
                <Text style={buttonText}>Paid!</Text>
              </>
            ) : buttonStateSelectedOrders === "error" ? (
              <>
                <Text style={buttonText}>Error!</Text>
              </>
            ) : (
              "Set selected orders to 'Paid'"
            )}
          </Button>
        </View>
        <View style={buttonContainer}>
          <Button
            onPress={async () => {
              if (buttonStateClearAllOrders === "idle") {
                setButtonStateClearAllOrders("loading");
                try {
                  await handleClearingAllOrders();
                  setButtonStateClearAllOrders("success");
                  setTimeout(() => setButtonStateClearAllOrders("idle"), 1000);
                } catch (error) {
                  setButtonStateClearAllOrders("error");
                  setTimeout(() => setButtonStateClearAllOrders("idle"), 1000);
                }
              }
            }}
            style={button}
          >
            {buttonStateClearAllOrders === "loading" ? (
              <ActivityIndicator color="white" />
            ) : buttonStateClearAllOrders === "success" ? (
              <>
                <Text style={buttonText}>Paid!</Text>
              </>
            ) : buttonStateClearAllOrders === "error" ? (
              <>
                <Text style={buttonText}>Error!</Text>
              </>
            ) : (
              "Pay all outstanding orders"
            )}
          </Button>
        </View>
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

  // Button Block
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: "60%",
  },

  payAllOrderButton: {
    backgroundColor: "green",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default CustomerDetailsScreen;
