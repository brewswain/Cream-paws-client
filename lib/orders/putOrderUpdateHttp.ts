import { axiosInstance } from "../../api/http";
import { mapApiOrderToStore } from "../customers/mapApiOrderToStore";
import type { OrderFromSupabase, OrderUpdatePayload } from "../../models/order";
import { orderApiSchema } from "../../schemas/orderApi";
import { mapOrderUpdatePayloadToApiPayload } from "./mapOrderUpdatePayloadToApi";

export async function putOrderUpdateHttp(
  payload: OrderUpdatePayload,
  customerNameForMapping: string
): Promise<OrderFromSupabase> {
  const body = mapOrderUpdatePayloadToApiPayload(payload);
  const res = await axiosInstance.put<unknown>(`/api/orders/${payload.id}`, body);
  const parsed = orderApiSchema.parse(res.data);
  return mapApiOrderToStore(parsed, customerNameForMapping);
}
