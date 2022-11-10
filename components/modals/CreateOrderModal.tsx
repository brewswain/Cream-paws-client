import { useState, useEffect } from "react";
import {
   NativeSyntheticEvent,
   StyleSheet,
   TextInput,
   TextInputChangeEventData,
} from "react-native";

import {
   Button,
   CheckIcon,
   FormControl,
   Input,
   Modal,
   Select,
} from "native-base";
import Icon from "react-native-vector-icons/AntDesign";

interface CreateOrderModalProps {
   isOpen: boolean;
   setShowModal(booleanStatus: boolean): void;
   populateOrdersList(): void;
   chow?: Chow[];
   customers?: Customer[];
}

// const testPayload = {
//    delivery_date: "test order",
//    payment_made: true,
//    payment_date: "hello",
//    is_delivery: true,
//    driver_paid: false,
//    warehouse_paid: true,
//    customer_id: "636ade22d10a673e13bfd2b5",
//    chow_id: "636ade34e20197302f90d6c6",
// };

const CreateOrderModal = ({
   isOpen,
   setShowModal,
   populateOrdersList,
   chow,
   customers,
}: CreateOrderModalProps) => {
   const [chowInputs, setChowInputs] = useState<any[]>([
      {
         chow_id: "",
         quantity: 0,
      },
   ]);
   const [selectedChow, setSelectedChow] = useState("");
   const [selectedCustomer, setSelectedCustomer] = useState<string>();
   // Loose typing on purpose for now, type SHOULD be Order.
   const [orders, setOrders] = useState<any[]>([{}]);

   const closeModal = () => {
      setShowModal(false);
   };

   const addField = () => {
      let newField = { chow_name: "", quantity: 0 };
      setChowInputs([...chowInputs, newField]);
   };

   const removeField = (index: number) => {
      let data = [...chowInputs];
      data.splice(index, 1);

      console.log({ data });
      setChowInputs(data);
   };

   const renderChowDropdown = () => {
      return chow?.map((item) => {
         return (
            <Select.Item
               label={`${item.brand} - ${item.size}${item.unit}`}
               value={`${item.id}`}
            />
         );
      });
   };

   const orderPayload = {
      customer_id: selectedCustomer,
      // add chow object
   };

   const renderCustomersDropdown = () => {
      return customers?.map((customer) => {
         return <Select.Item label={customer.name} value={customer.id} />;
      });
   };

   const handleChowChange = (
      event: NativeSyntheticEvent<TextInputChangeEventData>,
      index: number,
      name: string
   ) => {
      let data = [...chowInputs];
      data[index][name] = event.nativeEvent.text;
      console.log({ data });

      setChowInputs(data);
   };
   // const handleOrderChange = (
   //    event: NativeSyntheticEvent<TextInputChangeEventData>,
   //    index: number,
   //    name: string
   // ) => {
   //    // TODO: make this a dropdown that decides between chow and services--walking,
   //    //  grooming, training, etc
   //    let data = [...orders];
   //    data[index][name] = event.nativeEvent.text;
   //    setOrders(data);
   // };

   const handleChowSelected = (
      itemValue: string,
      index: number,
      name: string
   ) => {
      setSelectedChow(itemValue);

      // let data = [...orders];
      // data[index][name] = itemValue;
      let data = [...chowInputs];
      data[index][name] = itemValue;

      setChowInputs(data);
      console.log({ data });
   };

   const handleCustomerSelected = (itemValue: string, name: string) => {
      setSelectedCustomer(itemValue);
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

   useEffect(() => {
      console.log({ orders, chowInputs, selectedCustomer });
   }, [selectedCustomer, orders, chowInputs]);

   return (
      <Modal isOpen={isOpen} onClose={closeModal} avoidKeyboard>
         <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Create Order</Modal.Header>
            <Modal.Body>
               {/* TODO: Add in differentiation for order-type later */}

               {/* <FormControl isRequired>
                  <FormControl.Label>Order Type</FormControl.Label>
                  <Input
                     onChange={(event) =>
                        handleOrderChange(event, index, "name")
                     }
                  />
               </FormControl>
             */}
               <FormControl mt={3}>
                  <FormControl.Label>Customer</FormControl.Label>
                  {customers && customers?.length > 0 ? (
                     <Select
                        minWidth="200"
                        selectedValue={selectedCustomer}
                        accessibilityLabel="Choose Customer"
                        placeholder="Choose Customer"
                        _selectedItem={{
                           bg: "teal.600",
                           endIcon: <CheckIcon size={5} />,
                        }}
                        mt="1"
                        onValueChange={(itemValue) =>
                           handleCustomerSelected(itemValue, "customer_id")
                        }
                     >
                        {chow && renderCustomersDropdown()}
                     </Select>
                  ) : null}
               </FormControl>
               <FormControl mt={3}>
                  <FormControl.Label>Orders</FormControl.Label>
                  {chowInputs.map((field, index) => {
                     return (
                        <>
                           <Select
                              minWidth="200"
                              selectedValue={chowInputs[index].chow_name}
                              accessibilityLabel="Choose Chow"
                              placeholder="Choose Chow"
                              _selectedItem={{
                                 bg: "teal.600",
                                 endIcon: <CheckIcon size={5} />,
                              }}
                              mt="1"
                              onValueChange={(itemValue) =>
                                 handleChowSelected(
                                    itemValue,
                                    index,
                                    "chow_name"
                                 )
                              }
                           >
                              {chow && renderChowDropdown()}
                           </Select>

                           <TextInput
                              style={styles.input}
                              placeholder="Quantity"
                              onChange={(event) =>
                                 handleChowChange(event, index, "quantity")
                              }
                              value={field.quantity}
                           />
                           <Button onPress={() => addField()}>
                              <Icon name="plus" size={10} />
                           </Button>
                           <Button
                              isDisabled={chowInputs.length <= 1}
                              onPress={() => removeField(index)}
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
               <Button onPress={() => handleOrderCreation()}>Save</Button>
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

export default CreateOrderModal;
