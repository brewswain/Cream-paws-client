/// <reference types="jest" />

import { authCredentialSchema } from "../schemas/authForms";

describe("authCredentialSchema", () => {
  it("rejects invalid email", () => {
    const r = authCredentialSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });
    expect(r.success).toBe(false);
  });

  it("accepts valid email and password meeting minimum length", () => {
    const r = authCredentialSchema.safeParse({
      email: "driver@example.com",
      password: "secret123",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe("driver@example.com");
    }
  });
});
