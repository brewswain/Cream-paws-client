/// <reference types="jest" />

import {
  orderCreateRequestSchema,
  orderCreateServicesSchema,
} from "../schemas/orderCreate";

describe("orderCreateServicesSchema", () => {
  it("rejects an empty services array", () => {
    expect(() => orderCreateServicesSchema.parse([])).toThrow();
  });

  it("accepts a single service line", () => {
    expect(orderCreateServicesSchema.parse([{ description: "Walk" }])).toHaveLength(1);
  });
});

describe("orderCreateRequestSchema", () => {
  it("parses a minimal valid create payload", () => {
    const v = orderCreateRequestSchema.parse({
      customerId: "c1",
      deliveryDate: "2026-05-01",
      paymentMade: false,
      paymentDate: "",
      isDelivery: false,
      quantity: 1,
      driverPaid: false,
      warehousePaid: false,
      retailPrice: 10,
      services: [{ description: "Walk" }],
    });
    expect(v.customerId).toBe("c1");
  });
});
