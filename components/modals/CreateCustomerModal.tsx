import { useState, useEffect } from "react";
import {
   NativeSyntheticEvent,
   TextInputChangeEventData,
   TextInput,
} from "react-native";
import { Button, FormControl, Input, Modal } from "native-base";
import { createCustomer } from "../../api/routes/customers";
import Icon from "react-native-vector-icons/AntDesign";

interface CreateCustomerModalProps {
   isOpen: boolean;
   setShowModal(booleanStatus: boolean): void;
}

const CreateCustomerModal = ({
   isOpen,
   setShowModal,
}: CreateCustomerModalProps) => {
   const [name, setName] = useState("");
   const [pets, setPets] = useState<any[]>([
      {
         name: "",
         breed: "",
      },
   ]);
   // Used for dynamically rendering a new input for each pet
   const [petFields, setPetFields] = useState([0]);

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
   // That being said, this is using React Native specific Types (to my event), so us not using event.target.value can be a bit odd
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

   return (
      <Modal isOpen={isOpen} onClose={() => setShowModal(false)}>
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
                              key={field}
                              placeholder="Name"
                              onChange={(event) =>
                                 handlePetsChange(event, index, "name")
                              }
                           />

                           <Input
                              placeholder="Breed"
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
               <Button variant="ghost" onPress={() => setShowModal(false)}>
                  Cancel
               </Button>
               <Button onPress={() => createCustomer(name, pets)}>Save</Button>
            </Button.Group>
         </Modal.Content>
      </Modal>
   );
};

export default CreateCustomerModal;
