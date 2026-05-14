import { z } from "zod";

/** GET /api/orders — one row after `orderRowToApi` (camelCase). */
export const orderApiSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  deliveryDate: z.string(),
  deliveryCost: z.number().optional().nullable(),
  paymentMade: z.boolean(),
  paymentDate: z.string(),
  isDelivery: z.boolean(),
  quantity: z.number(),
  driverPaid: z.boolean(),
  warehousePaid: z.boolean(),
  retailPrice: z.number().optional().nullable(),
  services: z.array(z.unknown()),
  version: z.number(),
});

export const orderListResponseSchema = z.array(orderApiSchema);

export type OrderApi = z.infer<typeof orderApiSchema>;
