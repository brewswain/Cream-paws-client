/// <reference types="jest" />

import { axiosInstance } from "../api/http";
import { fetchCustomersWithOrders } from "../lib/customers/fetchCustomersWithOrders";
import { mergeOrdersIntoCustomers } from "../lib/customers/mergeOrdersIntoCustomers";
import { partitionOrdersByPayment } from "../lib/customers/partitionOrdersByPayment";
import { pickCustomerFromMergedList } from "../lib/customers/pickCustomerFromMergedList";
import { flattenOrdersFromCustomers } from "../lib/orders/flattenOrdersFromCustomers";
import { customerListResponseSchema } from "../schemas/customerList";
import { orderListResponseSchema } from "../schemas/orderApi";

jest.mock("../api/http", () => ({
  axiosInstance: {
    get: jest.fn(),
  },
}));

const sampleOrder = {
  id: "o1",
  customerId: "c1",
  deliveryDate: "2026-05-01",
  deliveryCost: 0,
  paymentMade: false,
  paymentDate: "",
  isDelivery: false,
  quantity: 2,
  driverPaid: false,
  warehousePaid: false,
  retailPrice: 10,
  services: [{ description: "Walk" }],
  version: 1,
};

describe("customerListResponseSchema", () => {
  it("parses a valid customer list payload", () => {
    const data = [
      { id: "c1", name: "Ann", contactNumber: "555", city: "Town" },
    ];
    expect(customerListResponseSchema.parse(data)).toEqual(data);
  });

  it("rejects invalid rows", () => {
    expect(() => customerListResponseSchema.parse([{ id: 1 }])).toThrow();
  });
});

describe("orderListResponseSchema", () => {
  it("parses a valid order list payload", () => {
    const data = [sampleOrder];
    expect(orderListResponseSchema.parse(data)).toEqual(data);
  });
});

describe("partitionOrdersByPayment", () => {
  it("splits unpaid vs paid and sorts completed by delivery date descending", () => {
    const orders: Parameters<typeof partitionOrdersByPayment>[0] = [
      {
        id: "a",
        customer_id: "c1",
        delivery_date: "2026-01-01",
        delivery_cost: null,
        payment_made: false,
        payment_date: "",
        is_delivery: false,
        quantity: 1,
        driver_paid: false,
        warehouse_paid: false,
        retail_price: 1,
        services: [],
        version: 1,
        customers: { name: "Ann" },
      },
      {
        id: "b",
        customer_id: "c1",
        delivery_date: "2026-03-01",
        delivery_cost: null,
        payment_made: true,
        payment_date: "2026-03-02",
        is_delivery: false,
        quantity: 1,
        driver_paid: false,
        warehouse_paid: false,
        retail_price: 1,
        services: [],
        version: 1,
        customers: { name: "Ann" },
      },
      {
        id: "c",
        customer_id: "c1",
        delivery_date: "2026-02-01",
        delivery_cost: null,
        payment_made: true,
        payment_date: "2026-02-02",
        is_delivery: false,
        quantity: 1,
        driver_paid: false,
        warehouse_paid: false,
        retail_price: 1,
        services: [],
        version: 1,
        customers: { name: "Ann" },
      },
    ];
    const { outstandingOrders, completedOrders } = partitionOrdersByPayment(orders);
    expect(outstandingOrders.map((o) => o.id)).toEqual(["a"]);
    expect(completedOrders.map((o) => o.id)).toEqual(["b", "c"]);
  });
});

describe("pickCustomerFromMergedList", () => {
  it("finds a customer when id types differ", () => {
    const list = [{ id: "c1", name: "Ann" }];
    expect(pickCustomerFromMergedList(list, "c1")).toEqual(list[0]);
    expect(pickCustomerFromMergedList([{ id: 1, name: "x" }], "1")).toEqual({
      id: 1,
      name: "x",
    });
  });

  it("returns undefined when missing", () => {
    expect(pickCustomerFromMergedList([], "x")).toBeUndefined();
  });
});

describe("flattenOrdersFromCustomers", () => {
  it("flattens orders and prefers customer name on the row", () => {
    const customers = mergeOrdersIntoCustomers(
      [{ id: "c1", name: "Ann" }],
      [sampleOrder]
    );
    const flat = flattenOrdersFromCustomers(customers);
    expect(flat).toHaveLength(1);
    expect(flat[0].customers.name).toBe("Ann");
  });
});

describe("mergeOrdersIntoCustomers", () => {
  it("attaches orders and preserves customer names on orders", () => {
    const customers = [{ id: "c1", name: "Ann" }];
    const orders = [sampleOrder];
    const merged = mergeOrdersIntoCustomers(customers, orders);
    expect(merged).toHaveLength(1);
    expect(merged[0].orders).toHaveLength(1);
    expect(merged[0].orders![0].customers.name).toBe("Ann");
    expect(merged[0].orders![0].payment_made).toBe(false);
  });
});

describe("fetchCustomersWithOrders", () => {
  beforeEach(() => {
    (axiosInstance.get as jest.Mock).mockReset();
  });

  it("fetches both endpoints and returns merged customers", async () => {
    (axiosInstance.get as jest.Mock).mockImplementation((url: string) => {
      if (url === "/api/customer") {
        return Promise.resolve({ data: [{ id: "c1", name: "Ann" }] });
      }
      if (url === "/api/orders") {
        return Promise.resolve({ data: [sampleOrder] });
      }
      return Promise.reject(new Error(`unexpected ${url}`));
    });

    const result = await fetchCustomersWithOrders();
    expect(axiosInstance.get).toHaveBeenCalledWith("/api/customer");
    expect(axiosInstance.get).toHaveBeenCalledWith("/api/orders");
    expect(result[0].name).toBe("Ann");
    expect(result[0].orders).toHaveLength(1);
  });
});
