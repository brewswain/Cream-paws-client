import { useState, useEffect } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

import { Button, FormControl, Input, Modal, Radio } from "native-base";

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
   // TODO: Fix our default params so that this is less bulky
   const [chowPayload, setChowPayload] = useState<Chow>({
      brand: "",
      id: "",
      target_group: "",
      flavour: "",
      size: 0,
      unit: "lb",
      quantity: 1,
      wholesale_price: 0,
      retail_price: 0,
      is_paid_for: false,
   });
   const [unit, setUnit] = useState<string>("lb");
   const [isPaidFor, setIsPaidFor] = useState<string | boolean>("false");
   const [errors, setErrors] = useState({});

   const closeModal = () => {
      setShowModal(false);
   };

   // Naive solution at checking to make sure that our form isn't incomplete--This solution
   // Assumes a static length of attributes, and should thus be the first place to refactor
   // when we have time.
   const isIncomplete = chowPayload && Object.values(chowPayload!).length < 9;

   const handleChowChange = (
      event: NativeSyntheticEvent<TextInputChangeEventData>,
      name: string
   ) => {
      // TODO: fix type
      let data: any = { ...chowPayload };
      data[name] = event.nativeEvent.text;

      setChowPayload(data);
   };

   const validateFormEntry = () => {
      if (chowPayload?.brand === undefined) {
         setErrors({ ...errors, message: "Brand is required" });
         return false;
      } else if (chowPayload?.flavour === undefined) {
         setErrors({ ...errors, message: "Flavour is required" });
         return false;
      }
      return true;
   };

   const handleChowCreation = async () => {
      // Heavyhanded use of !, but we should never have undefined here
      // TODO: figure out why removing console.log causes API call to fail...most likely some async/sync problems here, where payload isn't
      // being updated properly before it gets sent over
      console.log({ chowPayload });
      await createChow(chowPayload!);
      populateChowList();
      closeModal();
   };

   const convertStringToBoolean = () => {
      if (isPaidFor === "true") {
         setIsPaidFor(true);
      } else {
         setIsPaidFor(false);
      }
   };

   const handleSubmit = () => {
      let data: any = { ...chowPayload };
      convertStringToBoolean();
      data["unit"] = unit;
      data["is_paid_for"] = isPaidFor;

      setChowPayload(data);

      validateFormEntry()
         ? handleChowCreation()
         : alert(
              "Error creating chow! This is a form validation Error, so please check to make sure that no fields are empty"
           );
   };

   return (
      <Modal isOpen={isOpen} onClose={closeModal} avoidKeyboard>
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
                  <FormControl.Label>Size</FormControl.Label>
                  <Input
                     onChange={(event) => handleChowChange(event, "size")}
                  />
                  {/* Find way to allow both a size and unit(kg/lb) selector by same input */}
               </FormControl>
               <FormControl isRequired>
                  <FormControl.Label>Unit</FormControl.Label>
                  <Radio.Group
                     name="SizeGroup"
                     // value={unit}
                     defaultValue="lb"
                     onChange={(nextValue) => {
                        setUnit(nextValue);
                     }}
                  >
                     <Radio value="lb" my={1} size="sm">
                        lb
                     </Radio>
                     <Radio value="kg" my={1} size="sm">
                        kg
                     </Radio>
                  </Radio.Group>
                  {/* We just need a checkbox as this is purely a boolean*/}
               </FormControl>
               {/* <FormControl isRequired>
                  <FormControl.Label>Quantity</FormControl.Label>
                  <Input
                     onChange={(event) => handleChowChange(event, "quantity")}
                  />
               </FormControl> */}
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
               {/* <FormControl isRequired>
                  <FormControl.Label>Is Paid For</FormControl.Label>
                  <Radio.Group
                     name="IsPaidForGroup"
                     value={isPaidFor as string}
                     onChange={(nextValue) => setIsPaidFor(nextValue)}
                  >
                     <Radio value="false" my={1} colorScheme="red" size="sm">
                        False
                     </Radio>
                     <Radio value="true" my={1} colorScheme="green" size="sm">
                        True
                     </Radio>
                  </Radio.Group>
               </FormControl>
                   */}
            </Modal.Body>
            <Button.Group space={2}>
               <Button variant="ghost" onPress={closeModal}>
                  Cancel
               </Button>
               <Button
                  onPress={() => handleSubmit()}
                  isDisabled={!validateFormEntry}
               >
                  Save
               </Button>
            </Button.Group>
         </Modal.Content>
      </Modal>
   );
};

export default CreateChowModal;
