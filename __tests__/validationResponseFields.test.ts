/// <reference types="jest" />

import {
  extractValidationFieldMessagesFromBody,
  mapCustomerApiKeysToFormPaths,
} from "../lib/forms/validationResponseFields";

describe("extractValidationFieldMessagesFromBody", () => {
  it("reads nested errors object with string arrays (Nest-style)", () => {
    const m = extractValidationFieldMessagesFromBody({
      message: "Validation failed",
      errors: {
        name: ["Name is required"],
        contactNumber: ["Invalid phone"],
      },
    });
    expect(m).toEqual({
      name: "Name is required",
      contactNumber: "Invalid phone",
    });
  });

  it("reads fieldErrors map of strings", () => {
    const m = extractValidationFieldMessagesFromBody({
      fieldErrors: {
        city: "Unknown city",
      },
    });
    expect(m).toEqual({ city: "Unknown city" });
  });

  it("returns empty object for non-objects", () => {
    expect(extractValidationFieldMessagesFromBody(null)).toEqual({});
    expect(extractValidationFieldMessagesFromBody("x")).toEqual({});
  });
});

describe("mapCustomerApiKeysToFormPaths", () => {
  it("maps pets.0.name to RHF path", () => {
    expect(
      mapCustomerApiKeysToFormPaths({
        "pets.0.name": "Required",
        name: "Too short",
      })
    ).toEqual({
      "pets.0.name": "Required",
      name: "Too short",
    });
  });
});
