/// <reference types="jest" />

import {
  EMPTY_CUSTOMER_LIST,
  resolveCustomersQueryData,
} from "../lib/customers/resolveCustomersQueryData";

describe("resolveCustomersQueryData", () => {
  it("returns the same reference for repeated undefined data (stable useMemo deps)", () => {
    const a = resolveCustomersQueryData(undefined);
    const b = resolveCustomersQueryData(undefined);
    expect(a).toBe(EMPTY_CUSTOMER_LIST);
    expect(a).toBe(b);
  });

  it("returns live query data when present", () => {
    const list = [{ id: "c1", name: "Ann" }] as import("../models/customer").Customer[];
    expect(resolveCustomersQueryData(list)).toBe(list);
  });
});
