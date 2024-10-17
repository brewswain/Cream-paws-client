import { useContext, useEffect, useState } from "react";
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
import { OrderFromSupabase, OrderWithChowDetails } from "../models/order";
import { clearCustomerOrders } from "../utils/orderUtils";
import { Button } from "native-base";
import { findCustomer } from "../api";
import { Customer } from "../models/customer";
import { CustomerDetailsContext } from "../context/CustomerDetailsContext";
import { getCustomersOrders } from "../api/routes/orders";
import { useOrderStore } from "../store/orderStore";

interface CustomerDetailProps {
  navigation: RootTabScreenProps<"CustomerDetails">;
  route: any;
}

export interface SelectedOrder {
  index: number;
  selected: boolean;
}

const CustomerDetailsScreen = ({ navigation, route }: CustomerDetailProps) => {
  const { customer } = route.params;
  //   False by default to ensure Outstanding orders are displayed
  const [outstandingCollapsible, setOutstandingCollapsible] =
    useState<boolean>(true);
  const [completedCollapsible, setCompletedCollapsible] =
    useState<boolean>(true);
  const [buttonStateSelectedOrders, setButtonStateSelectedOrders] =
    useState("idle");
  const [buttonStateClearAllOrders, setButtonStateClearAllOrders] =
    useState("idle");
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [customerPayload, setCustomerPayload] = useState<Customer>(customer);
  const [orders, setOrders] = useState<OrderFromSupabase[]>();

  const customerDetails = useContext(CustomerDetailsContext);
  const { selectedOrders, setSelectedOrders } = customerDetails;
  const {
    customerOrders,
    fetchCustomerOrders,
    setCompletedOrders,
    setOutstandingOrders,
    outstandingOrders,
    selectedOrderIds,
  } = useOrderStore();

  const populateOrders = async () => {
    if (customerOrders) {
      const outstandingOrders = customerOrders
        ? customerOrders.filter(
            (order: OrderFromSupabase) => order.payment_made === false
          )
        : [];

      const completedOrders = customerOrders
        ? customerOrders
            .filter((order: OrderFromSupabase) => order.payment_made === true)
            .sort((a: OrderFromSupabase, b: OrderFromSupabase) =>
              b.delivery_date.localeCompare(a.delivery_date)
            )
        : [];

      setOutstandingOrders(outstandingOrders);
      setCompletedOrders(completedOrders);
    }
  };

  useEffect(() => {
    populateOrders();
  }, []);
  // const customerData = findCustomer(route.params.id);
  // const populateCustomerData = async () => {
  //   const data = await findCustomer(route.params.id);
  //   setCustomer(data);
  // };

  // const { pets, orders, name, id, contactNumber, location, city } =
  //   route.params;
  // // const { pets, orders, name, id } = testCustomerDetails;
  const {
    container,
    header,
    card,
    subHeader,
    content,
    outstandingCosts,
    buttonText,
    buttonContainer,
    button,
    payAllOrderButton,
  } = styles;

  const { height, width } = useWindowDimensions();

  // const petsExist = pets.length > 0;
  const ordersExist = customerOrders && customerOrders.length > 0;
  // const locationExist = location !== undefined;
  // const contactNumberExist = contactNumber !== undefined;

  const mappedCostArray = customerOrders
    ? customerOrders
        .filter((order: OrderFromSupabase) => order.payment_made === false)
        .map((order: OrderFromSupabase) => order.retail_price * order.quantity)
    : [];

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
    (selectedIndex) => orders![selectedIndex]
  );

  //TODO: implement navigation from collapsibleOrder to order edit screen
  // const handleNavigate = (orderIndex: number) =>
  //   useNavigation().navigate("OrderDetails", {
  //     orders,
  //     client_name: name,
  //     orders: orders[orderIndex].delivery_cost,
  //     delivery_date: orders[orderIndex].delivery_date,
  //     customer_id: id,
  //   });

  // const handleClearingSelectedOrders = async () => {
  //   setButtonStateSelectedOrders("loading"); // Set loading state

  //   try {
  //     // await clearOrders(ordersChosenForClearing);
  //     clearCustomerOrders(ordersChosenForClearing);

  //     // On success, set success state
  //     setButtonStateSelectedOrders("success");
  //     setIsFetching(true);

  //     // Revert to idle state after a delay
  //     setTimeout(() => {
  //       setButtonStateSelectedOrders("idle");
  //     }, 1000);
  //   } catch (error) {
  //     // On error, set error state
  //     setButtonStateSelectedOrders("error");

  //     // Revert to idle state after a delay
  //     setTimeout(() => {
  //       setButtonStateSelectedOrders("idle");
  //     }, 1000);
  //   }
  // };

  // const handleClearingAllOrders = async () => {
  //   setButtonStateClearAllOrders("loading"); // Set loading state

  //   try {
  //     clearCustomerOrders(orders);
  //     // On success, set success state
  //     setButtonStateClearAllOrders("success");
  //     setIsFetching(true);

  //     // Revert to idle state after a delay
  //     setTimeout(() => {
  //       setButtonStateClearAllOrders("idle");
  //     }, 1000);
  //   } catch (error) {
  //     // On error, set error state
  //     setButtonStateClearAllOrders("error");

  //     // Revert to idle state after a delay
  //     setTimeout(() => {
  //       setButtonStateClearAllOrders("idle");
  //     }, 1000);
  //   }
  // };

  // const renderContactNumber = () => {
  //   return (
  //     <>
  //       <Text style={subHeader}>Contact Number</Text>
  //       <Text style={content}>{contactNumber}</Text>
  //     </>
  //   );
  // };
  // const renderLocation = () => {
  //   return (
  //     <>
  //       <Text style={subHeader}>Location</Text>
  //       <Text style={content}>{location}</Text>
  //       <Text style={subHeader}>City</Text>
  //       <Text style={content}>{city}</Text>
  //     </>
  //   );
  // };
  // const renderPets = () => (
  //   <View>
  //     <Text style={[subHeader]}>{pets?.length > 1 ? "Pets" : "Pet"}</Text>

  //     {pets?.map((pet: { name: string; breed: string }, index: number) => (
  //       <View key={`${index} Pet Container`}>
  //         <DetailsText
  //           header={"Name"}
  //           details={pet.name}
  //           color="black"
  //           paddingLeft={0}
  //         />
  //         {pet.breed ? (
  //           <DetailsText
  //             header={"Breed"}
  //             details={pet.breed}
  //             color="black"
  //             paddingLeft={0}
  //           />
  //         ) : null}
  //       </View>
  //     ))}
  //   </View>
  // );

  const renderOrders = () => {
    return (
      <View style={container}>
        {orders ? (
          <Text style={subHeader}>
            {orders?.length > 1 ? "Orders" : "Order"}
          </Text>
        ) : null}

        <CollapsibleOrder
          outstandingCollapsible={outstandingCollapsible}
          setOutstandingCollapsible={setOutstandingCollapsible}
        >
          Outstanding Orders
        </CollapsibleOrder>

        <CollapsibleOrder
          outstandingCollapsible={completedCollapsible}
          setOutstandingCollapsible={setCompletedCollapsible}
          isCompleted
        >
          Completed Orders
        </CollapsibleOrder>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <View style={buttonContainer}>
            <Button
              onPress={async () => {
                if (
                  buttonStateSelectedOrders === "idle" &&
                  selectedIndicesArray.length >= 1
                ) {
                  setButtonStateSelectedOrders("loading");
                  try {
                    // await handleClearingSelectedOrders();
                    setButtonStateSelectedOrders("success");
                    setTimeout(
                      () => setButtonStateSelectedOrders("idle"),
                      1000
                    );
                  } catch (error) {
                    setButtonStateSelectedOrders("error");
                    setTimeout(
                      () => setButtonStateSelectedOrders("idle"),
                      1000
                    );
                  }
                }
              }}
              isDisabled={selectedOrderIds.length < 1}
              colorScheme={selectedOrderIds.length ? "teal" : "trueGray"}
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
                    // await handleClearingAllOrders();
                    setButtonStateClearAllOrders("success");
                    setTimeout(
                      () => setButtonStateClearAllOrders("idle"),
                      1000
                    );
                  } catch (error) {
                    setButtonStateClearAllOrders("error");
                    setTimeout(
                      () => setButtonStateClearAllOrders("idle"),
                      1000
                    );
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
      </View>
    );
  };

  return (
    <ScrollView
      style={[container, { height: height, width: width }]}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Text style={header}>{capitalizedName(customer.name)}</Text>

      {outstandingOrders.length > 0 ? (
        <View style={card}>
          <Text style={outstandingCosts}>
            Outstanding Cost: 
            {subTotal
              ? Dinero({
                  amount: subTotal || 0,
                  precision: 2,
                }).toFormat("$0,0.00")
              : null}
          </Text>
        </View>
      ) : null}
      <View>
        {/* {locationExist && renderLocation()}
        {contactNumberExist && renderContactNumber()}
        {petsExist && renderPets()}
        */}
        {customerOrders.length && renderOrders()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f1f2f3",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    margin: 8,
  },
  card: {
    borderRadius: 6,
    borderColor: "#e3e3e3",
    borderWidth: 1,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  collapsibleHeader: {},
  subHeader: {
    fontSize: 20,
    color: "#588ca8",
    marginTop: 4,
    marginBottom: 4,
  },
  content: {
    marginVertical: 4,
    fontSize: 14,
  },
  outstandingCosts: {
    fontSize: 17,
    color: "#be123c",
  },
  bold: {
    fontWeight: "600",
  },
  regular: {
    fontWeight: "400",
  },

  // Button Block
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: 170,
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
