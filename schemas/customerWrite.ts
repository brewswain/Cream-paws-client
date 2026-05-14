import { z } from "zod";

export const customerPetFormSchema = z.object({
  name: z.string(),
  breed: z.string().optional(),
});

/** Form values (RHF) — allow empty pet rows; trim on submit. */
export const customerCreateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNumber: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  pets: z.array(customerPetFormSchema),
});

export type CustomerCreateFormValues = z.infer<typeof customerCreateFormSchema>;

/** Wire body POST/PUT `/api/customer` (singleton server). */
export const customerWriteRequestSchema = z.object({
  name: z.string().min(1),
  pets: z
    .array(
      z.object({
        name: z.string().min(1),
        breed: z.string().optional(),
      })
    )
    .default([]),
  city: z.string().optional(),
  contactNumber: z.string().optional(),
  location: z.string().optional(),
});

export type CustomerWriteRequest = z.infer<typeof customerWriteRequestSchema>;

export function formValuesToWriteRequest(
  values: CustomerCreateFormValues
): CustomerWriteRequest {
  const pets = values.pets
    .filter((p) => p.name.trim().length > 0)
    .map((p) => ({
      name: p.name.trim(),
      ...(p.breed?.trim() ? { breed: p.breed.trim() } : {}),
    }));
  return customerWriteRequestSchema.parse({
    name: values.name.trim(),
    contactNumber: values.contactNumber?.trim() || undefined,
    location: values.location?.trim() || undefined,
    city: values.city?.trim() || undefined,
    pets,
  });
}
