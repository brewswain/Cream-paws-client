import { z } from "zod";

/** Client-side guard — at least one service line before POST `/api/orders`. */
export const orderCreateServicesSchema = z.array(z.unknown()).min(1);

export const orderCreateRequestSchema = z.object({
  customerId: z.string().min(1),
  deliveryDate: z.string().min(1),
  deliveryCost: z.number().nullable().optional(),
  paymentMade: z.boolean(),
  paymentDate: z.string(),
  isDelivery: z.boolean(),
  quantity: z.number().int().positive(),
  driverPaid: z.boolean(),
  warehousePaid: z.boolean(),
  retailPrice: z.number().nullable().optional(),
  services: orderCreateServicesSchema,
});

export type OrderCreateRequest = z.infer<typeof orderCreateRequestSchema>;
