import { z } from "zod";

/** Shared sign-in / sign-up fields (trim email on submit in UI). */
export const authCredentialSchema = z.object({
  email: z.string().trim().pipe(z.email({ error: "Enter a valid email address." })),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
});

export type AuthCredentialValues = z.infer<typeof authCredentialSchema>;
