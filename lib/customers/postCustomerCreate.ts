import { axiosInstance } from "../../api/http";
import type { CustomerWriteRequest } from "../../schemas/customerWrite";

export async function postCustomerCreate(body: CustomerWriteRequest) {
  const res = await axiosInstance.post<unknown>("/api/customer", body);
  return res.data;
}
