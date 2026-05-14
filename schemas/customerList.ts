import { z } from "zod";

/** GET /api/customer — one row after `customerRowToApi` (singleton server). */
export const customerListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  contactNumber: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
});

export const customerListResponseSchema = z.array(customerListItemSchema);

export type CustomerListItem = z.infer<typeof customerListItemSchema>;
