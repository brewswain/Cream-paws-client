/// <reference types="jest" />

import { axiosInstance } from "../api/http";
import { postCustomerCreate } from "../lib/customers/postCustomerCreate";
import { putCustomerUpdate } from "../lib/customers/putCustomerUpdate";
import {
  customerCreateFormSchema,
  customerWriteRequestSchema,
  formValuesToWriteRequest,
} from "../schemas/customerWrite";

jest.mock("../api/http", () => ({
  axiosInstance: {
    post: jest.fn(),
    put: jest.fn(),
  },
}));

describe("customerCreateFormSchema", () => {
  it("rejects empty name", () => {
    const r = customerCreateFormSchema.safeParse({
      name: "",
      pets: [{ name: "", breed: "" }],
    });
    expect(r.success).toBe(false);
  });
});

describe("formValuesToWriteRequest", () => {
  it("drops blank pet rows and trims fields", () => {
    const body = formValuesToWriteRequest({
      name: "  Ann  ",
      contactNumber: " 555 ",
      location: "",
      city: undefined,
      pets: [
        { name: "", breed: "x" },
        { name: " Rex ", breed: " mutt " },
      ],
    });
    expect(body.name).toBe("Ann");
    expect(body.contactNumber).toBe("555");
    expect(body.pets).toEqual([{ name: "Rex", breed: "mutt" }]);
  });
});

describe("customerWriteRequestSchema", () => {
  it("accepts empty pets array", () => {
    expect(
      customerWriteRequestSchema.parse({
        name: "Solo",
        pets: [],
      })
    ).toEqual({ name: "Solo", pets: [] });
  });
});

describe("postCustomerCreate", () => {
  beforeEach(() => {
    (axiosInstance.post as jest.Mock).mockReset();
  });

  it("POSTs parsed body to /api/customer", async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValue({ data: { id: "1" } });
    const body = customerWriteRequestSchema.parse({
      name: "Ann",
      pets: [{ name: "Rex" }],
    });
    await postCustomerCreate(body);
    expect(axiosInstance.post).toHaveBeenCalledWith("/api/customer", body);
  });
});

describe("putCustomerUpdate", () => {
  beforeEach(() => {
    (axiosInstance.put as jest.Mock).mockReset();
  });

  it("PUTs to /api/customer/:id", async () => {
    (axiosInstance.put as jest.Mock).mockResolvedValue({ data: {} });
    const body = customerWriteRequestSchema.parse({
      name: "Ann",
      pets: [],
    });
    await putCustomerUpdate("c1", body);
    expect(axiosInstance.put).toHaveBeenCalledWith("/api/customer/c1", body);
  });
});
