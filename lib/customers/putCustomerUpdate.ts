import { axiosInstance } from "../../api/http";
import type { CustomerWriteRequest } from "../../schemas/customerWrite";

export async function putCustomerUpdate(
  id: string | number,
  body: CustomerWriteRequest
) {
  await axiosInstance.put(`/api/customer/${id}`, body);
}
