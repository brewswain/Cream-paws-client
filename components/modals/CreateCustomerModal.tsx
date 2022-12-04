import { useState, useEffect } from "react";
import {
   NativeSyntheticEvent,
   StyleSheet,
   TextInput,
   TextInputChangeEventData,
   View,
} from "react-native";

import { Button, FormControl, Modal } from "native-base";
import Icon from "react-native-vector-icons/AntDesign";

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
   const [name, setName] = useState("");
   const [pets, setPets] = useState<any[]>([{ name: "", breed: "" }]);

   const closeModal = () => {
      setShowModal(false);
   };

   const addField = () => {
      let newField = { name: "", breed: "" };
      setPets([...pets, newField]);
   };

   const removeField = (index: number) => {
      let data = [...pets];
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
      let data = [...pets];
      data[index][name] = event.nativeEvent.text;

      setPets(data);
   };

   const handleCustomerCreation = () => {
      createCustomer(name, pets);
      populateCustomerList();
      closeModal();
   };

   return (
      <Modal isOpen={isOpen} onClose={closeModal} avoidKeyboard>
         <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Create Customer</Modal.Header>
            <Modal.Body>
               <FormControl isRequired>
                  <FormControl.Label>Name</FormControl.Label>
                  <TextInput
                     style={styles.input}
                     placeholder="Name"
                     onChange={(event) => handleNameChange(event)}
                     value={name}
                  />
               </FormControl>
               <FormControl mt={3}>
                  <FormControl.Label>Pets</FormControl.Label>
                  {pets.map((pet, index) => {
                     return (
                        <View key={`${pet.name} - ${pet.breed}`}>
                           <TextInput
                              style={styles.input}
                              placeholder="Name"
                              key={`${index} name`}
                              onChange={(event) =>
                                 handlePetsChange(event, index, "name")
                              }
                              value={pet.name}
                           />

                           <TextInput
                              style={styles.input}
                              placeholder="Breed"
                              key={`${name} name`}
                              onChange={(event) =>
                                 handlePetsChange(event, index, "breed")
                              }
                              value={pet.breed}
                           />

                           <Button
                              key={`${index} AddButton`}
                              onPress={() => addField()}
                           >
                              <Icon
                                 name="plus"
                                 size={10}
                                 key={`${index} PlusIcon`}
                              />
                           </Button>
                           <Button
                              key={`${index} RemoveButton`}
                              isDisabled={pets.length <= 1}
                              onPress={() => removeField(index)}
                           >
                              <Icon
                                 name="minus"
                                 size={10}
                                 key={`${index} MinusIcon`}
                              />
                           </Button>
                        </View>
                     );
                  })}
               </FormControl>
            </Modal.Body>
            <Button.Group space={2}>
               <Button variant="ghost" onPress={closeModal}>
                  Cancel
               </Button>
               <Button onPress={() => handleCustomerCreation()}>Save</Button>
            </Button.Group>
         </Modal.Content>
      </Modal>
   );
};

const styles = StyleSheet.create({
   input: {
      margin: 5,
      marginBottom: 2,
      marginTop: 0,
      paddingLeft: 5,
      borderColor: "#9f9f9f",
      width: 270,
      borderRadius: 4,
      borderWidth: 1,
   },
});

export default CreateCustomerModal;
