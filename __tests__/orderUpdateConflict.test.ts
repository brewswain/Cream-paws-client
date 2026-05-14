/// <reference types="jest" />

import { isOrderConflictError } from "../lib/orders/isOrderConflictError";
import { mapOrderUpdatePayloadToApiPayload } from "../lib/orders/mapOrderUpdatePayloadToApi";
import type { OrderUpdatePayload } from "../models/order";

describe("isOrderConflictError", () => {
  it("detects HTTP 409 via response.status", () => {
    expect(isOrderConflictError({ response: { status: 409 } })).toBe(true);
  });

  it("detects stale / conflict message", () => {
    expect(
      isOrderConflictError(new Error("Conflict: order was modified or version is stale"))
    ).toBe(true);
  });

  it("returns false for generic errors", () => {
    expect(isOrderConflictError(new Error("network"))).toBe(false);
  });
});

describe("mapOrderUpdatePayloadToApiPayload", () => {
  const base: OrderUpdatePayload = {
    id: "o1",
    customer_id: "c1",
    delivery_date: "2026-06-01",
    delivery_cost: 1,
    payment_made: false,
    payment_date: "",
    is_delivery: false,
    quantity: 2,
    driver_paid: false,
    warehouse_paid: false,
    retail_price: 10,
    services: [{ description: "Walk" }],
    version: 4,
  };

  it("includes version for optimistic locking", () => {
    const body = mapOrderUpdatePayloadToApiPayload(base);
    expect(body.version).toBe(4);
    expect(body.customerId).toBe("c1");
    expect(body.deliveryDate).toBe("2026-06-01");
  });
});
