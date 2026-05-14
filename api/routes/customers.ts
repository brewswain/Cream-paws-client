import { axiosInstance } from "../http";
import { postCustomerCreate } from "../../lib/customers/postCustomerCreate";
import { putCustomerUpdate } from "../../lib/customers/putCustomerUpdate";
import { queryClient } from "../../lib/queryClient";
import { customerKeys } from "../../lib/queryKeys";
import { Customer, CustomerPayload } from "../../models/customer";
import {
  customerWriteRequestSchema,
  type CustomerWriteRequest,
} from "../../schemas/customerWrite";

function payloadToWriteRequest(customer: CustomerPayload): CustomerWriteRequest {
  const pets = (customer.pets ?? [])
    .filter((p: { name?: string }) => (p.name ?? "").trim().length > 0)
    .map((p: { name: string; breed?: string }) => ({
      name: String(p.name).trim(),
      ...(p.breed && String(p.breed).trim()
        ? { breed: String(p.breed).trim() }
        : {}),
    }));
  return customerWriteRequestSchema.parse({
    name: customer.name.trim(),
    pets,
    city: customer.city?.trim() || undefined,
    contactNumber: customer.contactNumber?.trim() || undefined,
    location: customer.location?.trim() || undefined,
  });
}

/** Legacy helper — prefer `useCreateCustomerMutation`. */
export async function createCustomer(customer: CustomerPayload) {
  const data = await postCustomerCreate(payloadToWriteRequest(customer));
  await queryClient.invalidateQueries({ queryKey: customerKeys.all });
  return data;
}

export async function deleteCustomer(id: string | number) {
  await axiosInstance.delete(`/api/customer/${id}`);
  await queryClient.invalidateQueries({ queryKey: customerKeys.all });
}

/** Legacy helper — prefer `useUpdateCustomerMutation`. */
export async function updateCustomer(id: string | number, customer: Customer) {
  const body = payloadToWriteRequest({
    name: customer.name ?? "",
    pets: (customer.pets as CustomerPayload["pets"]) ?? [],
    city: customer.city,
    contactNumber: customer.contactNumber,
    location: customer.location,
  });
  await putCustomerUpdate(id, body);
  await queryClient.invalidateQueries({ queryKey: customerKeys.all });
}
