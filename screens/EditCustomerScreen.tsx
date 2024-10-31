import { useState, createRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { Button } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import { useNavigation } from "@react-navigation/native";

import { RootTabScreenProps } from "../types";
import { OrderFromSupabase, OrderWithChowDetails } from "../models/order";
import { updateCustomer } from "../api";
import {
  Header,
  SubHeader,
} from "../components/details/DetailScreenComponents";
import { Customer } from "../models/customer";

interface EditCustomerScreenProps {
  navigation: RootTabScreenProps<"EditCustomer">;
  route: {
    params: {
      customer: Customer;
    };
  };
}

const EditCustomerScreen = ({ navigation, route }: EditCustomerScreenProps) => {
  // Orders left off of this payload since we're gonna add that unedited to our updateCustomer call
  const [customerPayload, setCustomerPayload] = useState({
    ...route.params.customer,
  });

  const navigate = useNavigation();

  const inputRef2 = createRef<TextInput>();
  const inputRef3 = createRef<TextInput>();
  const inputRef4 = createRef<TextInput>();

  const addField = () => {
    const data = { ...customerPayload };
    const newField = { name: "", breed: "" };

    data.pets ? data.pets.push(newField) : [newField];
    setCustomerPayload(data);
  };

  const removeField = (specifiedPetIndex: number) => {
    const data = { ...customerPayload };

    data.pets ? data.pets.splice(specifiedPetIndex, 1) : [];
    setCustomerPayload(data);
  };

  const handleCustomerChange = (name: string, value: string | number) => {
    setCustomerPayload((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePetsChange = (
    text: string,
    name: "name" | "breed",
    specifiedPetIndex: number
  ) => {
    const data = { ...customerPayload };
    data.pets ? (data.pets[specifiedPetIndex][name] = text) : [];

    setCustomerPayload(data);
  };

  const handleUpdate = async () => {
    await updateCustomer(route.params.customer.id, {
      ...customerPayload,
      orders: route.params.customer.orders,
    });
    navigate.navigate("Customers");
  };

  return (
    <View
      style={{
        backgroundColor: "#f1f2f3",
        alignItems: "center",
        paddingTop: 10,
      }}
    >
      <Header>Customer Details</Header>
      <View>
        <SubHeader>Name</SubHeader>
        <TextInput
          selectTextOnFocus
          style={styles.input}
          onChange={(event) =>
            handleCustomerChange("name", event.nativeEvent.text)
          }
          returnKeyType={"next"}
          blurOnSubmit={false}
          onSubmitEditing={() => inputRef2.current && inputRef2.current.focus()}
          defaultValue={customerPayload.name}
        />
        <SubHeader>Contact Number</SubHeader>
        <TextInput
          selectTextOnFocus
          style={styles.input}
          onChange={(event) =>
            handleCustomerChange("contactNumber", event.nativeEvent.text)
          }
          returnKeyType={"next"}
          keyboardType="numeric"
          blurOnSubmit={false}
          onSubmitEditing={() => inputRef3.current && inputRef3.current.focus()}
          defaultValue={customerPayload.contactNumber}
          ref={inputRef2}
        />
        <SubHeader>Address</SubHeader>
        <TextInput
          selectTextOnFocus
          style={styles.input}
          onChange={(event) =>
            handleCustomerChange("location", event.nativeEvent.text)
          }
          returnKeyType={"next"}
          blurOnSubmit={false}
          onSubmitEditing={() => inputRef4.current && inputRef4.current.focus()}
          defaultValue={customerPayload.location}
          ref={inputRef3}
        />

        <SubHeader>City</SubHeader>
        <TextInput
          selectTextOnFocus
          style={styles.input}
          onChange={(event) =>
            handleCustomerChange("city", event.nativeEvent.text)
          }
          defaultValue={customerPayload.city}
          ref={inputRef4}
        />
      </View>
      <Header>Pets</Header>
      {/* Pets block */}
      {customerPayload.pets && customerPayload.pets.length
        ? customerPayload.pets.map((pet, petIndex) => {
            return (
              <View style={{ paddingTop: 4 }}>
                <SubHeader>Name</SubHeader>
                <TextInput
                  selectTextOnFocus
                  style={styles.input}
                  onChangeText={(text: string) =>
                    handlePetsChange(text, "name", petIndex)
                  }
                >
                  {pet.name}
                </TextInput>
                {/* <SubHeader>Breed</SubHeader>
                <TextInput
                  selectTextOnFocus
                  style={styles.input}
                  onChangeText={(text: string) =>
                    handlePetsChange(text, "breed", petIndex)
                  }
                >
                  {pet.breed}
                </TextInput> */}
                <View style={styles.buttonContainer}>
                  <Button
                    style={styles.button}
                    onPress={() => addField()}
                    key={`petIndex: ${petIndex} AddField `}
                  >
                    <Icon
                      name="plus"
                      size={10}
                      key={`petIndex: ${petIndex} PlusIcon `}
                    />
                  </Button>
                  <Button
                    isDisabled={
                      !customerPayload.pets || customerPayload.pets.length <= 1
                    }
                    onPress={() => removeField(petIndex)}
                    key={`petIndex: ${petIndex} RemoveField `}
                  >
                    <Icon
                      name="minus"
                      size={10}
                      key={`petIndex: ${petIndex} MinusIcon `}
                    />
                  </Button>
                </View>
              </View>
            );
          })
        : null}
      <Button.Group space={2} style={styles.confirmationButtonContainer}>
        <Button variant="ghost" onPress={() => navigate.navigate("Customers")}>
          Cancel
        </Button>
        <Button
          style={styles.confirmationButton}
          onPress={() => handleUpdate()}
        >
          Save
        </Button>
      </Button.Group>
    </View>
  );
};

// Pets block

const styles = StyleSheet.create({
  input: {
    margin: 5,
    marginBottom: 8,
    marginTop: 0,
    paddingLeft: 10,
    width: 270,
    borderRadius: 4,
    backgroundColor: "hsl(240,57%,97%)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
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
  header: {
    fontSize: 18,
    fontWeight: "600",
  },
  unitButtonContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  unitButton: {
    width: 60,
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#4939FF",
  },
  inactiveButton: {
    backgroundColor: "white",
  },
});

export default EditCustomerScreen;
