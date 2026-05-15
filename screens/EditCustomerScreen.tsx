import { useEffect, useMemo, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button, Input } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

import { RootStackScreenProps } from "../types";
import {
  Header,
  SubHeader,
} from "../components/details/DetailScreenComponents";
import { Customer } from "../models/customer";
import {
  customerCreateFormSchema,
  formValuesToWriteRequest,
  type CustomerCreateFormValues,
} from "../schemas/customerWrite";
import { useUpdateCustomerMutation } from "../hooks/useUpdateCustomerMutation";
import { getCustomerWriteValidationFieldMap } from "../lib/customers/customerFormServerErrors";
import type { CustomerWritableFieldPath } from "../lib/forms/validationResponseFields";

interface EditCustomerScreenProps {
  navigation: RootStackScreenProps<"EditCustomer">["navigation"];
  route: RootStackScreenProps<"EditCustomer">["route"];
}

function customerToFormValues(customer: Customer): CustomerCreateFormValues {
  return {
    name: customer.name ?? "",
    contactNumber: customer.contactNumber ?? "",
    location: customer.location ?? "",
    city: customer.city ?? "",
    pets:
      customer.pets && customer.pets.length > 0
        ? customer.pets.map((p) => ({
            name: p.name,
            breed: p.breed ?? "",
          }))
        : [{ name: "", breed: "" }],
  };
}

const EditCustomerScreen = ({ route }: EditCustomerScreenProps) => {
  const navigate = useNavigation();
  const updateMutation = useUpdateCustomerMutation();
  const customerId = route.params.customer.id;

  const defaultValues = useMemo(
    () => customerToFormValues(route.params.customer),
    [route.params.customer]
  );

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CustomerCreateFormValues>({
    resolver: zodResolver(customerCreateFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(customerToFormValues(route.params.customer));
  }, [route.params.customer, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: "pets" });

  const onSubmit = handleSubmit(async (values) => {
    const body = formValuesToWriteRequest(values);
    try {
      await updateMutation.mutateAsync({ id: customerId, body });
      navigate.navigate("Customers" as never);
    } catch (e) {
      const map = getCustomerWriteValidationFieldMap(e);
      const paths = Object.keys(map) as CustomerWritableFieldPath[];
      if (paths.length === 0) return;
      for (const path of paths) {
        const msg = map[path];
        if (msg) setError(path, { message: msg });
      }
      setError("root", {
        type: "server",
        message: "Please correct the highlighted fields.",
      });
    }
  });

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        backgroundColor: "#f1f2f3",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 32,
      }}
    >
      <Header>Customer Details</Header>
      {errors.root?.message ? (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Could not save</Text>
          <Text style={styles.summaryBody}>{errors.root.message}</Text>
        </View>
      ) : null}
      <View style={{ width: "92%", maxWidth: 420 }}>
        <SubHeader>Name *</SubHeader>
        <FormControlBlock error={errors.name?.message}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                width="100%"
                bg="gray.100"
                py={3}
                px={3}
                fontSize="md"
              />
            )}
          />
        </FormControlBlock>

        <SubHeader>Contact Number</SubHeader>
        <FormControlBlock error={errors.contactNumber?.message}>
          <Controller
            control={control}
            name="contactNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ""}
                keyboardType="phone-pad"
                width="100%"
                bg="gray.100"
                py={3}
                px={3}
                fontSize="md"
              />
            )}
          />
        </FormControlBlock>

        <SubHeader>Address</SubHeader>
        <FormControlBlock error={errors.location?.message}>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ""}
                width="100%"
                bg="gray.100"
                py={3}
                px={3}
                fontSize="md"
              />
            )}
          />
        </FormControlBlock>

        <SubHeader>City</SubHeader>
        <FormControlBlock error={errors.city?.message}>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ""}
                width="100%"
                bg="gray.100"
                py={3}
                px={3}
                fontSize="md"
              />
            )}
          />
        </FormControlBlock>
      </View>

      <Header>Pets</Header>
      {fields.map((field, petIndex) => (
        <View key={field.id} style={{ paddingTop: 4, width: "92%", maxWidth: 420 }}>
          <SubHeader>Pet name *</SubHeader>
          <FormControlBlock error={errors.pets?.[petIndex]?.name?.message}>
            <Controller
              control={control}
              name={`pets.${petIndex}.name`}
              render={({ field: f }) => (
                <Input
                  onBlur={f.onBlur}
                  onChangeText={f.onChange}
                  value={f.value}
                  width="100%"
                  bg="gray.100"
                  py={3}
                  px={3}
                  fontSize="md"
                />
              )}
            />
          </FormControlBlock>
          <SubHeader>Breed</SubHeader>
          <FormControlBlock error={errors.pets?.[petIndex]?.breed?.message}>
            <Controller
              control={control}
              name={`pets.${petIndex}.breed`}
              render={({ field: f }) => (
                <Input
                  onBlur={f.onBlur}
                  onChangeText={f.onChange}
                  value={f.value ?? ""}
                  width="100%"
                  bg="gray.100"
                  py={3}
                  px={3}
                  fontSize="md"
                />
              )}
            />
          </FormControlBlock>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              onPress={() => append({ name: "", breed: "" })}
            >
              <Icon name="plus" size={10} />
            </Button>
            <Button
              isDisabled={fields.length <= 1}
              onPress={() => remove(petIndex)}
              style={styles.button}
            >
              <Icon name="minus" size={10} />
            </Button>
          </View>
        </View>
      ))}

      <Button.Group space={2} style={styles.confirmationButtonContainer}>
        <Button variant="ghost" onPress={() => navigate.navigate("Customers" as never)}>
          Cancel
        </Button>
        <Button
          style={styles.confirmationButton}
          onPress={() => void onSubmit()}
          isLoading={updateMutation.isPending}
        >
          Save
        </Button>
      </Button.Group>
    </ScrollView>
  );
};

function FormControlBlock({
  children,
  error,
}: {
  children: ReactNode;
  error?: string;
}) {
  return (
    <View style={{ marginBottom: 4 }}>
      {children}
      {error ? (
        <View style={{ marginTop: 2 }}>
          <SubHeader>{error}</SubHeader>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
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
  summaryBox: {
    width: "92%",
    maxWidth: 420,
    backgroundColor: "#fff3cd",
    borderLeftWidth: 4,
    borderLeftColor: "#c9a227",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  summaryTitle: {
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 15,
  },
  summaryBody: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default EditCustomerScreen;
