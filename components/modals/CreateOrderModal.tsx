import { useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

import { Button, FormControl, Input, Modal } from "native-base";

import { createCustomer } from "../../api";

interface CreateOrderModalProps {
   isOpen: boolean;
   setShowModal(booleanStatus: boolean): void;
   populateOrdersList(): void;
}

const CreateOrderModal = ({
   isOpen,
   setShowModal,
   populateOrdersList,
}: CreateOrderModalProps) => {
   const closeModal = () => {
      setShowModal(false);
   };

   const handleOrderTypeChange = () => {
      // TODO: make this a dropdown that decides between chow and services--walking,
      //  grooming, training, etc
   };

   const handleOrderCreation = () => {
      // TODO: Keep as last function before return statement, should take a payload and
      // do stuff™️.
      // Goals: use form inputs to construct a payload which is sent to our api. should lessen
      // code sprawl. Check <CreateCustomerModal /> -- handlePetsChange() (line 56) for
      // reference
      populateOrdersList();
      closeModal();
   };

   return (
      <Modal isOpen={isOpen} onClose={closeModal}>
         <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Create Order</Modal.Header>
            <Modal.Body>
               <FormControl isRequired>
                  <FormControl.Label>Order Type</FormControl.Label>
                  <Input onChange={handleOrderTypeChange} />
               </FormControl>
            </Modal.Body>
            <Button.Group space={2}>
               <Button variant="ghost" onPress={closeModal}>
                  Cancel
               </Button>
               <Button onPress={() => handleOrderCreation()}>Save</Button>
            </Button.Group>
         </Modal.Content>
      </Modal>
   );
};

export default CreateOrderModal;
