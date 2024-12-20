import { createRef, useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native";

import { Button, FormControl, Modal } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import { createCustomer } from "../../api";

interface CreateCustomerModalProps {
  isOpen: boolean;
  setShowModal(booleanStatus: boolean): void;
  populateCustomerList(): void;
}

const CreateCustomerModal = ({
  isOpen,
  setShowModal,
  populateCustomerList,
}: CreateCustomerModalProps) => {
  // Used for dynamically rendering a new input for each pet
  // TODO: convert all of these fields into one state object
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [pets, setPets] = useState<any[]>([{ name: "", breed: "" }]);

  const inputRef2 = createRef<TextInput>();
  const inputRef3 = createRef<TextInput>();
  const inputRef4 = createRef<TextInput>();

  const {
    input,
    button,
    buttonContainer,
    confirmationButton,
    confirmationButtonContainer,
  } = styles;

  const closeModal = () => {
    setShowModal(false);
  };

  const addField = () => {
    const newField = { name: "", breed: "" };
    setPets([...pets, newField]);
  };

  const removeField = (index: number) => {
    const data = [...pets];
    data.splice(index, 1);
    setPets(data);
  };

  // Typing is ultra specific here to avoid solving TS errors by using Casting as I think that's a bit heavyhanded for this problem
  // This way, while not being the most attractive, is explicit and easy to tell what's happening type-wise.
  // That being said, this is using React Native specific Types (to my knowledge), so us not using event.target.value can be a bit odd
  const handleNameChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setName(event.nativeEvent.text);
  };

  const handlePetsChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    index: number,
    name: string
  ) => {
    const data = [...pets];
    data[index][name] = event.nativeEvent.text;

    setPets(data);
  };
  const handleContactNumberChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setContactNumber(event.nativeEvent.text);
  };

  const handleLocationChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setLocation(event.nativeEvent.text);
  };

  const handleCityChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    setCity(event.nativeEvent.text);
  };

  const handleCustomerCreation = async () => {
    const customerPayload = {
      name,
      pets,
      location,
      city,
      contactNumber,
    };

    await createCustomer(customerPayload);
    populateCustomerList();
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      avoidKeyboard
      _overlay={{ useRNModal: false, useRNModalOnAndroid: false }}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Create Customer</Modal.Header>
        <Modal.Body>
          <FormControl isRequired>
            <FormControl.Label>Name</FormControl.Label>
            <TextInput
              selectTextOnFocus
              style={input}
              onChange={(event) => handleNameChange(event)}
              value={name}
              returnKeyType="next"
              onSubmitEditing={() => inputRef2.current?.focus()}
              blurOnSubmit={false}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Contact Number</FormControl.Label>
            <TextInput
              selectTextOnFocus
              style={input}
              onChange={(event) => handleContactNumberChange(event)}
              value={contactNumber}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => inputRef3.current?.focus()}
              blurOnSubmit={false}
              ref={inputRef2}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Address</FormControl.Label>
            <TextInput
              selectTextOnFocus
              style={input}
              onChange={(event) => handleLocationChange(event)}
              value={location}
              returnKeyType="next"
              onSubmitEditing={() => inputRef4.current?.focus()}
              blurOnSubmit={false}
              ref={inputRef3}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>City</FormControl.Label>
            <TextInput
              selectTextOnFocus
              style={input}
              onChange={(event) => handleCityChange(event)}
              value={city}
              ref={inputRef4}
            />
          </FormControl>
          <FormControl mt={3}>
            <FormControl.Label>Pets</FormControl.Label>
            {pets.map((pet, index) => {
              return (
                <View key={index}>
                  <TextInput
                    selectTextOnFocus
                    style={input}
                    placeholder="Name"
                    key={`index: ${index} name `}
                    onChange={(event) => handlePetsChange(event, index, "name")}
                    value={pet.name}
                  />

                  <TextInput
                    selectTextOnFocus
                    style={input}
                    placeholder="Breed"
                    key={`index: ${index} breed `}
                    onChange={(event) =>
                      handlePetsChange(event, index, "breed")
                    }
                    value={pet.breed}
                  />

                  <View style={buttonContainer}>
                    <Button
                      key={`${index} AddButton`}
                      onPress={() => addField()}
                      style={button}
                    >
                      <Icon name="plus" size={10} key={`${index} PlusIcon`} />
                    </Button>
                    <Button
                      key={`${index} RemoveButton`}
                      isDisabled={pets.length <= 1}
                      onPress={() => removeField(index)}
                      style={button}
                    >
                      <Icon name="minus" size={10} key={`${index} MinusIcon`} />
                    </Button>
                  </View>
                </View>
              );
            })}
          </FormControl>
        </Modal.Body>
        <Button.Group space={2} style={confirmationButtonContainer}>
          <Button variant="ghost" onPress={closeModal}>
            Cancel
          </Button>
          <Button
            onPress={() => handleCustomerCreation()}
            style={confirmationButton}
          >
            Save
          </Button>
        </Button.Group>
      </Modal.Content>
    </Modal>
  );
};

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
});

export default CreateCustomerModal;
