import { useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

import { Button, FormControl, Input, Modal } from "native-base";

import { createChow } from "../../api";

interface CreateChowProps {
   isOpen: boolean;
   setShowModal(booleanStatus: boolean): void;
   populateChowList(): void;
}

const CreateChowModal = ({
   isOpen,
   setShowModal,
   populateChowList,
}: CreateChowProps) => {
   // Using Chow Interface located at '../models'
   const [chowPayload, setChowPayload] = useState<Chow>();

   const closeModal = () => {
      setShowModal(false);
   };

   const handleChowChange = (
      event: NativeSyntheticEvent<TextInputChangeEventData>,
      name: string
   ) => {
      // TODO: fix type
      let data: any = { ...chowPayload };
      // if (data[index][name] === 'is_paid_for' {
      //    data[index][name] = whatever boolean value
      // })
      //TODO: make this approach work for object. Maybe we use Object.Keys method then
      // remap to an object after
      // data[name] = event.nativeEvent.text;

      data[name] = event.nativeEvent.text;

      setChowPayload(data);
   };

   const handleChowCreation = () => {
      // Heavyhanded, but we should never have undefined here
      createChow(chowPayload!);

      //TODO: create this endpoint in our Chow Page(call to getAllChow)
      populateChowList();
      closeModal();
   };

   return (
      <Modal isOpen={isOpen} onClose={closeModal}>
         <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Create Chow</Modal.Header>
            <Modal.Body>
               <FormControl isRequired>
                  <FormControl.Label>Brand</FormControl.Label>
                  <Input
                     onChange={(event) => handleChowChange(event, "brand")}
                  />
               </FormControl>
               <FormControl isRequired>
                  <FormControl.Label>Target Group</FormControl.Label>
                  <Input
                     onChange={(event) =>
                        handleChowChange(event, "target_group")
                     }
                  />
               </FormControl>
               <FormControl isRequired>
                  <FormControl.Label>Flavour</FormControl.Label>
                  <Input
                     onChange={(event) => handleChowChange(event, "flavour")}
                  />
               </FormControl>
               <FormControl isRequired>
                  <FormControl.Label>Size/Unit</FormControl.Label>
                  <Input
                     onChange={(event) => handleChowChange(event, "size")}
                  />
                  {/* Find way to allow both a size and unit(kg/lb) selector by same input */}
               </FormControl>
               <FormControl isRequired>
                  <FormControl.Label>Quantity</FormControl.Label>
                  <Input
                     onChange={(event) => handleChowChange(event, "quantity")}
                  />
               </FormControl>
               <FormControl isRequired>
                  <FormControl.Label>Wholesale Price</FormControl.Label>
                  <Input
                     onChange={(event) =>
                        handleChowChange(event, "wholesale_price")
                     }
                  />
               </FormControl>
               <FormControl isRequired>
                  <FormControl.Label>Retail Price</FormControl.Label>
                  <Input
                     onChange={(event) =>
                        handleChowChange(event, "retail_price")
                     }
                  />
               </FormControl>
               <FormControl isRequired>
                  <FormControl.Label>Is Paid For</FormControl.Label>
                  {/* We just need a checkbox as this is purely a boolean*/}
               </FormControl>
            </Modal.Body>
            <Button.Group space={2}>
               <Button variant="ghost" onPress={closeModal}>
                  Cancel
               </Button>
               <Button onPress={() => handleChowCreation()}>Save</Button>
            </Button.Group>
         </Modal.Content>
      </Modal>
   );
};

export default CreateChowModal;
