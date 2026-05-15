/// <reference types="jest" />

import axios from "axios";

import { NormalizedHttpError } from "../lib/api/normalizedHttpError";
import { getCustomerWriteValidationFieldMap } from "../lib/customers/customerFormServerErrors";

describe("getCustomerWriteValidationFieldMap", () => {
  it("maps validation response body fields when wrapped in NormalizedHttpError", () => {
    const axiosErr = Object.assign(new Error("422"), {
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          errors: {
            name: ["Name already in use"],
            "pets.0.name": ["Pet name required"],
          },
        },
      },
    });

    expect(axios.isAxiosError(axiosErr)).toBe(true);

    const wrapped = new NormalizedHttpError({
      message: "Request could not be validated.",
      category: "validation",
      statusCode: 422,
      causeError: axiosErr,
    });

    expect(getCustomerWriteValidationFieldMap(wrapped)).toEqual({
      name: "Name already in use",
      "pets.0.name": "Pet name required",
    });
  });
});
