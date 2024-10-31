import { axiosInstance } from "../api";
import { Customer, CustomerPayload } from "../../models/customer";
import { supabase } from "../../utils/supabase";
import { logNewSupabaseError } from "../error";

// Creating default param in case we don't have any pets added
export const createCustomer = async (customer: CustomerPayload) => {
  const { name, pets, contactNumber, location, city } = customer;
  try {
    const response = await axiosInstance.post("/customer", {
      name,
      pets,
      city,
      contactNumber,
      location,
    });
    return response.data;
  } catch (error) {
    alert(error);
  }
};

export const deleteCustomer = async (id: number) => {
  try {
    await axiosInstance.delete(`/customer/${id}`);
  } catch (error) {
    // TODO: use toasts instead of alerts
    alert(error);
  }
};

export const findCustomer = async (id: number) => {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .returns<Customer>()
    .single();

  if (error) {
    logNewSupabaseError("Error finding Customer: ", error);
    throw new Error(error.message);
  }

  return data;
};

export const getAllCustomers = async () => {
  const { data, error } = await supabase
    .from("customers")
    .select(
      `
        id, name, contact_number, location, city, pets(name, breed)
      `
    )
    .returns<Customer[]>()
    .order("name");

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateCustomer = async (id: number, customer: Customer) => {
  try {
    await axiosInstance.put(`/customer/${id}`, customer);
  } catch (error) {
    alert(error);
  }
};
