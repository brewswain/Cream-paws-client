import { useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

import { Button, FormControl, Input, Modal } from "native-base";
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
   const [petFields, setPetFields] = useState([0]);
   const [name, setName] = useState("");
   const [pets, setPets] = useState<any[]>([
      {
         name: "",
         breed: "",
      },
   ]);

   const closeModal = () => {
      setShowModal(false);
   };

   const addField = (fieldId: number) => {
      let fieldsArray = [];
      fieldsArray = [...petFields, fieldId + 1];

      setPetFields(fieldsArray);
   };

   const removeField = (fieldId: number) => {
      const filteredFields = petFields.filter((field) => field != fieldId);

      setPetFields(filteredFields);
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
      <Modal isOpen={isOpen} onClose={closeModal}>
         <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Create Customer</Modal.Header>
            <Modal.Body>
               <FormControl isRequired>
                  <FormControl.Label>Name</FormControl.Label>
                  <Input onChange={handleNameChange} />
               </FormControl>
               <FormControl mt={3}>
                  <FormControl.Label>Pets</FormControl.Label>
                  {petFields.map((field, index) => {
                     return (
                        <>
                           <Input
                              key={`name index: ${field}`}
                              placeholder="Name"
                              onChange={(event) =>
                                 handlePetsChange(event, index, "name")
                              }
                           />

                           <Input
                              placeholder="Breed"
                              key={`breed index: ${field}`}
                              onChange={(event) =>
                                 handlePetsChange(event, index, "breed")
                              }
                           />
                           <Button onPress={() => addField(index)}>
                              <Icon name="plus" size={10} />
                           </Button>
                           <Button
                              isDisabled={petFields.length <= 1}
                              onPress={() => removeField(field)}
                           >
                              <Icon name="minus" size={10} />
                           </Button>
                        </>
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

export default CreateCustomerModal;
