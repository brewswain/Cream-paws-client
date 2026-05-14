import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, Input, Modal } from "native-base";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { useCreateCustomerMutation } from "../../hooks/useCreateCustomerMutation";
import {
  customerCreateFormSchema,
  formValuesToWriteRequest,
  type CustomerCreateFormValues,
} from "../../schemas/customerWrite";

const defaultValues: CustomerCreateFormValues = {
  name: "",
  contactNumber: "",
  location: "",
  city: "",
  pets: [{ name: "", breed: "" }],
};

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
  const createMutation = useCreateCustomerMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerCreateFormValues>({
    resolver: zodResolver(customerCreateFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "pets" });

  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  const closeModal = () => {
    setShowModal(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const body = formValuesToWriteRequest(values);
      await createMutation.mutateAsync(body);
      populateCustomerList();
      closeModal();
    } catch {
      /* toast handled in mutation */
    }
  });

  const { button, buttonContainer, confirmationButton, confirmationButtonContainer } =
    styles;

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
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormControl.Label>Name</FormControl.Label>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  returnKeyType="next"
                />
              )}
            />
            <FormControl.ErrorMessage>{errors.name?.message}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl mt={2}>
            <FormControl.Label>Contact Number</FormControl.Label>
            <Controller
              control={control}
              name="contactNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ""}
                  keyboardType="phone-pad"
                />
              )}
            />
          </FormControl>

          <FormControl mt={2}>
            <FormControl.Label>Address</FormControl.Label>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input onBlur={onBlur} onChangeText={onChange} value={value ?? ""} />
              )}
            />
          </FormControl>

          <FormControl mt={2}>
            <FormControl.Label>City</FormControl.Label>
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input onBlur={onBlur} onChangeText={onChange} value={value ?? ""} />
              )}
            />
          </FormControl>

          <FormControl mt={3}>
            <FormControl.Label>Pets</FormControl.Label>
            {fields.map((field, index) => (
              <View key={field.id} style={{ marginBottom: 8 }}>
                <Controller
                  control={control}
                  name={`pets.${index}.name`}
                  render={({ field: f }) => (
                    <Input
                      placeholder="Name"
                      onBlur={f.onBlur}
                      onChangeText={f.onChange}
                      value={f.value}
                      mb={2}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`pets.${index}.breed`}
                  render={({ field: f }) => (
                    <Input
                      placeholder="Breed"
                      onBlur={f.onBlur}
                      onChangeText={f.onChange}
                      value={f.value ?? ""}
                    />
                  )}
                />
                <View style={buttonContainer}>
                  <Button onPress={() => append({ name: "", breed: "" })} style={button}>
                    <Icon name="plus" size={10} />
                  </Button>
                  <Button
                    isDisabled={fields.length <= 1}
                    onPress={() => remove(index)}
                    style={button}
                  >
                    <Icon name="minus" size={10} />
                  </Button>
                </View>
              </View>
            ))}
          </FormControl>
        </Modal.Body>
        <Button.Group space={2} style={confirmationButtonContainer}>
          <Button variant="ghost" onPress={closeModal}>
            Cancel
          </Button>
          <Button
            onPress={() => void onSubmit()}
            style={confirmationButton}
            isLoading={createMutation.isPending}
          >
            Save
          </Button>
        </Button.Group>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
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
