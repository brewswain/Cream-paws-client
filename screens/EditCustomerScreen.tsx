import { useEffect, useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native";

import { Button, FormControl } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import { findChow, updateChow, updateChowFlavour } from "../api/routes/stock";

import { useNavigation } from "@react-navigation/native";

import { RootTabScreenProps } from "../types";
import { OrderWithChowDetails } from "../models/order";
import { findCustomer, updateCustomer } from "../api";
import { Customer } from "../models/customer";
import {
  CustomInput,
  Header,
  SubFields,
  SubHeader,
  renderDetailInputs,
} from "../components/details/DetailScreenComponents";

interface EditCustomerScreenProps {
  navigation: RootTabScreenProps<"EditCustomer">;
  route: {
    params: {
      name: string;
      location: string;
      city: string;
      id: string;
      contactNumber: string;
      orders: OrderWithChowDetails[];
      pets: [{ name: string; breed: string }];
    };
  };
}

const EditCustomerScreen = ({ navigation, route }: EditCustomerScreenProps) => {
  // Orders left off of this payload since we're gonna add that unedited to our updateCustomer call
  const [customerPayload, setCustomerPayload] = useState({
    ...route.params,
  });

  const navigate = useNavigation();

  const addField = () => {
    const data = { ...customerPayload };
    const newField = { name: "", breed: "" };

    data.pets.push(newField);
    setCustomerPayload(data);
  };

  const removeField = (specifiedPetIndex: number) => {
    const data = { ...customerPayload };

    data.pets.splice(specifiedPetIndex, 1);
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
    name: string,
    specifiedPetIndex: number
  ) => {
    const data = { ...customerPayload };
    data.pets[specifiedPetIndex][name] = text;

    setCustomerPayload(data);
  };

  const getCustomer = async () => {
    const data = await findCustomer(route.params.id);
    setCustomerPayload(data);
  };
  const handleUpdate = async () => {
    await updateCustomer(route.params.id, {
      ...customerPayload,
      orders: route.params.orders,
    });
    navigate.navigate("Customers");
  };

  // All our un-nested data aka we don't include our pets here
  const customerFields: SubFields[] = [
    {
      title: "Name",
      content: customerPayload.name,
      name: "name",
    },
    {
      title: "Contact Number",
      content: customerPayload.contactNumber,
      name: "contactNumber",
    },
    {
      title: "Address",
      content: customerPayload.location,
      name: "location",
    },
    {
      title: "City",
      content: customerPayload.city,
      name: "city",
    },
  ];

  return (
    <View>
      <Header>Customer Details</Header>
      {renderDetailInputs(customerFields, handleCustomerChange)}
      <Header>Pets</Header>
      {customerPayload.pets.map((pet, petIndex) => (
        <>
          <SubHeader>Name</SubHeader>
          <TextInput
            style={styles.input}
            onChangeText={(text: string) =>
              handlePetsChange(text, "name", petIndex)
            }
          >
            {pet.name}
          </TextInput>
          <SubHeader>Breed</SubHeader>
          <TextInput
            style={styles.input}
            onChangeText={(text: string) =>
              handlePetsChange(text, "breed", petIndex)
            }
          >
            {pet.breed}
          </TextInput>
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
              isDisabled={customerPayload.pets.length <= 1}
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
        </>
      ))}
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

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    paddingLeft: 12,
    marginHorizontal: 8,
    marginTop: 4,
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
